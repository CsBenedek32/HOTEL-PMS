package com.hpms.backend.service.intTest;

import com.hpms.backend.enumCollection.BookingInvoiceEnum;
import com.hpms.backend.enumCollection.PaymentStatusEnum;
import com.hpms.backend.model.Booking;
import com.hpms.backend.model.Invoice;
import com.hpms.backend.model.Room;
import com.hpms.backend.model.ServiceModel;
import com.hpms.backend.repository.BookingRepository;
import com.hpms.backend.repository.InvoiceRepository;
import com.hpms.backend.repository.ServiceModelRepository;
import com.hpms.backend.request.CreateInvoiceRequest;
import com.hpms.backend.service.implament.InvoiceService;
import com.hpms.backend.service.inter.IBookingService;
import com.hpms.backend.service.inter.IServiceModelService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.modelmapper.ModelMapper;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class InvoiceServiceTest {

    @Mock
    private InvoiceRepository invoiceRepository;

    @Mock
    private BookingRepository bookingRepository;

    @Mock
    private ServiceModelRepository serviceModelRepository;

    @Mock
    private ModelMapper modelMapper;

    @Mock
    private IServiceModelService serviceModelService;

    @Mock
    private IBookingService bookingService;

    @InjectMocks
    private InvoiceService invoiceService;

    private Invoice invoice;
    private Booking booking;
    private ServiceModel serviceModel;

    @BeforeEach
    public void setUp() {
        invoice = new Invoice();
        invoice.setId(1L);
        invoice.setName("Test Invoice");
        invoice.setActive(true);
        invoice.setPaymentStatus(PaymentStatusEnum.PENDING);
        invoice.setServiceModels(new ArrayList<>());

        booking = new Booking();
        booking.setId(1L);
        booking.setCheckInDate(LocalDate.of(2025, 1, 10));
        booking.setCheckOutDate(LocalDate.of(2025, 1, 15));
        booking.setRooms(new HashSet<>());

        serviceModel = new ServiceModel();
        serviceModel.setId(1L);
        serviceModel.setCost(1000.0);
        serviceModel.setVirtual(false);
    }

    @Test
    public void testCreateInvoice_WithInitialBooking_ShouldSyncAutomatically() {
        CreateInvoiceRequest request = new CreateInvoiceRequest();
        request.setName("Test Invoice");
        request.setInitialBookingId(1L);

        when(bookingRepository.findById(1L)).thenReturn(Optional.of(booking));
        when(invoiceRepository.save(any(Invoice.class)))
                .thenAnswer(invocation -> {
                    Invoice inv = invocation.getArgument(0);
                    inv.setId(1L);
                    return inv;
                });
        when(invoiceRepository.findById(1L)).thenReturn(Optional.of(invoice));
        when(bookingRepository.findByInvoiceIdAndActive(1L, true))
                .thenReturn(List.of(booking));
        when(bookingRepository.save(any(Booking.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        Invoice result = invoiceService.createInvoice(request);

        assertNotNull(result);
        assertEquals("Test Invoice", result.getName());
        assertTrue(result.getActive());
        assertEquals(PaymentStatusEnum.PENDING, result.getPaymentStatus());

        verify(bookingRepository, times(2)).findById(1L);
        verify(invoiceRepository, atLeast(2)).save(any(Invoice.class));
    }

    @Test
    public void testCreateInvoice_WithoutBooking_ShouldCreateEmpty() {
        CreateInvoiceRequest request = new CreateInvoiceRequest();
        request.setName("Empty Invoice");
        request.setInitialBookingId(null);

        when(invoiceRepository.save(any(Invoice.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        Invoice result = invoiceService.createInvoice(request);

        assertNotNull(result);
        assertEquals("Empty Invoice", result.getName());
        assertTrue(result.getActive());

        verify(bookingRepository, never()).findById(any());
        verify(invoiceRepository, times(1)).save(any(Invoice.class));
    }

    @Test
    public void testSyncWithBookings_WithRooms_ShouldCreateVirtualService() {
        Room room = new Room();
        booking.getRooms().add(room);
        booking.setScynStatus(BookingInvoiceEnum.NOT_SYNCED);

        ServiceModel virtualService = new ServiceModel();
        virtualService.setCost(500.0);
        virtualService.setVirtual(true);

        when(invoiceRepository.findById(1L)).thenReturn(Optional.of(invoice));
        when(bookingRepository.findByInvoiceIdAndActive(1L, true))
                .thenReturn(List.of(booking));
        when(serviceModelService.createVirtualServiceModel(
                any(), any(LocalDate.class), any(LocalDate.class)))
                .thenReturn(virtualService);
        when(invoiceRepository.save(any(Invoice.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));
        when(bookingRepository.save(any(Booking.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        invoiceService.syncWithBookings(1L);

        assertEquals(BookingInvoiceEnum.SYNCED, booking.getScynStatus());
        verify(serviceModelService, times(1)).createVirtualServiceModel(any(), any(), any());
        verify(bookingRepository, times(1)).save(booking);
        verify(invoiceRepository, times(1)).save(invoice);
    }

    @Test
    public void testAddInvoiceBookings_ValidBooking_ShouldAddAndSync() {
        booking.setActive(true);
        booking.setScynStatus(BookingInvoiceEnum.NO_INVOICE);

        when(invoiceRepository.findById(1L)).thenReturn(Optional.of(invoice));
        when(bookingRepository.findById(1L)).thenReturn(Optional.of(booking));
        when(bookingRepository.findByInvoiceIdAndActive(1L, true))
                .thenReturn(List.of(booking));
        when(bookingRepository.save(any(Booking.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));
        when(invoiceRepository.save(any(Invoice.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        Invoice result = invoiceService.addInvoiceBookings(1L, 1L);

        assertNotNull(result);
        assertEquals(invoice, booking.getInvoice());

        verify(bookingRepository, times(1)).findById(1L);
        verify(bookingRepository, atLeastOnce()).save(booking);
    }

    @Test
    public void testAddInvoiceBookings_BookingAlreadyTaken_ShouldThrowException() {
        booking.setActive(true);
        booking.setScynStatus(BookingInvoiceEnum.SYNCED);

        when(invoiceRepository.findById(1L)).thenReturn(Optional.of(invoice));
        when(bookingRepository.findById(1L)).thenReturn(Optional.of(booking));

        assertThrows(IllegalArgumentException.class, () -> {
            invoiceService.addInvoiceBookings(1L, 1L);
        });

        verify(bookingRepository, never()).save(any());
    }

    @Test
    public void testRemoveInvoiceBookings_ShouldClearInvoiceAndResync() {
        booking.setActive(true);
        booking.setInvoice(invoice);
        booking.setScynStatus(BookingInvoiceEnum.SYNCED);

        when(invoiceRepository.findById(1L)).thenReturn(Optional.of(invoice));
        when(bookingRepository.findById(1L)).thenReturn(Optional.of(booking));
        when(bookingRepository.findByInvoiceIdAndActive(1L, true))
                .thenReturn(List.of());
        when(bookingRepository.save(any(Booking.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));
        when(invoiceRepository.save(any(Invoice.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        Invoice result = invoiceService.removeInvoiceBookings(1L, 1L);

        assertNotNull(result);
        assertNull(booking.getInvoice());
        assertEquals(BookingInvoiceEnum.NO_INVOICE, booking.getScynStatus());

        verify(bookingRepository, atLeastOnce()).save(booking);
        verify(invoiceRepository, times(2)).save(any());
    }

    @Test
    public void testUpdateInvoiceServices_ShouldRecalculateTotalSum() {
        ServiceModel service1 = new ServiceModel();
        service1.setId(1L);
        service1.setCost(1000.0);

        ServiceModel service2 = new ServiceModel();
        service2.setId(2L);
        service2.setCost(500.0);

        when(invoiceRepository.findById(1L)).thenReturn(Optional.of(invoice));
        when(serviceModelRepository.findAllById(List.of(1L, 2L)))
                .thenReturn(List.of(service1, service2));
        when(invoiceRepository.save(any(Invoice.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        Invoice result = invoiceService.updateInvoiceServices(1L, List.of(1L, 2L));

        assertNotNull(result);
        assertNotNull(result.getTotalSum());

        verify(serviceModelRepository, times(1)).findAllById(List.of(1L, 2L));
        verify(invoiceRepository, times(1)).save(invoice);
    }

    @Test
    public void testDeleteInvoice_ShouldSetInactiveAndClearBookings() {
        booking.setInvoice(invoice);
        booking.setScynStatus(BookingInvoiceEnum.SYNCED);
        invoice.setBookings(List.of(booking));

        when(invoiceRepository.findById(1L)).thenReturn(Optional.of(invoice));
        when(bookingRepository.save(any(Booking.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));
        when(invoiceRepository.save(any(Invoice.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        invoiceService.deleteInvoice(1L);

        assertFalse(invoice.getActive());
        assertNull(booking.getInvoice());
        assertNull(booking.getScynStatus());

        verify(bookingRepository, times(1)).save(booking);
        verify(invoiceRepository, times(1)).save(invoice);
    }
}
