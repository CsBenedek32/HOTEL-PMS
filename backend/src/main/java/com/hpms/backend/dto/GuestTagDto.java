package com.hpms.backend.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class GuestTagDto {
    private long id;
    private String tagName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Boolean active;
}