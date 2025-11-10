package com.hpms.backend.request;

import lombok.Data;

import java.util.List;

@Data
public class UpdateUserRequest {
    private String firstName;
    private String lastName;
    private String phone;
    private List<Long> roleIds;
}
