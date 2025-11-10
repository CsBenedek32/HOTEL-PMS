package com.hpms.backend.service.inter;

import com.hpms.backend.dto.RoomTypeDto;
import com.hpms.backend.filter.RoomTypeFilter;
import com.hpms.backend.model.RoomType;
import com.hpms.backend.request.CreateRoomTypeRequest;
import com.hpms.backend.request.UpdateRoomTypeRequest;

import java.util.List;
import java.util.function.Predicate;

public interface IRoomTypeService {

    List<RoomType> getRoomTypes(RoomTypeFilter filters);

    RoomType createRoomType(CreateRoomTypeRequest request);

    RoomType updateRoomType(UpdateRoomTypeRequest request, long targetId);

    void deleteRoomType(long targetId);

    RoomTypeDto convertRoomTypeToDto(RoomType roomType);

    Predicate<RoomType> buildRoomTypePredicate(RoomTypeFilter filters);
}