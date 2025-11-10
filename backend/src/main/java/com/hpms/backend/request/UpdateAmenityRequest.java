package com.hpms.backend.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UpdateAmenityRequest {
    @NotBlank
    private String amenityName;
}