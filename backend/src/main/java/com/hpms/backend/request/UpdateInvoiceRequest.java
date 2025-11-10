package com.hpms.backend.request;

import com.hpms.backend.enumCollection.PaymentStatusEnum;
import lombok.Data;

import java.util.List;

@Data
public class UpdateInvoiceRequest {
    private PaymentStatusEnum paymentStatus;
    private String name;
    private String description;
    private String recipientName;
    private String recipientCompanyName;
    private String recipientAddress;
    private String recipientCity;
    private String recipientPostalCode;
    private String recipientCountry;
    private String recipientTaxNumber;
    private String recipientEmail;
    private String recipientPhone;
}