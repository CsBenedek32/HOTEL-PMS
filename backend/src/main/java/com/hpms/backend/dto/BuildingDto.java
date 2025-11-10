package com.hpms.backend.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class BuildingDto {
    private Long id;
    private String name;
    private String address;
    private String city;
    private String zipcode;
    private String description;
    private String country;
    private String phoneNumber;
    private String email;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Boolean active;
    private List<Long> userIds;
    private List<Long> roomIds;
}