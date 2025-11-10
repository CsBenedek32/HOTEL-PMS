package com.hpms.backend.controller;

import com.hpms.backend.dto.RoomDto;
import com.hpms.backend.dto.RoomMirrorDto;
import com.hpms.backend.enumCollection.FrontEndCodes;
import com.hpms.backend.exception.AlreadyExistsException;
import com.hpms.backend.exception.ResourceNotFoundException;
import com.hpms.backend.filter.RoomFilter;
import com.hpms.backend.model.Room;
import com.hpms.backend.request.CreateRoomRequest;
import com.hpms.backend.request.RoomAvailabilityRequest;
import com.hpms.backend.request.UpdateRoomRequest;
import com.hpms.backend.response.ApiResponse;
import com.hpms.backend.service.inter.IRoomService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("${api.prefix}/rooms")
public class RoomController {
    private final IRoomService roomService;

    @GetMapping
    public ResponseEntity<ApiResponse> getAllRooms(@ModelAttribute RoomFilter filters) {
        try {
            List<Room> rooms = roomService.getRooms(filters);
            List<RoomDto> roomDtos = rooms.stream()
                    .map(roomService::convertRoomToDto)
                    .toList();

            return ResponseEntity.ok(new ApiResponse(FrontEndCodes.SUCCESS.getCode(), roomDtos));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(FrontEndCodes.ERROR.getCode(), e.getMessage()));
        }
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('Admin', 'Data maintainer', 'Housekeeping)")
    public ResponseEntity<ApiResponse> createRoom(@Valid @RequestBody CreateRoomRequest request) {
        try {
            Room createdRoom = roomService.createRoom(request);
            RoomDto roomDto = roomService.convertRoomToDto(createdRoom);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponse(FrontEndCodes.SUCCESS.getCode(), roomDto));

        } catch (AlreadyExistsException | ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(FrontEndCodes.ERROR.getCode(), e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(FrontEndCodes.ERROR.getCode(), e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('Admin', 'Data maintainer','Housekeeping')")
    public ResponseEntity<ApiResponse> updateRoom(@PathVariable Long id,
                                                  @Valid @RequestBody UpdateRoomRequest request) {
        try {
            Room updatedRoom = roomService.updateRoom(request, id);
            RoomDto roomDto = roomService.convertRoomToDto(updatedRoom);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponse(FrontEndCodes.SUCCESS.getCode(), roomDto));
        } catch (ResourceNotFoundException | AlreadyExistsException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(FrontEndCodes.ERROR.getCode(), e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(FrontEndCodes.ERROR.getCode(), e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('Admin', 'Data maintainer','Housekeeping')")
    public ResponseEntity<ApiResponse> deleteRoom(@PathVariable Long id) {
        try {
            roomService.deleteRoom(id);
            return ResponseEntity.ok(new ApiResponse(FrontEndCodes.SUCCESS.getCode(), null));
        } catch (IllegalStateException | ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(FrontEndCodes.ERROR.getCode(), e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(FrontEndCodes.COMMON_GENERAL_ERROR.getCode(), e.getMessage()));
        }
    }

    @PostMapping("/availability")
    public ResponseEntity<ApiResponse> getAvailableRooms(@Valid @RequestBody RoomAvailabilityRequest request) {
        try {
            List<Room> availableRooms = roomService.getAvailableRooms(request);
            List<RoomDto> roomDtos = availableRooms.stream()
                    .map(roomService::convertRoomToDto)
                    .toList();

            return ResponseEntity.ok(new ApiResponse(FrontEndCodes.SUCCESS.getCode(), roomDtos));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(FrontEndCodes.ERROR.getCode(), e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(FrontEndCodes.ERROR.getCode(), e.getMessage()));
        }
    }

    @GetMapping("/mirror")
    public ResponseEntity<ApiResponse> getRoomMirror(
            @RequestParam Long buildingId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        try {
            List<RoomMirrorDto> roomMirror = roomService.getRoomMirror(buildingId, startDate, endDate);
            return ResponseEntity.ok(new ApiResponse(FrontEndCodes.SUCCESS.getCode(), roomMirror));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(FrontEndCodes.ERROR.getCode(), e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(FrontEndCodes.ERROR.getCode(), e.getMessage()));
        }
    }
}