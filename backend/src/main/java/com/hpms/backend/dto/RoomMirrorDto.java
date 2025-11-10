package com.hpms.backend.dto;

import com.hpms.backend.enumCollection.RoomStatusEnum;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class RoomMirrorDto {
    private long id;
    private RoomStatusEnum status;
    private String description;
    private String roomNumber;
    private int floorNumber;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private RoomTypeDto roomType;
    private BuildingDto building;
    private List<BookingDto> bookings;
}
