package com.hpms.backend.controller;

import com.hpms.backend.dto.BedTypeDto;
import com.hpms.backend.enumCollection.FrontEndCodes;
import com.hpms.backend.exception.AlreadyExistsException;
import com.hpms.backend.exception.ResourceNotFoundException;
import com.hpms.backend.filter.BedTypeFilter;
import com.hpms.backend.model.BedType;
import com.hpms.backend.request.CreateBedTypeRequest;
import com.hpms.backend.request.UpdateBedTypeRequest;
import com.hpms.backend.response.ApiResponse;
import com.hpms.backend.service.inter.IBedTypeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("${api.prefix}/bed-types")
public class BedTypeController {
    private final IBedTypeService bedTypeService;

    @GetMapping
    public ResponseEntity<ApiResponse> getAllBedTypes(@ModelAttribute BedTypeFilter filters) {
        try {
            List<BedType> bedTypes = bedTypeService.getBedTypes(filters);
            List<BedTypeDto> bedTypeDtos = bedTypes.stream()
                    .map(bedTypeService::convertBedTypeToDto)
                    .toList();

            return ResponseEntity.ok(new ApiResponse(FrontEndCodes.SUCCESS.getCode(), bedTypeDtos));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(FrontEndCodes.ERROR.getCode(), e.getMessage()));
        }
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('Admin', 'Data maintainer')")
    public ResponseEntity<ApiResponse> createBedType(@Valid @RequestBody CreateBedTypeRequest request) {
        try {
            BedType createdBedType = bedTypeService.createBedType(request);
            BedTypeDto bedTypeDto = bedTypeService.convertBedTypeToDto(createdBedType);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponse(FrontEndCodes.SUCCESS.getCode(), bedTypeDto));

        } catch (AlreadyExistsException | ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(FrontEndCodes.ERROR.getCode(), e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(FrontEndCodes.ERROR.getCode(), e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('Admin', 'Data maintainer')")
    public ResponseEntity<ApiResponse> updateBedType(@PathVariable Long id,
                                                     @Valid @RequestBody UpdateBedTypeRequest request) {
        try {
            BedType updatedBedType = bedTypeService.updateBedType(request, id);
            BedTypeDto bedTypeDto = bedTypeService.convertBedTypeToDto(updatedBedType);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponse(FrontEndCodes.SUCCESS.getCode(), bedTypeDto));

        } catch (AlreadyExistsException | ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(FrontEndCodes.ERROR.getCode(), e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(FrontEndCodes.ERROR.getCode(), e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('Admin', 'Data maintainer')")
    public ResponseEntity<ApiResponse> deleteBedType(@PathVariable Long id) {
        try {
            bedTypeService.deleteBedType(id);
            return ResponseEntity.ok(new ApiResponse(FrontEndCodes.SUCCESS.getCode(), null));

        } catch (IllegalStateException | ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(FrontEndCodes.ERROR.getCode(), e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(FrontEndCodes.COMMON_GENERAL_ERROR.getCode(), e.getMessage()));
        }
    }
}