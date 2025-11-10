package com.hpms.backend.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ServiceModelDto {
    private Long id;
    private String name;
    private String description;
    private Double cost;
    private Boolean immutable;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private VatDto vat;
    private Boolean virtual;
}