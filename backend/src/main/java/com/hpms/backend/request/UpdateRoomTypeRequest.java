package com.hpms.backend.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class UpdateRoomTypeRequest {
    @NotBlank
    private String typeName;

    @NotNull
    @Min(0)
    private Double price;

    @NotNull
    @Min(1)
    private Integer capacity;

    private List<Long> amenityIds;

    @Valid
    private List<BedTypeQuantity> bedTypes;

    @Data
    public static class BedTypeQuantity {
        @NotNull
        private Long bedTypeId;

        @NotNull
        @Min(1)
        private Integer numBed;
    }
}