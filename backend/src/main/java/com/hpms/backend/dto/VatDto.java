package com.hpms.backend.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class VatDto {
    private long id;
    private String name;
    private Double percentage;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Boolean active;
}