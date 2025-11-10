package com.hpms.backend.service.implament;

import com.hpms.backend.dto.ServiceModelDto;
import com.hpms.backend.dto.VatDto;
import com.hpms.backend.enumCollection.FrontEndCodes;
import com.hpms.backend.exception.ResourceNotFoundException;
import com.hpms.backend.filter.ServiceModelFilter;
import com.hpms.backend.model.Room;
import com.hpms.backend.model.ServiceModel;
import com.hpms.backend.model.Vat;
import com.hpms.backend.repository.ServiceModelRepository;
import com.hpms.backend.repository.VatRepository;
import com.hpms.backend.request.CreateServiceModelRequest;
import com.hpms.backend.request.UpdateServiceModelRequest;
import com.hpms.backend.service.inter.IServiceModelService;
import com.hpms.backend.util.RoomPriceCalculationUtil;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.function.Predicate;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class ServiceModelService implements IServiceModelService {
    private final ServiceModelRepository serviceModelRepository;
    private final VatRepository vatRepository;
    private final ModelMapper modelMapper;

    @Transactional(readOnly = true)
    @Override
    public List<ServiceModel> getServiceModels(ServiceModelFilter filters) {
        if (filters == null) {
            return serviceModelRepository.findAll().stream()
                    .filter(serviceModel -> !serviceModel.getVirtual())
                    .collect(Collectors.toList());
        }

        return serviceModelRepository.findAll().stream()
                .filter(serviceModel -> !serviceModel.getVirtual())
                .filter(buildServiceModelPredicate(filters))
                .collect(Collectors.toList());
    }

    @Override
    public ServiceModel createServiceModel(CreateServiceModelRequest request) {
        Optional<Vat> vatOpt = vatRepository.findById(request.getVatId());
        if (vatOpt.isEmpty()) {
            throw new ResourceNotFoundException(FrontEndCodes.SERVICE_MODEL_VAT_NOT_FOUND.getCode());
        }

        ServiceModel serviceModel = new ServiceModel();
        serviceModel.setName(request.getName());
        serviceModel.setDescription(request.getDescription());
        serviceModel.setCost(request.getCost());
        serviceModel.setVirtual(false);
        serviceModel.setImmutable(false);
        serviceModel.setVat(vatOpt.get());

        return serviceModelRepository.save(serviceModel);
    }

    @Override
    public ServiceModel createVirtualServiceModel(List<Room> rooms, LocalDate checkInDate, LocalDate checkOutDate) {
        ServiceModel baseServiceModel = getOrCreateRoomsCostServiceModel();

        double totalCost = RoomPriceCalculationUtil.calculateRoomsCost(rooms, checkInDate, checkOutDate);

        ServiceModel virtualServiceModel = new ServiceModel();
        virtualServiceModel.setName(baseServiceModel.getName());
        virtualServiceModel.setDescription(baseServiceModel.getDescription());
        virtualServiceModel.setCost(totalCost);
        virtualServiceModel.setVirtual(true);
        virtualServiceModel.setImmutable(false);
        virtualServiceModel.setVat(baseServiceModel.getVat());

        return serviceModelRepository.save(virtualServiceModel);
    }

    ;

    @Override
    public ServiceModel updateServiceModel(UpdateServiceModelRequest request, long targetId) {
        Optional<ServiceModel> existingServiceModelOpt = serviceModelRepository.findById(targetId);
        if (existingServiceModelOpt.isEmpty()) {
            throw new ResourceNotFoundException(FrontEndCodes.SERVICE_MODEL_NOT_FOUND.getCode());
        }

        ServiceModel existingServiceModel = existingServiceModelOpt.get();

        if (Boolean.TRUE.equals(existingServiceModel.getImmutable())) {
            if (request.getVatId() != null) {
                Optional<Vat> vatOpt = vatRepository.findById(request.getVatId());
                if (vatOpt.isEmpty()) {
                    throw new ResourceNotFoundException(FrontEndCodes.SERVICE_MODEL_VAT_NOT_FOUND.getCode());
                }
                existingServiceModel.setVat(vatOpt.get());
            }
            return serviceModelRepository.save(existingServiceModel);
        }
        existingServiceModel.setName(request.getName());
        existingServiceModel.setDescription(request.getDescription());
        existingServiceModel.setCost(request.getCost());

        if (request.getVatId() != null) {
            Optional<Vat> vatOpt = vatRepository.findById(request.getVatId());
            if (vatOpt.isEmpty()) {
                throw new ResourceNotFoundException(FrontEndCodes.SERVICE_MODEL_VAT_NOT_FOUND.getCode());
            }
            existingServiceModel.setVat(vatOpt.get());
        }

        return serviceModelRepository.save(existingServiceModel);
    }

    @Override
    public ServiceModel updateVirtualServiceModel(long targetId, Double cost, Long vatId) {
        Optional<ServiceModel> existingServiceModelOpt = serviceModelRepository.findById(targetId);
        if (existingServiceModelOpt.isEmpty()) {
            throw new ResourceNotFoundException(FrontEndCodes.SERVICE_MODEL_NOT_FOUND.getCode());
        }

        ServiceModel existingServiceModel = existingServiceModelOpt.get();

        if (!existingServiceModel.getVirtual()) {
            throw new IllegalStateException(FrontEndCodes.SERVICE_MODEL_NOT_FOUND.getCode());
        }

        if (cost != null) {
            existingServiceModel.setCost(cost);
        }

        if (vatId != null) {
            Optional<Vat> vatOpt = vatRepository.findById(vatId);
            if (vatOpt.isEmpty()) {
                throw new ResourceNotFoundException(FrontEndCodes.SERVICE_MODEL_VAT_NOT_FOUND.getCode());
            }
            existingServiceModel.setVat(vatOpt.get());
        }

        return serviceModelRepository.save(existingServiceModel);
    }

    @Override
    public void deleteServiceModel(long targetId) {
        serviceModelRepository.findById(targetId).ifPresentOrElse(
                serviceModel -> {
                    if (Boolean.TRUE.equals(serviceModel.getImmutable())) {
                        throw new IllegalStateException(FrontEndCodes.SERVICE_MODEL_IMMUTABLE_DELETE.getCode());
                    }
                    if (serviceModel.getInvoices().isEmpty()) {
                        serviceModelRepository.deleteById(targetId);
                    } else {
                        throw new IllegalStateException(FrontEndCodes.SERVICE_MODEL_HAS_INVOICES.getCode());
                    }
                },
                () -> {
                    throw new ResourceNotFoundException(FrontEndCodes.SERVICE_MODEL_NOT_FOUND.getCode());
                }
        );
    }

    @Override
    @Transactional(readOnly = true)
    public ServiceModelDto convertServiceModelToDto(ServiceModel serviceModel) {
        ServiceModelDto serviceModelDto = modelMapper.map(serviceModel, ServiceModelDto.class);
        serviceModelDto.setVat(modelMapper.map(serviceModel.getVat(), VatDto.class));
        return serviceModelDto;
    }

    @Override
    public Predicate<ServiceModel> buildServiceModelPredicate(ServiceModelFilter filters) {
        Predicate<ServiceModel> predicate = serviceModel -> true;

        if (filters.getId() != null) {
            predicate = predicate.and(serviceModel -> serviceModel.getId().equals(filters.getId()));
        }

        if (filters.getName() != null && !filters.getName().isEmpty()) {
            predicate = predicate.and(serviceModel ->
                    serviceModel.getName().toLowerCase().contains(filters.getName().toLowerCase()));
        }

        if (filters.getVatIds() != null && !filters.getVatIds().isEmpty()) {
            predicate = predicate.and(serviceModel -> filters.getVatIds().contains(serviceModel.getVat().getId()));
        }

        if (filters.getMinCost() != null) {
            predicate = predicate.and(serviceModel -> serviceModel.getCost() >= filters.getMinCost());
        }

        if (filters.getMaxCost() != null) {
            predicate = predicate.and(serviceModel -> serviceModel.getCost() <= filters.getMaxCost());
        }

        return predicate;
    }

    @Override
    public ServiceModel getOrCreateRoomsCostServiceModel() {
        Optional<ServiceModel> existingServiceModel = serviceModelRepository.findById(1L);

        if (existingServiceModel.isPresent() &&
                "Rooms aggregated cost".equals(existingServiceModel.get().getName())) {
            ServiceModel serviceModel = existingServiceModel.get();

            if (serviceModel.getImmutable() == null || !serviceModel.getImmutable()) {
                serviceModel.setImmutable(true);
                serviceModel = serviceModelRepository.save(serviceModel);
            }

            return serviceModel;
        }

        ServiceModel roomsCostServiceModel = new ServiceModel();
        roomsCostServiceModel.setName("Rooms aggregated cost");
        roomsCostServiceModel.setDescription("Base service model for room costs in invoices");
        roomsCostServiceModel.setCost(0.0);
        roomsCostServiceModel.setVirtual(false);
        roomsCostServiceModel.setImmutable(true);

        Vat defaultVat = vatRepository.findAll().stream().findFirst()
                .orElseThrow(() -> new IllegalStateException("No VAT records found in database"));
        roomsCostServiceModel.setVat(defaultVat);

        return serviceModelRepository.save(roomsCostServiceModel);
    }
}