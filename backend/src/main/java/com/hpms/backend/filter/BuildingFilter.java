package com.hpms.backend.filter;

import lombok.Data;

import java.util.List;

@Data
public class BuildingFilter {
    private Long id;
    private String name;
    private String address;
    private String city;
    private String zipcode;
    private String country;
    private Boolean active;
    private List<Long> userIds;
}