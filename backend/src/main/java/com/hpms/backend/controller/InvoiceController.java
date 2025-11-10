package com.hpms.backend.controller;

import com.hpms.backend.dto.InvoiceDto;
import com.hpms.backend.enumCollection.FrontEndCodes;
import com.hpms.backend.exception.ResourceNotFoundException;
import com.hpms.backend.filter.InvoiceFilter;
import com.hpms.backend.model.Invoice;
import com.hpms.backend.request.CreateInvoiceRequest;
import com.hpms.backend.request.UpdateInvoiceRequest;
import com.hpms.backend.response.ApiResponse;
import com.hpms.backend.service.inter.IInvoiceService;
import com.hpms.backend.service.pdf.InvoicePdfService;
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
@RequestMapping("${api.prefix}/invoices")
public class InvoiceController {
    private final IInvoiceService invoiceService;
    private final InvoicePdfService invoicePdfService;

    @GetMapping
    @PreAuthorize("hasAnyRole('Admin', 'Invoice Manager', 'Receptionist')")
    public ResponseEntity<ApiResponse> getAllInvoices(@ModelAttribute InvoiceFilter filters) {
        try {
            List<Invoice> invoices = invoiceService.getInvoices(filters);
            List<InvoiceDto> invoiceDtos = invoices.stream()
                    .map(invoiceService::convertInvoiceToDto)
                    .toList();

            return ResponseEntity.ok(new ApiResponse(FrontEndCodes.SUCCESS.getCode(), invoiceDtos));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(FrontEndCodes.ERROR.getCode(), e.getMessage()));
        }
    }

    @PostMapping("/{id}/services")
    @PreAuthorize("hasAnyRole('Admin', 'Invoice Manager')")
    public ResponseEntity<ApiResponse> updateInvoiceServices(@PathVariable Long id, @RequestBody List<Long> serviceIds) {
        try {
            Invoice updatedInvoice = invoiceService.updateInvoiceServices(id, serviceIds);
            InvoiceDto invoiceDto = invoiceService.convertInvoiceToDto(updatedInvoice);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponse(FrontEndCodes.SUCCESS.getCode(), invoiceDto));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(FrontEndCodes.ERROR.getCode(), e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(FrontEndCodes.ERROR.getCode(), e.getMessage()));
        }
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('Admin', 'Invoice Manager', 'Receptionist')")
    public ResponseEntity<ApiResponse> createInvoice(@Valid @RequestBody CreateInvoiceRequest request) {
        try {
            Invoice createdInvoice = invoiceService.createInvoice(request);
            InvoiceDto invoiceDto = invoiceService.convertInvoiceToDto(createdInvoice);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponse(FrontEndCodes.SUCCESS.getCode(), invoiceDto));

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
    public ResponseEntity<ApiResponse> updateInvoice(@PathVariable Long id,
                                                     @Valid @RequestBody UpdateInvoiceRequest request) {
        try {
            Invoice updatedInvoice = invoiceService.updateInvoice(request, id);
            InvoiceDto invoiceDto = invoiceService.convertInvoiceToDto(updatedInvoice);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponse(FrontEndCodes.SUCCESS.getCode(), invoiceDto));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(FrontEndCodes.ERROR.getCode(), e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(FrontEndCodes.ERROR.getCode(), e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('Admin', 'Invoice Manager')")
    public ResponseEntity<ApiResponse> deleteInvoice(@PathVariable Long id) {
        try {
            invoiceService.deleteInvoice(id);
            return ResponseEntity.ok(new ApiResponse(FrontEndCodes.SUCCESS.getCode(), null));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(FrontEndCodes.ERROR.getCode(), e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(FrontEndCodes.COMMON_GENERAL_ERROR.getCode(), e.getMessage()));
        }
    }

    @PostMapping("/{id}/sync")
    @PreAuthorize("hasAnyRole('Admin', 'Invoice Manager', 'Receptionist')")
    public ResponseEntity<ApiResponse> syncInvoiceWithBookings(@PathVariable Long id) {
        try {
            invoiceService.syncWithBookings(id);
            return ResponseEntity.ok(new ApiResponse(FrontEndCodes.SUCCESS.getCode(), null));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(FrontEndCodes.ERROR.getCode(), e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(FrontEndCodes.ERROR.getCode(), e.getMessage()));
        }
    }

    @PostMapping("/{id}/bookings/{bookingId}")
    @PreAuthorize("hasAnyRole('Admin', 'Invoice Manager')")
    public ResponseEntity<ApiResponse> addInvoiceBooking(@PathVariable Long id, @PathVariable Long bookingId) {
        try {
            Invoice updatedInvoice = invoiceService.addInvoiceBookings(id, bookingId);
            InvoiceDto invoiceDto = invoiceService.convertInvoiceToDto(updatedInvoice);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponse(FrontEndCodes.SUCCESS.getCode(), invoiceDto));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(FrontEndCodes.ERROR.getCode(), e.getMessage()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(FrontEndCodes.ERROR.getCode(), e.getMessage()));
        }
    }

    @DeleteMapping("/{id}/bookings/{bookingId}")
    public ResponseEntity<ApiResponse> removeInvoiceBooking(@PathVariable Long id, @PathVariable Long bookingId) {
        try {
            Invoice updatedInvoice = invoiceService.removeInvoiceBookings(id, bookingId);
            InvoiceDto invoiceDto = invoiceService.convertInvoiceToDto(updatedInvoice);

            return ResponseEntity.ok(new ApiResponse(FrontEndCodes.SUCCESS.getCode(), invoiceDto));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(FrontEndCodes.ERROR.getCode(), e.getMessage()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(FrontEndCodes.ERROR.getCode(), e.getMessage()));
        }
    }

    @GetMapping("/{id}/export/pdf")
    @PreAuthorize("hasAnyRole('Admin', 'Invoice Manager', 'Receptionist')")
    public ResponseEntity<byte[]> exportInvoiceToPdf(@PathVariable Long id) {
        try {
            byte[] pdfBytes = invoicePdfService.generateInvoicePdf(id);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "invoice-" + id + ".pdf");

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(pdfBytes);

        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}