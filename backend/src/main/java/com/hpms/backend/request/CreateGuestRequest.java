package com.hpms.backend.request;

import com.hpms.backend.enumCollection.GuestTypeEnum;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class CreateGuestRequest {
    @NotBlank
    private String firstName;

    @NotBlank
    private String lastName;

    @NotBlank
    @Email
    private String email;

    @NotBlank
    private String phoneNumber;

    @NotBlank
    private String homeCountry;

    @NotNull
    private GuestTypeEnum type;

    private List<Long> guestTagIds;
}