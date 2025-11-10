package com.hpms.backend.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class RoomTypeDto {
    private long id;
    private String typeName;
    private double price;
    private int capacity;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<AmenityDto> amenities;
    private List<RoomTypeBedTypeDto> bedTypes;
}