package com.hpms.backend.filter;

import lombok.Data;

import java.util.List;

@Data
public class ServiceModelFilter {
    private Long id;
    private String name;
    private List<Long> vatIds;
    private Double minCost;
    private Double maxCost;
}