package com.hpms.backend.request;

import com.hpms.backend.enumCollection.BookingStatusEnum;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class UpdateBookingRequest {
    private BookingStatusEnum status;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private String name;
    private String description;
    private List<Long> guestIds;
    private List<Long> roomIds;
}