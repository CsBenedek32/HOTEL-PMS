package com.hpms.backend.filter;

import lombok.Data;

@Data
public class VatFilter {
    private Long id;
    private String name;
    private Double percentage;
}