package com.hpms.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GuestStatsDto {
    private long totalGuests;
    private long totalAdults;
    private long totalChildren;
    private Map<String, CountryGuestStats> guestsByCountry;
    private LocalDate date;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CountryGuestStats {
        private long totalGuests;
        private long adults;
        private long children;
    }
}