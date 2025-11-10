package com.hpms.backend.request;

import com.hpms.backend.filter.RoomFilter;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class RoomAvailabilityRequest {
    @NotNull
    private LocalDate checkInDate;

    @NotNull
    private LocalDate checkOutDate;

    private RoomFilter roomFilter;

    private Long excludeBookingId;
}