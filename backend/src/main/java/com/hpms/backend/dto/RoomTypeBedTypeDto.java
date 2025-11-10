package com.hpms.backend.dto;

import lombok.Data;

@Data
public class RoomTypeBedTypeDto {
    private long id;
    private int numBed;
    private BedTypeDto bedType;
}