package com.hpms.backend.filter;

import lombok.Data;

import java.util.List;

@Data
public class UserFilter {
    private long id;
    private String firstName;
    private String lastName;
    private String phone;
    private String email;
    private List<Long> roleIds;
}
