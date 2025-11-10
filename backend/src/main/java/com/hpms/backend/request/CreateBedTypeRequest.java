package com.hpms.backend.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateBedTypeRequest {
    @NotBlank
    private String bedTypeName;
}