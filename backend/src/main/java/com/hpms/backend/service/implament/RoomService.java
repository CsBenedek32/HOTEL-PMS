package com.hpms.backend.service.implament;

import com.hpms.backend.dto.BuildingDto;
import com.hpms.backend.dto.RoomDto;
import com.hpms.backend.dto.RoomMirrorDto;
import com.hpms.backend.dto.RoomTypeDto;
import com.hpms.backend.dto.BookingDto;
import com.hpms.backend.enumCollection.FrontEndCodes;
import com.hpms.backend.exception.AlreadyExistsException;
import com.hpms.backend.exception.ResourceNotFoundException;
import com.hpms.backend.filter.RoomFilter;
import com.hpms.backend.model.Building;
import com.hpms.backend.model.Room;
import com.hpms.backend.model.RoomType;
import com.hpms.backend.service.inter.IRoomTypeService;
import com.hpms.backend.util.BookingConflictUtil;
import com.hpms.backend.repository.BuildingRepository;
import com.hpms.backend.repository.RoomRepository;
import com.hpms.backend.repository.RoomTypeRepository;
import com.hpms.backend.request.CreateRoomRequest;
import com.hpms.backend.request.RoomAvailabilityRequest;
import com.hpms.backend.request.UpdateRoomRequest;
import com.hpms.backend.service.inter.IRoomService;
import com.hpms.backend.service.inter.IBookingService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.function.Predicate;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class RoomService implements IRoomService {
    private final RoomRepository roomRepository;
    private final RoomTypeRepository roomTypeRepository;
    private final BuildingRepository buildingRepository;
    private final IBookingService bookingService;
    private final ModelMapper modelMapper;
    private final IRoomTypeService roomTypeService;

    @Transactional(readOnly = true)
    @Override
    public List<Room> getRooms(RoomFilter filters) {
        if (filters == null) {
            return roomRepository.findAll();
        }

        return roomRepository.findAll().stream()
                .filter(buildRoomPredicate(filters))
                .collect(Collectors.toList());
    }

    @Override
    public Room createRoom(CreateRoomRequest request) {
        Optional<Room> existingRoomOpt = roomRepository.findByRoomNumberAndBuildingId(request.getRoomNumber(), request.getBuildingId());

        if (existingRoomOpt.isPresent()) {
            throw new AlreadyExistsException(FrontEndCodes.ROOM_ALREADY_EXISTS.getCode());
        }

        Optional<RoomType> roomTypeOpt = roomTypeRepository.findById(request.getRoomTypeId());
        if (roomTypeOpt.isEmpty()) {
            throw new ResourceNotFoundException(FrontEndCodes.ROOM_TYPE_NOT_FOUND.getCode());
        }

        Optional<Building> buildingOpt = buildingRepository.findById(request.getBuildingId());
        if (buildingOpt.isEmpty()) {
            throw new ResourceNotFoundException(FrontEndCodes.ROOM_BUILDING_NOT_FOUND.getCode());
        }

        Room room = new Room();
        room.setStatus(request.getStatus());
        room.setDescription(request.getDescription());
        room.setRoomNumber(request.getRoomNumber());
        room.setFloorNumber(request.getFloorNumber());
        room.setRoomType(roomTypeOpt.get());
        room.setBuilding(buildingOpt.get());

        return roomRepository.save(room);
    }

    @Override
    public Room updateRoom(UpdateRoomRequest request, long targetId) {
        Optional<Room> existingRoomOpt = roomRepository.findById(targetId);
        if (existingRoomOpt.isEmpty()) {
            throw new ResourceNotFoundException(FrontEndCodes.ROOM_NOT_FOUND.getCode());
        }

        Room existingRoom = existingRoomOpt.get();

        if (request.getRoomNumber() != null && request.getBuildingId() != null) {
            Optional<Room> existingRoomNumber = roomRepository.findByRoomNumberAndBuildingId(request.getRoomNumber(), request.getBuildingId());
            if (existingRoomNumber.isPresent() && existingRoomNumber.get().getId() != targetId) {
                throw new AlreadyExistsException(FrontEndCodes.ROOM_ALREADY_EXISTS.getCode());
            }
        }

        existingRoom.setStatus(request.getStatus());
        existingRoom.setDescription(request.getDescription());
        existingRoom.setRoomNumber(request.getRoomNumber());
        existingRoom.setFloorNumber(request.getFloorNumber());

        if (request.getRoomTypeId() != null) {
            Optional<RoomType> roomTypeOpt = roomTypeRepository.findById(request.getRoomTypeId());
            if (roomTypeOpt.isEmpty()) {
                throw new ResourceNotFoundException(FrontEndCodes.ROOM_TYPE_NOT_FOUND.getCode());
            }
            existingRoom.setRoomType(roomTypeOpt.get());
        }

        if (request.getBuildingId() != null) {
            Optional<Building> buildingOpt = buildingRepository.findById(request.getBuildingId());
            if (buildingOpt.isEmpty()) {
                throw new ResourceNotFoundException(FrontEndCodes.ROOM_BUILDING_NOT_FOUND.getCode());
            }
            existingRoom.setBuilding(buildingOpt.get());
        }

        return roomRepository.save(existingRoom);
    }

    @Override
    public void deleteRoom(long targetId) {
        roomRepository.findById(targetId).ifPresentOrElse(
                room -> {
                    if (room.getBookings().isEmpty()) {
                        roomRepository.deleteById(targetId);
                    } else {
                        throw new IllegalStateException(FrontEndCodes.ROOM_HAS_BOOKINGS.getCode());
                    }
                },
                () -> {
                    throw new ResourceNotFoundException(FrontEndCodes.ROOM_NOT_FOUND.getCode());
                }
        );
    }

    @Override
    @Transactional(readOnly = true)
    public RoomDto convertRoomToDto(Room room) {
        RoomDto roomDto = modelMapper.map(room, RoomDto.class);
        roomDto.setRoomType(roomTypeService.convertRoomTypeToDto(room.getRoomType()));
        roomDto.setBuilding(modelMapper.map(room.getBuilding(), BuildingDto.class));
        return roomDto;
    }

    @Override
    public Predicate<Room> buildRoomPredicate(RoomFilter filters) {
        Predicate<Room> predicate = room -> true;

        if (filters.getId() != null) {
            predicate = predicate.and(room -> room.getId() == filters.getId());
        }

        if (filters.getRoomNumber() != null && !filters.getRoomNumber().isEmpty()) {
            predicate = predicate.and(room ->
                    room.getRoomNumber().toLowerCase().contains(filters.getRoomNumber().toLowerCase()));
        }

        if (filters.getStatuses() != null && !filters.getStatuses().isEmpty()) {
            predicate = predicate.and(room -> filters.getStatuses().contains(room.getStatus()));
        }

        if (filters.getFloorNumbers() != null && !filters.getFloorNumbers().isEmpty()) {
            predicate = predicate.and(room -> filters.getFloorNumbers().contains(room.getFloorNumber()));
        }

        if (filters.getRoomTypeIds() != null && !filters.getRoomTypeIds().isEmpty()) {
            predicate = predicate.and(room -> filters.getRoomTypeIds().contains(room.getRoomType().getId()));
        }

        if (filters.getBuildingIds() != null && !filters.getBuildingIds().isEmpty()) {
            predicate = predicate.and(room -> filters.getBuildingIds().contains(room.getBuilding().getId()));
        }

        return predicate;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Room> getAvailableRooms(RoomAvailabilityRequest request) {
        if (request == null || request.getCheckInDate() == null || request.getCheckOutDate() == null) {
            throw new IllegalArgumentException(FrontEndCodes.DATE_RANGE_INVALID.getCode());
        }

        return roomRepository.findAll().stream()
                .filter(room -> !BookingConflictUtil.hasConflictingBookings(
                        room,
                        request.getCheckInDate(),
                        request.getCheckOutDate(),
                        request.getExcludeBookingId()
                )).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<RoomMirrorDto> getRoomMirror(Long buildingId, LocalDate startDate, LocalDate endDate) {
        if (buildingId == null) {
            throw new IllegalArgumentException(FrontEndCodes.ROOM_BUILDING_NOT_FOUND.getCode());
        }

        if (startDate == null || endDate == null || startDate.isAfter(endDate)) {
            throw new IllegalArgumentException(FrontEndCodes.DATE_RANGE_INVALID.getCode());
        }

        RoomFilter roomFilter = new RoomFilter();
        roomFilter.setBuildingIds(List.of(buildingId));
        List<Room> rooms = getRooms(roomFilter);

        return rooms.stream()
                .map(room -> {
                    RoomMirrorDto mirrorDto = new RoomMirrorDto();
                    mirrorDto.setId(room.getId());
                    mirrorDto.setStatus(room.getStatus());
                    mirrorDto.setDescription(room.getDescription());
                    mirrorDto.setRoomNumber(room.getRoomNumber());
                    mirrorDto.setFloorNumber(room.getFloorNumber());
                    mirrorDto.setCreatedAt(room.getCreatedAt());
                    mirrorDto.setUpdatedAt(room.getUpdatedAt());
                    mirrorDto.setRoomType(modelMapper.map(room.getRoomType(), RoomTypeDto.class));
                    mirrorDto.setBuilding(modelMapper.map(room.getBuilding(), BuildingDto.class));

                    List<BookingDto> bookings = room.getBookings().stream()
                            .filter(booking -> booking.isActive() &&
                                    !booking.getCheckOutDate().isBefore(startDate) &&
                                    !booking.getCheckInDate().isAfter(endDate))
                            .map(bookingService::convertBookingToDto)
                            .collect(Collectors.toList());

                    mirrorDto.setBookings(bookings);
                    return mirrorDto;
                })
                .collect(Collectors.toList());
    }
}