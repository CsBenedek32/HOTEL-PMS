package com.hpms.backend.dto;

import com.hpms.backend.enumCollection.BookingInvoiceEnum;
import com.hpms.backend.enumCollection.BookingStatusEnum;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class BookingDto {
    private long id;
    private boolean active;
    private BookingStatusEnum status;
    private BookingInvoiceEnum scynStatus;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private String name;
    private String description;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Long invoiceId;
    private List<GuestDto> guests;
    private List<RoomDto> rooms;
}