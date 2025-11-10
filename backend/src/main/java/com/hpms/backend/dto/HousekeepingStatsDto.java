package com.hpms.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HousekeepingStatsDto {
    private long totalRooms;
    private long cleanRooms;
    private long dirtyRooms;
    private long outOfServiceRooms;
    private LocalDate date;
}