package com.hpms.backend.controller;

import com.hpms.backend.dto.BuildingDto;
import com.hpms.backend.enumCollection.FrontEndCodes;
import com.hpms.backend.exception.AlreadyExistsException;
import com.hpms.backend.exception.ResourceNotFoundException;
import com.hpms.backend.filter.BuildingFilter;
import com.hpms.backend.model.Building;
import com.hpms.backend.request.CreateBuildingRequest;
import com.hpms.backend.request.UpdateBuildingRequest;
import com.hpms.backend.response.ApiResponse;
import com.hpms.backend.service.inter.IBuildingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("${api.prefix}/buildings")
public class BuildingController {
    private final IBuildingService buildingService;

    @GetMapping
    public ResponseEntity<ApiResponse> getAllBuildings(@ModelAttribute BuildingFilter filters) {
        try {
            List<Building> buildings = buildingService.getBuildings(filters);
            List<BuildingDto> buildingDos = buildings.stream()
                    .map(buildingService::convertBuildingToDto)
                    .toList();

            return ResponseEntity.ok(new ApiResponse(FrontEndCodes.SUCCESS.getCode(), buildingDos));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(FrontEndCodes.ERROR.getCode(), e.getMessage()));
        }
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('Admin', 'Data maintainer')")
    public ResponseEntity<ApiResponse> createBuilding(@Valid @RequestBody CreateBuildingRequest request) {
        try {
            Building createdBuilding = buildingService.createBuilding(request);
            BuildingDto buildingDto = buildingService.convertBuildingToDto(createdBuilding);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponse(FrontEndCodes.SUCCESS.getCode(), buildingDto));

        } catch (AlreadyExistsException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(FrontEndCodes.ERROR.getCode(), e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(FrontEndCodes.ERROR.getCode(), e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('Admin', 'Data maintainer')")
    public ResponseEntity<ApiResponse> updateBuilding(@PathVariable Long id,
                                                      @Valid @RequestBody UpdateBuildingRequest request) {
        try {
            Building updatedBuilding = buildingService.updateBuilding(request, id);
            BuildingDto buildingDto = buildingService.convertBuildingToDto(updatedBuilding);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponse(FrontEndCodes.SUCCESS.getCode(), buildingDto));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(FrontEndCodes.ERROR.getCode(), e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(FrontEndCodes.ERROR.getCode(), e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('Admin', 'Data maintainer')")
    public ResponseEntity<ApiResponse> deleteBuilding(@PathVariable Long id) {
        try {
            buildingService.deleteBuilding(id);
            return ResponseEntity.ok(new ApiResponse(FrontEndCodes.SUCCESS.getCode(), null));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(FrontEndCodes.ERROR.getCode(), e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(FrontEndCodes.COMMON_GENERAL_ERROR.getCode(), e.getMessage()));
        }
    }
}