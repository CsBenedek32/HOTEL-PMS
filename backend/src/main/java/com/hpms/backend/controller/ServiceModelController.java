package com.hpms.backend.controller;

import com.hpms.backend.dto.ServiceModelDto;
import com.hpms.backend.enumCollection.FrontEndCodes;
import com.hpms.backend.exception.ResourceNotFoundException;
import com.hpms.backend.filter.ServiceModelFilter;
import com.hpms.backend.model.ServiceModel;
import com.hpms.backend.request.CreateServiceModelRequest;
import com.hpms.backend.request.UpdateServiceModelRequest;
import com.hpms.backend.response.ApiResponse;
import com.hpms.backend.service.inter.IServiceModelService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("${api.prefix}/service-models")
public class ServiceModelController {
    private final IServiceModelService serviceModelService;

    @GetMapping
    @PreAuthorize("hasAnyRole('Admin', 'Invoice Manager')")
    public ResponseEntity<ApiResponse> getAllServiceModels(@ModelAttribute ServiceModelFilter filters) {
        try {
            List<ServiceModel> serviceModels = serviceModelService.getServiceModels(filters);
            List<ServiceModelDto> serviceModelDtos = serviceModels.stream()
                    .map(serviceModelService::convertServiceModelToDto)
                    .toList();

            return ResponseEntity.ok(new ApiResponse(FrontEndCodes.SUCCESS.getCode(), serviceModelDtos));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(FrontEndCodes.ERROR.getCode(), e.getMessage()));
        }
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('Admin', 'Invoice Manager')")
    public ResponseEntity<ApiResponse> createServiceModel(@Valid @RequestBody CreateServiceModelRequest request) {
        try {
            ServiceModel createdServiceModel = serviceModelService.createServiceModel(request);
            ServiceModelDto serviceModelDto = serviceModelService.convertServiceModelToDto(createdServiceModel);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponse(FrontEndCodes.SUCCESS.getCode(), serviceModelDto));

        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(FrontEndCodes.ERROR.getCode(), e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(FrontEndCodes.ERROR.getCode(), e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('Admin', 'Invoice Manager')")
    public ResponseEntity<ApiResponse> updateServiceModel(@PathVariable Long id,
                                                         @Valid @RequestBody UpdateServiceModelRequest request) {
        try {
            ServiceModel updatedServiceModel = serviceModelService.updateServiceModel(request, id);
            ServiceModelDto serviceModelDto = serviceModelService.convertServiceModelToDto(updatedServiceModel);

            return ResponseEntity.ok(new ApiResponse(FrontEndCodes.SUCCESS.getCode(), serviceModelDto));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(FrontEndCodes.ERROR.getCode(), e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(FrontEndCodes.ERROR.getCode(), e.getMessage()));
        }
    }

    @PutMapping("/{id}/virtual")
    @PreAuthorize("hasAnyRole('Admin', 'Invoice Manager')")
    public ResponseEntity<ApiResponse> updateVirtualServiceModel(@PathVariable Long id,
                                                               @RequestParam(required = false) Double cost,
                                                               @RequestParam(required = false) Long vatId) {
        try {
            ServiceModel updatedServiceModel = serviceModelService.updateVirtualServiceModel(id, cost, vatId);
            ServiceModelDto serviceModelDto = serviceModelService.convertServiceModelToDto(updatedServiceModel);

            return ResponseEntity.ok(new ApiResponse(FrontEndCodes.SUCCESS.getCode(), serviceModelDto));
        } catch (ResourceNotFoundException | IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(FrontEndCodes.ERROR.getCode(), e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(FrontEndCodes.ERROR.getCode(), e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('Admin', 'Invoice Manager')")
    public ResponseEntity<ApiResponse> deleteServiceModel(@PathVariable Long id) {
        try {
            serviceModelService.deleteServiceModel(id);
            return ResponseEntity.ok(new ApiResponse(FrontEndCodes.SUCCESS.getCode(), null));
        } catch (ResourceNotFoundException | IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(FrontEndCodes.ERROR.getCode(), e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(FrontEndCodes.COMMON_GENERAL_ERROR.getCode(), e.getMessage()));
        }
    }
}