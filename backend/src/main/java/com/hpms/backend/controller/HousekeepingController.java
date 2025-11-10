package com.hpms.backend.controller;

import com.hpms.backend.dto.HousekeepingDto;
import com.hpms.backend.enumCollection.FrontEndCodes;
import com.hpms.backend.enumCollection.HousekeepingStatus;
import com.hpms.backend.exception.ResourceNotFoundException;
import com.hpms.backend.filter.HousekeepingFilter;
import com.hpms.backend.model.Housekeeping;
import com.hpms.backend.request.CreateHousekeepingRequest;
import com.hpms.backend.request.UpdateHousekeepingRequest;
import com.hpms.backend.response.ApiResponse;
import com.hpms.backend.service.inter.IHousekeepingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("${api.prefix}/housekeeping")
public class HousekeepingController {
    private final IHousekeepingService housekeepingService;

    @GetMapping
    public ResponseEntity<ApiResponse> getAllHousekeeping() {
        try {
            List<Housekeeping> housekeepings = housekeepingService.getHousekeepings();
            List<HousekeepingDto> housekeepingDtos = housekeepings.stream()
                    .map(housekeepingService::convertHousekeepingToDto)
                    .toList();

            return ResponseEntity.ok(new ApiResponse(FrontEndCodes.SUCCESS.getCode(), housekeepingDtos));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(FrontEndCodes.ERROR.getCode(), e.getMessage()));
        }
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('Admin', 'Housekeeping')")
    public ResponseEntity<ApiResponse> createHousekeeping(@Valid @RequestBody CreateHousekeepingRequest request) {
        try {
            Housekeeping createdHousekeeping = housekeepingService.createHousekeeping(request);
            HousekeepingDto housekeepingDto = housekeepingService.convertHousekeepingToDto(createdHousekeeping);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponse(FrontEndCodes.SUCCESS.getCode(), housekeepingDto));

        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(FrontEndCodes.ERROR.getCode(), e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(FrontEndCodes.ERROR.getCode(), e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('Admin', 'Housekeeping')")
    public ResponseEntity<ApiResponse> updateHousekeeping(@PathVariable Long id,
                                                          @Valid @RequestBody UpdateHousekeepingRequest request) {
        try {
            Housekeeping updatedHousekeeping = housekeepingService.updateHousekeeping(request, id);
            HousekeepingDto housekeepingDto = housekeepingService.convertHousekeepingToDto(updatedHousekeeping);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponse(FrontEndCodes.SUCCESS.getCode(), housekeepingDto));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(FrontEndCodes.ERROR.getCode(), e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(FrontEndCodes.ERROR.getCode(), e.getMessage()));
        }
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('Admin', 'Housekeeping')")
    public ResponseEntity<ApiResponse> updateHousekeepingStatus(@PathVariable Long id,
                                                                @RequestParam HousekeepingStatus status) {
        try {
            Housekeeping updatedHousekeeping = housekeepingService.updateHouseKeepingStatus(status, id);
            HousekeepingDto housekeepingDto = housekeepingService.convertHousekeepingToDto(updatedHousekeeping);

            return ResponseEntity.ok(new ApiResponse(FrontEndCodes.SUCCESS.getCode(), housekeepingDto));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(FrontEndCodes.ERROR.getCode(), e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(FrontEndCodes.ERROR.getCode(), e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('Admin', 'Housekeeping')")
    public ResponseEntity<ApiResponse> deleteHousekeeping(@PathVariable Long id) {
        try {
            housekeepingService.deleteHousekeeping(id);
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