package com.hpms.backend.filter;

import com.hpms.backend.enumCollection.HousekeepingPriorityEnum;
import com.hpms.backend.enumCollection.HousekeepingStatus;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class HousekeepingFilter {
    private Long id;
    private List<Long> userIds;
    private List<Long> roomIds;
    private List<HousekeepingStatus> statuses;
    private List<HousekeepingPriorityEnum> priorities;
    private LocalDate assignedDateFrom;
    private LocalDate assignedDateTo;
    private LocalDate completionDateFrom;
    private LocalDate completionDateTo;
}