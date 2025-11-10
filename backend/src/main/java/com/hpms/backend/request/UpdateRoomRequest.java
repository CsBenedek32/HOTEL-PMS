package com.hpms.backend.request;

import com.hpms.backend.enumCollection.RoomStatusEnum;
import jakarta.validation.constraints.Min;
import lombok.Data;

@Data
public class UpdateRoomRequest {
    private RoomStatusEnum status;
    private String description;
    private String roomNumber;

    @Min(1)
    private Integer floorNumber;

    private Long roomTypeId;
    private Long buildingId;
}