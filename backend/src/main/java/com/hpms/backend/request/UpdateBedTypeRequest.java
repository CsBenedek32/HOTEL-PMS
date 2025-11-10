package com.hpms.backend.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UpdateBedTypeRequest {
    @NotBlank
    private String bedTypeName;
}