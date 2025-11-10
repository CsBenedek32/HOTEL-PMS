package com.hpms.backend.request;

import lombok.Data;

@Data
public class UpdateServiceModelRequest {
    private String name;
    private String description;
    private Double cost;
    private Long vatId;
}