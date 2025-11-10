package com.hpms.backend.dto;

import com.hpms.backend.enumCollection.RoomStatusEnum;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class RoomDto {
    private long id;
    private RoomStatusEnum status;
    private String description;
    private String roomNumber;
    private int floorNumber;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private RoomTypeDto roomType;
    private BuildingDto building;
}