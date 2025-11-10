package com.hpms.backend.service.inter;

import com.hpms.backend.dto.RoomDto;
import com.hpms.backend.dto.RoomMirrorDto;
import com.hpms.backend.filter.RoomFilter;
import com.hpms.backend.model.Room;
import com.hpms.backend.request.CreateRoomRequest;
import com.hpms.backend.request.RoomAvailabilityRequest;
import com.hpms.backend.request.UpdateRoomRequest;

import java.time.LocalDate;
import java.util.List;
import java.util.function.Predicate;

public interface IRoomService {

    List<Room> getRooms(RoomFilter filters);

    Room createRoom(CreateRoomRequest request);

    Room updateRoom(UpdateRoomRequest request, long targetId);

    void deleteRoom(long targetId);

    RoomDto convertRoomToDto(Room room);

    Predicate<Room> buildRoomPredicate(RoomFilter filters);

    List<Room> getAvailableRooms(RoomAvailabilityRequest request);

    List<RoomMirrorDto> getRoomMirror(Long buildingId, LocalDate startDate, LocalDate endDate);
}