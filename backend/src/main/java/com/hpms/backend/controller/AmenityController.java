package com.hpms.backend.controller;

import com.hpms.backend.dto.AmenityDto;
import com.hpms.backend.enumCollection.FrontEndCodes;
import com.hpms.backend.exception.AlreadyExistsException;
import com.hpms.backend.exception.ResourceNotFoundException;
import com.hpms.backend.filter.AmenityFilter;
import com.hpms.backend.model.Amenity;
import com.hpms.backend.request.CreateAmenityRequest;
import com.hpms.backend.request.UpdateAmenityRequest;
import com.hpms.backend.response.ApiResponse;
import com.hpms.backend.service.inter.IAmenityService;
import com.hpms.backend.service.pdf.AmenitiesPdfService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("${api.prefix}/amenities")
public class AmenityController {
    private final IAmenityService amenityService;
    private final AmenitiesPdfService amenitiesPdfService;


    @GetMapping
    public ResponseEntity<ApiResponse> getAllAmenities(@ModelAttribute AmenityFilter filters) {
        try {
            List<Amenity> amenities = amenityService.getAmenities(filters);
            List<AmenityDto> amenityDtos = amenities.stream()
                    .map(amenityService::convertAmenityToDto)
                    .toList();

            return ResponseEntity.ok(new ApiResponse(FrontEndCodes.SUCCESS.getCode(), amenityDtos));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(FrontEndCodes.ERROR.getCode(), e.getMessage()));
        }
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('Admin', 'Data maintainer')")
    public ResponseEntity<ApiResponse> createAmenity(@Valid @RequestBody CreateAmenityRequest request) {
        try {
            Amenity createdAmenity = amenityService.createAmenity(request);
            AmenityDto amenityDto = amenityService.convertAmenityToDto(createdAmenity);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponse(FrontEndCodes.SUCCESS.getCode(), amenityDto));

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
    public ResponseEntity<ApiResponse> updateAmenity(@PathVariable Long id,
                                                     @Valid @RequestBody UpdateAmenityRequest request) {
        try {
            Amenity updatedAmenity = amenityService.updateAmenity(request, id);
            AmenityDto amenityDto = amenityService.convertAmenityToDto(updatedAmenity);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponse(FrontEndCodes.SUCCESS.getCode(), amenityDto));

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
    public ResponseEntity<ApiResponse> deleteAmenity(@PathVariable Long id) {
        try {
            amenityService.deleteAmenity(id);
            return ResponseEntity.ok(new ApiResponse(FrontEndCodes.SUCCESS.getCode(), null));

        } catch (IllegalStateException | ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(FrontEndCodes.ERROR.getCode(), e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(FrontEndCodes.COMMON_GENERAL_ERROR.getCode(), e.getMessage()));
        }
    }

    @GetMapping("/export/pdf")
    @PreAuthorize("hasAnyRole('Admin', 'Data maintainer')")
    public ResponseEntity<byte[]> exportAmenitiesToPdf() {
        try {
            byte[] pdfBytes = amenitiesPdfService.generateAmenitiesPdf();

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "amenities-report.pdf");

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(pdfBytes);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}