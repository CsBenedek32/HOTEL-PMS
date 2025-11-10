package com.hpms.backend.controller;

import com.hpms.backend.dto.RoomTypeDto;
import com.hpms.backend.enumCollection.FrontEndCodes;
import com.hpms.backend.exception.AlreadyExistsException;
import com.hpms.backend.exception.ResourceNotFoundException;
import com.hpms.backend.filter.RoomTypeFilter;
import com.hpms.backend.model.RoomType;
import com.hpms.backend.request.CreateRoomTypeRequest;
import com.hpms.backend.request.UpdateRoomTypeRequest;
import com.hpms.backend.response.ApiResponse;
import com.hpms.backend.service.inter.IRoomTypeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("${api.prefix}/room-types")
public class RoomTypeController {
    private final IRoomTypeService roomTypeService;

    @GetMapping
    public ResponseEntity<ApiResponse> getAllRoomTypes(@ModelAttribute RoomTypeFilter filters) {
        try {
            List<RoomType> roomTypes = roomTypeService.getRoomTypes(filters);
            List<RoomTypeDto> roomTypeDtos = roomTypes.stream()
                    .map(roomTypeService::convertRoomTypeToDto)
                    .toList();

            return ResponseEntity.ok(new ApiResponse(FrontEndCodes.SUCCESS.getCode(), roomTypeDtos));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(FrontEndCodes.ERROR.getCode(), e.getMessage()));
        }
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('Admin', 'Data maintainer')")
    public ResponseEntity<ApiResponse> createRoomType(@Valid @RequestBody CreateRoomTypeRequest request) {
        try {
            RoomType createdRoomType = roomTypeService.createRoomType(request);
            RoomTypeDto roomTypeDto = roomTypeService.convertRoomTypeToDto(createdRoomType);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponse(FrontEndCodes.SUCCESS.getCode(), roomTypeDto));

        } catch (AlreadyExistsException | ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(FrontEndCodes.ERROR.getCode(), e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(FrontEndCodes.ERROR.getCode(), e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('Admin', 'Data maintainer')")
    public ResponseEntity<ApiResponse> updateRoomType(@PathVariable Long id,
                                                     @Valid @RequestBody UpdateRoomTypeRequest request) {
        try {
            RoomType updatedRoomType = roomTypeService.updateRoomType(request, id);
            RoomTypeDto roomTypeDto = roomTypeService.convertRoomTypeToDto(updatedRoomType);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponse(FrontEndCodes.SUCCESS.getCode(), roomTypeDto));
        } catch (ResourceNotFoundException | AlreadyExistsException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(FrontEndCodes.ERROR.getCode(), e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(FrontEndCodes.ERROR.getCode(), e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('Admin', 'Data maintainer')")
    public ResponseEntity<ApiResponse> deleteRoomType(@PathVariable Long id) {
        try {
            roomTypeService.deleteRoomType(id);
            return ResponseEntity.ok(new ApiResponse(FrontEndCodes.SUCCESS.getCode(), null));
        } catch (IllegalStateException | ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(FrontEndCodes.ERROR.getCode(), e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(FrontEndCodes.COMMON_GENERAL_ERROR.getCode(), e.getMessage()));
        }
    }
}