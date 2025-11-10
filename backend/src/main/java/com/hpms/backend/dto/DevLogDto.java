package com.hpms.backend.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class DevLogDto {
    private long id;
    private String description;
    private String version;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}