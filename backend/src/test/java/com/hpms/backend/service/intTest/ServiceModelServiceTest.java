package com.hpms.backend.service.intTest;

import com.hpms.backend.model.Room;
import com.hpms.backend.model.RoomType;
import com.hpms.backend.model.ServiceModel;
import com.hpms.backend.model.Vat;
import com.hpms.backend.repository.ServiceModelRepository;
import com.hpms.backend.repository.VatRepository;
import com.hpms.backend.request.CreateServiceModelRequest;
import com.hpms.backend.request.UpdateServiceModelRequest;
import com.hpms.backend.service.implament.ServiceModelService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.modelmapper.ModelMapper;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ServiceModelServiceTest {

    @Mock
    private ServiceModelRepository serviceModelRepository;

    @Mock
    private VatRepository vatRepository;

    @Mock
    private ModelMapper modelMapper;

    @InjectMocks
    private ServiceModelService serviceModelService;

    private Vat vat;
    private ServiceModel serviceModel;

    @BeforeEach
    public void setUp() {
        vat = new Vat();
        vat.setId(1L);
        vat.setName("Standard VAT");
        vat.setPercentage(27.0);

        serviceModel = new ServiceModel();
        serviceModel.setId(1L);
        serviceModel.setName("Test Service");
        serviceModel.setDescription("Test Description");
        serviceModel.setCost(1000.0);
        serviceModel.setVirtual(false);
        serviceModel.setImmutable(false);
        serviceModel.setVat(vat);
    }

    @Test
    public void testCreateServiceModel_ValidRequest_ShouldSucceed() {
        CreateServiceModelRequest request = new CreateServiceModelRequest();
        request.setName("New Service");
        request.setDescription("New Description");
        request.setCost(500.0);
        request.setVatId(1L);

        when(vatRepository.findById(1L)).thenReturn(Optional.of(vat));
        when(serviceModelRepository.save(any(ServiceModel.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        ServiceModel result = serviceModelService.createServiceModel(request);

        assertNotNull(result);
        assertEquals("New Service", result.getName());
        assertEquals("New Description", result.getDescription());
        assertEquals(500.0, result.getCost());
        assertFalse(result.getVirtual());
        assertFalse(result.getImmutable());
        assertEquals(vat, result.getVat());

        verify(vatRepository, times(1)).findById(1L);
        verify(serviceModelRepository, times(1)).save(any(ServiceModel.class));
    }

    @Test
    public void testCreateVirtualServiceModel_MultipleRooms_ShouldCalculateCorrectCost() {
        RoomType roomType1 = new RoomType();
        roomType1.setPrice(100.0);

        RoomType roomType2 = new RoomType();
        roomType2.setPrice(150.0);

        Room room1 = new Room();
        room1.setId(1L);
        room1.setRoomType(roomType1);

        Room room2 = new Room();
        room2.setId(2L);
        room2.setRoomType(roomType2);

        ServiceModel baseServiceModel = new ServiceModel();
        baseServiceModel.setName("Rooms aggregated cost");
        baseServiceModel.setDescription("Base service");
        baseServiceModel.setVat(vat);

        LocalDate checkIn = LocalDate.of(2025, 1, 10);
        LocalDate checkOut = LocalDate.of(2025, 1, 15);

        when(serviceModelRepository.findById(1L)).thenReturn(Optional.of(baseServiceModel));
        when(serviceModelRepository.save(any(ServiceModel.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        ServiceModel result = serviceModelService.createVirtualServiceModel(
                List.of(room1, room2), checkIn, checkOut);

        assertNotNull(result);
        assertEquals("Rooms aggregated cost", result.getName());
        assertTrue(result.getVirtual());
        assertFalse(result.getImmutable());
        assertEquals(1250.0, result.getCost());
        assertEquals(vat, result.getVat());

        verify(serviceModelRepository, times(2)).save(any(ServiceModel.class));
    }

    @Test
    public void testGetOrCreateRoomsCostServiceModel_FirstCall_ShouldCreateNew() {
        when(serviceModelRepository.findById(1L)).thenReturn(Optional.empty());
        when(vatRepository.findAll()).thenReturn(List.of(vat));
        when(serviceModelRepository.save(any(ServiceModel.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        ServiceModel result = serviceModelService.getOrCreateRoomsCostServiceModel();

        assertNotNull(result);
        assertEquals("Rooms aggregated cost", result.getName());
        assertTrue(result.getImmutable());
        assertFalse(result.getVirtual());
        assertEquals(0.0, result.getCost());
        assertEquals(vat, result.getVat());

        verify(serviceModelRepository, times(1)).save(any(ServiceModel.class));
    }

    @Test
    public void testGetOrCreateRoomsCostServiceModel_AlreadyExists_ShouldReturnExisting() {
        ServiceModel existing = new ServiceModel();
        existing.setId(1L);
        existing.setName("Rooms aggregated cost");
        existing.setImmutable(true);
        existing.setVat(vat);

        when(serviceModelRepository.findById(1L)).thenReturn(Optional.of(existing));

        ServiceModel result = serviceModelService.getOrCreateRoomsCostServiceModel();

        assertNotNull(result);
        assertEquals("Rooms aggregated cost", result.getName());
        assertTrue(result.getImmutable());
        assertEquals(existing, result);

        verify(serviceModelRepository, never()).save(any(ServiceModel.class));
    }

    @Test
    public void testGetOrCreateRoomsCostServiceModel_ExistsButNotImmutable_ShouldSetImmutable() {
        ServiceModel existing = new ServiceModel();
        existing.setId(1L);
        existing.setName("Rooms aggregated cost");
        existing.setImmutable(false);
        existing.setVat(vat);

        when(serviceModelRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(serviceModelRepository.save(any(ServiceModel.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        ServiceModel result = serviceModelService.getOrCreateRoomsCostServiceModel();

        assertNotNull(result);
        assertTrue(result.getImmutable());

        verify(serviceModelRepository, times(1)).save(existing);
    }

    @Test
    public void testUpdateServiceModel_RegularService_ShouldUpdate() {
        UpdateServiceModelRequest request = new UpdateServiceModelRequest();
        request.setName("Updated Name");
        request.setDescription("Updated Description");
        request.setCost(2000.0);
        request.setVatId(1L);

        when(serviceModelRepository.findById(1L)).thenReturn(Optional.of(serviceModel));
        when(vatRepository.findById(1L)).thenReturn(Optional.of(vat));
        when(serviceModelRepository.save(any(ServiceModel.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        ServiceModel result = serviceModelService.updateServiceModel(request, 1L);

        assertNotNull(result);
        assertEquals("Updated Name", result.getName());
        assertEquals("Updated Description", result.getDescription());
        assertEquals(2000.0, result.getCost());

        verify(serviceModelRepository, times(1)).save(serviceModel);
    }

    @Test
    public void testUpdateServiceModel_ImmutableService_ShouldOnlyUpdateVat() {
        serviceModel.setImmutable(true);

        UpdateServiceModelRequest request = new UpdateServiceModelRequest();
        request.setName("Should Not Change");
        request.setDescription("Should Not Change");
        request.setCost(9999.0);
        request.setVatId(1L);

        when(serviceModelRepository.findById(1L)).thenReturn(Optional.of(serviceModel));
        when(vatRepository.findById(1L)).thenReturn(Optional.of(vat));
        when(serviceModelRepository.save(any(ServiceModel.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        ServiceModel result = serviceModelService.updateServiceModel(request, 1L);

        assertNotNull(result);
        assertEquals("Test Service", result.getName());
        assertEquals("Test Description", result.getDescription());
        assertEquals(1000.0, result.getCost());
        assertEquals(vat, result.getVat());

        verify(serviceModelRepository, times(1)).save(serviceModel);
    }

    @Test
    public void testUpdateVirtualServiceModel_ShouldUpdateCostAndVat() {
        serviceModel.setVirtual(true);

        Vat newVat = new Vat();
        newVat.setId(2L);
        newVat.setPercentage(5.0);

        when(serviceModelRepository.findById(1L)).thenReturn(Optional.of(serviceModel));
        when(vatRepository.findById(2L)).thenReturn(Optional.of(newVat));
        when(serviceModelRepository.save(any(ServiceModel.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        ServiceModel result = serviceModelService.updateVirtualServiceModel(1L, 3000.0, 2L);

        assertNotNull(result);
        assertEquals(3000.0, result.getCost());
        assertEquals(newVat, result.getVat());

        verify(serviceModelRepository, times(1)).save(serviceModel);
    }

    @Test
    public void testDeleteServiceModel_WithoutInvoices_ShouldDelete() {
        when(serviceModelRepository.findById(1L)).thenReturn(Optional.of(serviceModel));

        serviceModelService.deleteServiceModel(1L);

        verify(serviceModelRepository, times(1)).deleteById(1L);
    }

    @Test
    public void testDeleteServiceModel_Immutable_ShouldThrowException() {
        serviceModel.setImmutable(true);

        when(serviceModelRepository.findById(1L)).thenReturn(Optional.of(serviceModel));

        assertThrows(IllegalStateException.class, () -> {
            serviceModelService.deleteServiceModel(1L);
        });

        verify(serviceModelRepository, never()).deleteById(any());
    }
}
