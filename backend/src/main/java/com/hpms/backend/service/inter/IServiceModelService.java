package com.hpms.backend.service.inter;

import com.hpms.backend.dto.ServiceModelDto;
import com.hpms.backend.filter.ServiceModelFilter;
import com.hpms.backend.model.Room;
import com.hpms.backend.model.ServiceModel;
import com.hpms.backend.request.CreateServiceModelRequest;
import com.hpms.backend.request.UpdateServiceModelRequest;

import java.time.LocalDate;
import java.util.List;
import java.util.function.Predicate;

public interface IServiceModelService {

    List<ServiceModel> getServiceModels(ServiceModelFilter filters);

    ServiceModel createServiceModel(CreateServiceModelRequest request);

    ServiceModel createVirtualServiceModel(List<Room> rooms, LocalDate checkInDate, LocalDate checkOutDate);

    ServiceModel updateServiceModel(UpdateServiceModelRequest request, long targetId);

    ServiceModel updateVirtualServiceModel(long targetId, Double cost, Long vatId);

    void deleteServiceModel(long targetId);

    ServiceModelDto convertServiceModelToDto(ServiceModel serviceModel);

    Predicate<ServiceModel> buildServiceModelPredicate(ServiceModelFilter filters);

    ServiceModel getOrCreateRoomsCostServiceModel();
}