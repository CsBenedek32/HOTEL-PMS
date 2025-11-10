package com.hpms.backend.filter;

import com.hpms.backend.enumCollection.PaymentStatusEnum;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class InvoiceFilter {
    private Long id;
    private String name;
    private List<PaymentStatusEnum> paymentStatuses;
    private String recipientName;
    private String recipientCompanyName;
    private String recipientEmail;
    private Double minTotalSum;
    private Double maxTotalSum;
    private LocalDateTime createdAfter;
    private LocalDateTime createdBefore;
    private List<Long> bookingIds;
}