package com.hpms.backend.request;

import com.hpms.backend.enumCollection.GuestTypeEnum;
import jakarta.validation.constraints.Email;
import lombok.Data;

import java.util.List;

@Data
public class UpdateGuestRequest {
    private String firstName;
    private String lastName;

    @Email
    private String email;

    private String phoneNumber;
    private String homeCountry;
    private GuestTypeEnum type;
    private Boolean active;
    private List<Long> guestTagIds;
}