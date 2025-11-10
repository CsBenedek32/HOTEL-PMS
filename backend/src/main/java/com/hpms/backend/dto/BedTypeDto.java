package com.hpms.backend.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class BedTypeDto {
    private long id;
    private String bedTypeName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}