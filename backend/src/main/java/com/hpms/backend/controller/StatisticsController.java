package com.hpms.backend.controller;

import com.hpms.backend.dto.BookingStatsDto;
import com.hpms.backend.dto.GuestStatsDto;
import com.hpms.backend.dto.HousekeepingStatsDto;
import com.hpms.backend.dto.IncomeStatsDto;
import com.hpms.backend.dto.OccupancyStatsDto;
import com.hpms.backend.dto.RoomAvailabilityStatsDto;
import com.hpms.backend.enumCollection.FrontEndCodes;
import com.hpms.backend.response.ApiResponse;
import com.hpms.backend.service.inter.IStatisticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;

@RequiredArgsConstructor
@RestController
@RequestMapping("${api.prefix}/statistics")
public class StatisticsController {
    private final IStatisticsService statisticsService;

    @GetMapping("/bookings")
    public ResponseEntity<ApiResponse> getBookingStatistics() {
        try {
            BookingStatsDto stats = statisticsService.getBookingStats();
            return ResponseEntity.ok(new ApiResponse(FrontEndCodes.SUCCESS.getCode(), stats));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(FrontEndCodes.ERROR.getCode(), e.getMessage()));
        }
    }

    @GetMapping("/guests")
    public ResponseEntity<ApiResponse> getGuestStatistics() {
        try {
            GuestStatsDto stats = statisticsService.getGuestStats();
            return ResponseEntity.ok(new ApiResponse(FrontEndCodes.SUCCESS.getCode(), stats));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(FrontEndCodes.ERROR.getCode(), e.getMessage()));
        }
    }

    @GetMapping("/housekeeping")
    public ResponseEntity<ApiResponse> getHousekeepingStatistics() {
        try {
            HousekeepingStatsDto stats = statisticsService.getHousekeepingStats();
            return ResponseEntity.ok(new ApiResponse(FrontEndCodes.SUCCESS.getCode(), stats));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(FrontEndCodes.ERROR.getCode(), e.getMessage()));
        }
    }

    @GetMapping("/income")
    public ResponseEntity<ApiResponse> getIncomeStatistics(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        try {
            IncomeStatsDto stats = statisticsService.getIncomeStats(startDate, endDate);
            return ResponseEntity.ok(new ApiResponse(FrontEndCodes.SUCCESS.getCode(), stats));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(FrontEndCodes.COMMON_VALIDATION_ERROR.getCode(), e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(FrontEndCodes.ERROR.getCode(), e.getMessage()));
        }
    }

    @GetMapping("/occupancy")
    public ResponseEntity<ApiResponse> getOccupancyStatistics(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        try {
            OccupancyStatsDto stats = statisticsService.getOccupancyStats(startDate, endDate);
            return ResponseEntity.ok(new ApiResponse(FrontEndCodes.SUCCESS.getCode(), stats));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(FrontEndCodes.COMMON_VALIDATION_ERROR.getCode(), e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(FrontEndCodes.ERROR.getCode(), e.getMessage()));
        }
    }

    @GetMapping("/room-availability")
    public ResponseEntity<ApiResponse> getRoomAvailabilityStatistics() {
        try {
            RoomAvailabilityStatsDto stats = statisticsService.getRoomAvailabilityStats();
            return ResponseEntity.ok(new ApiResponse(FrontEndCodes.SUCCESS.getCode(), stats));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(FrontEndCodes.ERROR.getCode(), e.getMessage()));
        }
    }
}