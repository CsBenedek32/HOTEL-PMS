package com.hpms.backend.request;

import lombok.Data;

@Data
public class UpdateBuildingRequest {
    private String name;
    private String address;
    private String city;
    private String zipcode;
    private String description;
    private String country;
    private String phoneNumber;
    private String email;
    private Boolean active;
}