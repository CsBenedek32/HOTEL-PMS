package com.hpms.backend.request;

import com.hpms.backend.enumCollection.HousekeepingPriorityEnum;
import com.hpms.backend.enumCollection.HousekeepingStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class CreateHousekeepingRequest {
    private Long userId;
    @NotNull
    private Long roomId;
    private String note;
    private HousekeepingPriorityEnum priority = HousekeepingPriorityEnum.LOW;
}