package com.hpms.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RoomAvailabilityStatsDto {
    private LocalDate date;
    private Map<String, RoomTypeAvailability> availabilityByRoomType;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RoomTypeAvailability {
        private long totalRooms;
        private int available;
        private int reserved;
        private int unavailable;
    }
}