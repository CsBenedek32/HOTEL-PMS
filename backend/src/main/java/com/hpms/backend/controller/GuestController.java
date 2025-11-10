package com.hpms.backend.controller;

import com.hpms.backend.dto.GuestDto;
import com.hpms.backend.enumCollection.FrontEndCodes;
import com.hpms.backend.exception.AlreadyExistsException;
import com.hpms.backend.exception.ResourceNotFoundException;
import com.hpms.backend.filter.GuestFilter;
import com.hpms.backend.model.Guest;
import com.hpms.backend.request.CreateGuestRequest;
import com.hpms.backend.request.UpdateGuestRequest;
import com.hpms.backend.response.ApiResponse;
import com.hpms.backend.service.inter.IGuestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("${api.prefix}/guests")
public class GuestController {
    private final IGuestService guestService;

    @GetMapping
    @PreAuthorize("hasAnyRole('Admin', 'Receptionist')")
    public ResponseEntity<ApiResponse> getAllGuests(@ModelAttribute GuestFilter filters) {
        try {
            List<Guest> guests = guestService.getGuests(filters);
            List<GuestDto> guestDtos = guests.stream()
                    .map(guestService::convertGuestToDto)
                    .toList();

            return ResponseEntity.ok(new ApiResponse(FrontEndCodes.SUCCESS.getCode(), guestDtos));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(FrontEndCodes.ERROR.getCode(), e.getMessage()));
        }
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('Admin', 'Receptionist')")
    public ResponseEntity<ApiResponse> createGuest(@Valid @RequestBody CreateGuestRequest request) {
        try {
            Guest createdGuest = guestService.createGuest(request);
            GuestDto guestDto = guestService.convertGuestToDto(createdGuest);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponse(FrontEndCodes.SUCCESS.getCode(), guestDto));

        } catch (AlreadyExistsException | ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(FrontEndCodes.ERROR.getCode(), e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(FrontEndCodes.ERROR.getCode(), e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('Admin', 'Receptionist')")
    public ResponseEntity<ApiResponse> updateGuest(@PathVariable Long id,
                                                   @Valid @RequestBody UpdateGuestRequest request) {
        try {
            Guest updatedGuest = guestService.updateGuest(request, id);
            GuestDto guestDto = guestService.convertGuestToDto(updatedGuest);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponse(FrontEndCodes.SUCCESS.getCode(), guestDto));
        } catch (ResourceNotFoundException | AlreadyExistsException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(FrontEndCodes.ERROR.getCode(), e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(FrontEndCodes.ERROR.getCode(), e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('Admin', 'Receptionist')")
    public ResponseEntity<ApiResponse> deleteGuest(@PathVariable Long id) {
        try {
            guestService.deleteGuest(id);
            return ResponseEntity.ok(new ApiResponse(FrontEndCodes.SUCCESS.getCode(), null));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(FrontEndCodes.ERROR.getCode(), e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(FrontEndCodes.COMMON_GENERAL_ERROR.getCode(), e.getMessage()));
        }
    }
}