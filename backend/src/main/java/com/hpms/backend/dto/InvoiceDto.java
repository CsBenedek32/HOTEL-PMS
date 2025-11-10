package com.hpms.backend.dto;

import com.hpms.backend.enumCollection.PaymentStatusEnum;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class InvoiceDto {
    private Long id;
    private PaymentStatusEnum paymentStatus;
    private String name;
    private String description;
    private Double totalSum;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Boolean active;

    // Invoice recipient fields
    private String recipientName;
    private String recipientCompanyName;
    private String recipientAddress;
    private String recipientCity;
    private String recipientPostalCode;
    private String recipientCountry;
    private String recipientTaxNumber;
    private String recipientEmail;
    private String recipientPhone;

    private List<BookingDto> bookings;
    private List<ServiceModelDto> serviceModels;
}