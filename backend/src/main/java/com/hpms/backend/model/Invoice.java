package com.hpms.backend.model;

import com.hpms.backend.enumCollection.PaymentStatusEnum;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "invoice")
public class Invoice {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private PaymentStatusEnum paymentStatus;

    private LocalDateTime paymentFulfilledAt;

    @Column(nullable = false)
    private String name;

    private String description;
    private Double totalSum;

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

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Boolean active = true;

    @OneToMany(mappedBy = "invoice", fetch = FetchType.LAZY)
    private List<Booking> bookings = new ArrayList<>();

    @ManyToMany
    @JoinTable(
            name = "invoice_serviceModels",
            joinColumns = @JoinColumn(name = "invoice_id"),
            inverseJoinColumns = @JoinColumn(name = "serviceModel_id")
    )
    private List<ServiceModel> serviceModels = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}