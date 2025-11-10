package com.hpms.backend.filter;

import lombok.Data;

import java.util.List;

@Data
public class RoomTypeFilter {
    private Long id;
    private String typeName;
    private Double minPrice;
    private Double maxPrice;
    private Integer minCapacity;
    private Integer maxCapacity;
    private List<Long> amenityIds;
    private List<Long> bedTypeIds;
}