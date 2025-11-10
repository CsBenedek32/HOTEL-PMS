package com.hpms.backend.filter;

import com.hpms.backend.enumCollection.RoomStatusEnum;
import lombok.Data;

import java.util.List;

@Data
public class RoomFilter {
    private Long id;
    private String roomNumber;
    private List<RoomStatusEnum> statuses;
    private List<Integer> floorNumbers;
    private List<Long> roomTypeIds;
    private List<Long> buildingIds;
}