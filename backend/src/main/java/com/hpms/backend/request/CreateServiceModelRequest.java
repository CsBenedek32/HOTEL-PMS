package com.hpms.backend.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateServiceModelRequest {
    @NotBlank
    private String name;

    private String description;

    @NotNull
    private Double cost;

    @NotNull
    private Long vatId;
}