package com.hpms.backend.filter;

import lombok.Data;

@Data
public class GuestTagFilter {
    private Long id;
    private String tagName;
    private Boolean active;
}