package com.hpms.backend.request;

import com.hpms.backend.enumCollection.HousekeepingPriorityEnum;
import com.hpms.backend.enumCollection.HousekeepingStatus;
import lombok.Data;

import java.time.LocalDate;

@Data
public class UpdateHousekeepingRequest {
    private Long userId;
    private Long roomId;
    private String note;
    private HousekeepingPriorityEnum priority;
}