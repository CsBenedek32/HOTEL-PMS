package com.hpms.backend.request;

import com.hpms.backend.enumCollection.RoomStatusEnum;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateRoomRequest {
    @NotNull
    private RoomStatusEnum status;

    private String description;

    @NotBlank
    private String roomNumber;

    @NotNull
    @Min(1)
    private Integer floorNumber;

    @NotNull
    private Long roomTypeId;

    @NotNull
    private Long buildingId;
}