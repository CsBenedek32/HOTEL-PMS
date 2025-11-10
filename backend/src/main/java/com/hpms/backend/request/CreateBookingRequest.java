package com.hpms.backend.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class CreateBookingRequest {
    @NotNull
    private LocalDate checkInDate;

    @NotNull
    private LocalDate checkOutDate;

    @NotBlank
    private String name;

    private String description;

    private List<Long> guestIds;
    private List<Long> roomIds;
}