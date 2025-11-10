package com.hpms.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OccupancyStatsDto {
    private LocalDate startDate;
    private LocalDate endDate;
    private int maxCapacity;
    private Map<LocalDate, DailyOccupancyStats> dailyStats;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DailyOccupancyStats {
        private int occupied;
        private int available;
        private double occupancyRate;
    }
}