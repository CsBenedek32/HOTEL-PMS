package com.hpms.backend.service.inter;

import com.hpms.backend.dto.BookingStatsDto;
import com.hpms.backend.dto.GuestStatsDto;
import com.hpms.backend.dto.HousekeepingStatsDto;
import com.hpms.backend.dto.IncomeStatsDto;
import com.hpms.backend.dto.OccupancyStatsDto;
import com.hpms.backend.dto.RoomAvailabilityStatsDto;

import java.time.LocalDate;

public interface IStatisticsService {
    BookingStatsDto getBookingStats();
    GuestStatsDto getGuestStats();
    HousekeepingStatsDto getHousekeepingStats();
    IncomeStatsDto getIncomeStats(LocalDate startDate, LocalDate endDate);
    OccupancyStatsDto getOccupancyStats(LocalDate startDate, LocalDate endDate);
    RoomAvailabilityStatsDto getRoomAvailabilityStats();
}
