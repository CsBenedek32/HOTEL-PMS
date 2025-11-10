package com.hpms.backend.controller;

import com.hpms.backend.dto.BookingDto;
import com.hpms.backend.enumCollection.BookingStatusEnum;
import com.hpms.backend.enumCollection.FrontEndCodes;
import com.hpms.backend.exception.ResourceNotFoundException;
import com.hpms.backend.filter.BookingFilter;
import com.hpms.backend.model.Booking;
import com.hpms.backend.request.CreateBookingRequest;
import com.hpms.backend.request.UpdateBookingRequest;
import com.hpms.backend.response.ApiResponse;
import com.hpms.backend.service.inter.IBookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("${api.prefix}/bookings")
public class BookingController {
    private final IBookingService bookingService;

    @GetMapping
    @PreAuthorize("hasAnyRole('Admin', 'Receptionist')")
    public ResponseEntity<ApiResponse> getAllBookings(@ModelAttribute BookingFilter filters) {
        try {
            List<Booking> bookings = bookingService.getBookings(filters);
            List<BookingDto> bookingDtos = bookings.stream()
                    .map(bookingService::convertBookingToDto)
                    .toList();

            return ResponseEntity.ok(new ApiResponse(FrontEndCodes.SUCCESS.getCode(), bookingDtos));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(FrontEndCodes.ERROR.getCode(), e.getMessage()));
        }
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('Admin', 'Receptionist')")
    public ResponseEntity<ApiResponse> createBooking(@Valid @RequestBody CreateBookingRequest request) {
        try {
            Booking createdBooking = bookingService.createBooking(request);
            BookingDto bookingDto = bookingService.convertBookingToDto(createdBooking);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponse(FrontEndCodes.SUCCESS.getCode(), bookingDto));

        } catch (ResourceNotFoundException | IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(FrontEndCodes.ERROR.getCode(), e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(FrontEndCodes.ERROR.getCode(), e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('Admin', 'Receptionist')")
    public ResponseEntity<ApiResponse> updateBooking(@PathVariable Long id,
                                                     @Valid @RequestBody UpdateBookingRequest request) {
        try {
            Booking updatedBooking = bookingService.updateBooking(request, id);
            BookingDto bookingDto = bookingService.convertBookingToDto(updatedBooking);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponse(FrontEndCodes.SUCCESS.getCode(), bookingDto));
        } catch (ResourceNotFoundException | IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(FrontEndCodes.ERROR.getCode(), e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(FrontEndCodes.ERROR.getCode(), e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('Admin', 'Receptionist')")
    public ResponseEntity<ApiResponse> deleteBooking(@PathVariable Long id) {
        try {
            bookingService.deleteBooking(id);
            return ResponseEntity.ok(new ApiResponse(FrontEndCodes.SUCCESS.getCode(), null));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(FrontEndCodes.ERROR.getCode(), e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(FrontEndCodes.COMMON_GENERAL_ERROR.getCode(), e.getMessage()));
        }
    }

    @GetMapping("/{id}/can-set-status/{status}")
    @PreAuthorize("hasAnyRole('Admin', 'Receptionist')")
    public ResponseEntity<ApiResponse> canSetStatus(@PathVariable Long id, @PathVariable BookingStatusEnum status) {
        try {
            Booking booking = bookingService.getBookings(null).stream()
                    .filter(b -> b.getId() == id)
                    .findFirst()
                    .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

            Boolean canSet = bookingService.canSetStatus(booking, status);

            return ResponseEntity.ok(new ApiResponse(FrontEndCodes.SUCCESS.getCode(), canSet));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(FrontEndCodes.ERROR.getCode(), e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(FrontEndCodes.ERROR.getCode(), e.getMessage()));
        }
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('Admin', 'Receptionist')")
    public ResponseEntity<ApiResponse> updateBookingStatus(@PathVariable Long id,
                                                           @RequestParam BookingStatusEnum status) {
        try {
            Booking updatedBooking = bookingService.updateBookingStatus(id, status);
            BookingDto bookingDto = bookingService.convertBookingToDto(updatedBooking);

            return ResponseEntity.ok(new ApiResponse(FrontEndCodes.SUCCESS.getCode(), bookingDto));
        } catch (ResourceNotFoundException | IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(FrontEndCodes.ERROR.getCode(), e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(FrontEndCodes.ERROR.getCode(), e.getMessage()));
        }
    }
}