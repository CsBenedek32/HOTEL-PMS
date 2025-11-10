package com.hpms.backend.request;

import lombok.Data;

@Data
public class UpdateGuestTagRequest {
    private String tagName;
    private Boolean active;
}