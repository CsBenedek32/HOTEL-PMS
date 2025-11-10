package com.hpms.backend.filter;

import com.hpms.backend.enumCollection.BookingInvoiceEnum;
import com.hpms.backend.enumCollection.BookingStatusEnum;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class BookingFilter {
    private Long id;
    private String name;
    private List<BookingStatusEnum> statuses;
    private List<BookingInvoiceEnum> scynStatuses;
    private LocalDate checkInDateFrom;
    private LocalDate checkInDateTo;
    private LocalDate checkOutDateFrom;
    private LocalDate checkOutDateTo;
    private Boolean active;
    private List<Long> guestIds;
    private List<Long> roomIds;
    private List<Long> invoiceIds;
}