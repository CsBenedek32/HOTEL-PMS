package com.hpms.backend.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateInvoiceRequest {
    @NotBlank
    private String name;
    private Long initialBookingId;
}