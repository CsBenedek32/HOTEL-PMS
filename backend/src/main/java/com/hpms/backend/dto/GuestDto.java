package com.hpms.backend.dto;

import com.hpms.backend.enumCollection.GuestTypeEnum;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class GuestDto {
    private long id;
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
    private String homeCountry;
    private GuestTypeEnum type;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Boolean active;
    private List<GuestTagDto> guestTags;
}