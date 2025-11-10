package com.hpms.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "company_info")
public class CompanyInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255)
    private String companyName;

    @Column(nullable = false, length = 500)
    private String address;

    @Column(nullable = false, length = 50)
    private String phone;

    @Column(nullable = false, length = 255)
    private String email;

    @Column(length = 255)
    private String website;

    @Column(length = 500)
    private String logoUrl;

    @Column(length = 100)
    private String taxNumber;

    @Column(length = 100)
    private String registrationNumber;
}