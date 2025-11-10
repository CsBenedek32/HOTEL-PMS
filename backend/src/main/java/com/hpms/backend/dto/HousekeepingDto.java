package com.hpms.backend.dto;

import com.hpms.backend.enumCollection.HousekeepingPriorityEnum;
import com.hpms.backend.enumCollection.HousekeepingStatus;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class HousekeepingDto {
    private Long id;
    private UserDto user;
    private RoomDto room;
    private String note;
    private HousekeepingStatus status;
    private HousekeepingPriorityEnum priority;
    private LocalDate assignedDate;
    private LocalDate completionDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}