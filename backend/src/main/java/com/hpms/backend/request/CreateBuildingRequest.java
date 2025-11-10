package com.hpms.backend.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateBuildingRequest {
    @NotBlank
    private String name;
    @NotBlank
    private String address;
    @NotBlank
    private String city;
    @NotBlank
    private String zipcode;
    @NotBlank
    private String country;
    @NotBlank
    private String phoneNumber;
    @NotBlank
    private String email;

    private String description;
}