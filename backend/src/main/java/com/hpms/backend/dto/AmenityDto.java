package com.hpms.backend.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class AmenityDto {
    private long id;
    private String amenityName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}