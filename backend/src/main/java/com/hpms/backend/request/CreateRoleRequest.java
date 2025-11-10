package com.hpms.backend.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateRoleRequest {
    @NotBlank
    String name;
    Boolean immutable;
}
