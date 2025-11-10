package com.hpms.backend.controller;

import com.hpms.backend.dto.VatDto;
import com.hpms.backend.enumCollection.FrontEndCodes;
import com.hpms.backend.exception.AlreadyExistsException;
import com.hpms.backend.exception.ResourceNotFoundException;
import com.hpms.backend.filter.VatFilter;
import com.hpms.backend.model.Vat;
import com.hpms.backend.request.CreateVatRequest;
import com.hpms.backend.request.UpdateVatRequest;
import com.hpms.backend.response.ApiResponse;
import com.hpms.backend.service.inter.IVatService;
import com.hpms.backend.service.pdf.VatPdfService;
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
@RequestMapping("${api.prefix}/vats")
public class VatController {
    private final IVatService vatService;
    private final VatPdfService vatPdfService;

    @GetMapping
    @PreAuthorize("hasAnyRole('Admin', 'Invoice Manager')")
    public ResponseEntity<ApiResponse> getAllVats(@ModelAttribute VatFilter filters) {
        try {
            List<Vat> vats = vatService.getVats(filters);
            List<VatDto> vatDtos = vats.stream()
                    .map(vatService::convertVatToDto)
                    .toList();

            return ResponseEntity.ok(new ApiResponse(FrontEndCodes.SUCCESS.getCode(), vatDtos));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(FrontEndCodes.ERROR.getCode(), e.getMessage()));
        }
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('Admin', 'Invoice Manager')")
    public ResponseEntity<ApiResponse> createVat(@Valid @RequestBody CreateVatRequest request) {
        try {
            Vat createdVat = vatService.createVat(request);
            VatDto vatDto = vatService.convertVatToDto(createdVat);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponse(FrontEndCodes.SUCCESS.getCode(), vatDto));

        } catch (AlreadyExistsException | ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(FrontEndCodes.ERROR.getCode(), e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(FrontEndCodes.ERROR.getCode(), e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('Admin', 'Invoice Manager')")
    public ResponseEntity<ApiResponse> updateVat(@PathVariable Long id,
                                                 @Valid @RequestBody UpdateVatRequest request) {
        try {
            Vat updatedVat = vatService.updateVat(request, id);
            VatDto vatDto = vatService.convertVatToDto(updatedVat);

            return ResponseEntity.ok(new ApiResponse(FrontEndCodes.SUCCESS.getCode(), vatDto));
        } catch (ResourceNotFoundException | AlreadyExistsException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(FrontEndCodes.ERROR.getCode(), e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(FrontEndCodes.ERROR.getCode(), e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('Admin', 'Invoice Manager')")
    public ResponseEntity<ApiResponse> deleteVat(@PathVariable Long id) {
        try {
            vatService.deleteVat(id);
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
    @PreAuthorize("hasAnyRole('Admin', 'Invoice Manager')")
    public ResponseEntity<byte[]> exportVatToPdf() {
        try {
            byte[] pdfBytes = vatPdfService.generateVatPdf();

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "vat-rates-report.pdf");

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(pdfBytes);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}