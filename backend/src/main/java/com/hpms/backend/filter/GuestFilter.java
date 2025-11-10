package com.hpms.backend.filter;

import com.hpms.backend.enumCollection.GuestTypeEnum;
import lombok.Data;

import java.util.List;

@Data
public class GuestFilter {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
    private List<GuestTypeEnum> types;
    private Boolean active;
    private List<Long> guestTagIds;
}