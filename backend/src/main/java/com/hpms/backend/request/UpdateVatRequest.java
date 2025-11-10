package com.hpms.backend.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class UpdateVatRequest {
    @NotBlank
    private String name;

    @NotNull
    @Positive
    private Double percentage;
}