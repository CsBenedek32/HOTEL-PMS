package com.hpms.backend.controller;

import com.hpms.backend.dto.GuestTagDto;
import com.hpms.backend.enumCollection.FrontEndCodes;
import com.hpms.backend.exception.AlreadyExistsException;
import com.hpms.backend.exception.ResourceNotFoundException;
import com.hpms.backend.filter.GuestTagFilter;
import com.hpms.backend.model.GuestTag;
import com.hpms.backend.request.CreateGuestTagRequest;
import com.hpms.backend.request.UpdateGuestTagRequest;
import com.hpms.backend.response.ApiResponse;
import com.hpms.backend.service.inter.IGuestTagService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("${api.prefix}/guest-tags")
public class GuestTagController {
    private final IGuestTagService guestTagService;

    @GetMapping
    public ResponseEntity<ApiResponse> getAllGuestTags(@ModelAttribute GuestTagFilter filters) {
        try {
            List<GuestTag> guestTags = guestTagService.getGuestTags(filters);
            List<GuestTagDto> guestTagDtos = guestTags.stream()
                    .map(guestTagService::convertGuestTagToDto)
                    .toList();

            return ResponseEntity.ok(new ApiResponse(FrontEndCodes.SUCCESS.getCode(), guestTagDtos));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(FrontEndCodes.ERROR.getCode(), e.getMessage()));
        }
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('Admin', 'Data maintainer')")
    public ResponseEntity<ApiResponse> createGuestTag(@Valid @RequestBody CreateGuestTagRequest request) {
        try {
            GuestTag createdGuestTag = guestTagService.createGuestTag(request);
            GuestTagDto guestTagDto = guestTagService.convertGuestTagToDto(createdGuestTag);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponse(FrontEndCodes.SUCCESS.getCode(), guestTagDto));

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
    public ResponseEntity<ApiResponse> updateGuestTag(@PathVariable Long id,
                                                      @Valid @RequestBody UpdateGuestTagRequest request) {
        try {
            GuestTag updatedGuestTag = guestTagService.updateGuestTag(request, id);
            GuestTagDto guestTagDto = guestTagService.convertGuestTagToDto(updatedGuestTag);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponse(FrontEndCodes.SUCCESS.getCode(), guestTagDto));
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
    public ResponseEntity<ApiResponse> deleteGuestTag(@PathVariable Long id) {
        try {
            guestTagService.deleteGuestTag(id);
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