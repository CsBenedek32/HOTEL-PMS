package com.hpms.backend.controller;

import com.hpms.backend.dto.UserDto;
import com.hpms.backend.enumCollection.FrontEndCodes;
import com.hpms.backend.exception.AlreadyExistsException;
import com.hpms.backend.exception.ResourceNotFoundException;
import com.hpms.backend.filter.UserFilter;
import com.hpms.backend.model.User;
import com.hpms.backend.request.CreateUserRequest;
import com.hpms.backend.request.UpdateUserRequest;
import com.hpms.backend.response.ApiResponse;
import com.hpms.backend.service.inter.IUserService;
import com.hpms.backend.service.pdf.UserPdfService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("${api.prefix}/users")
public class UserController {
    private final IUserService userService;
    private final UserPdfService userPdfService;

    @GetMapping
    public ResponseEntity<ApiResponse> getAllUsers(@ModelAttribute UserFilter filters) {
        try {
            List<User> users = userService.getUsers(filters);
            List<UserDto> userDos = users.stream()
                    .map(userService::convertUserToDto)
                    .toList();

            return ResponseEntity.ok(new ApiResponse(FrontEndCodes.SUCCESS.getCode(), userDos));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(FrontEndCodes.ERROR.getCode(), e.getMessage()));
        }
    }

    @PostMapping
    @PreAuthorize("hasRole('Admin')")
    public ResponseEntity<ApiResponse> createUser(@Valid @RequestBody CreateUserRequest request) {
        try {
            User createdUser = userService.createUser(request);
            UserDto userDto = userService.convertUserToDto(createdUser);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponse(FrontEndCodes.SUCCESS.getCode(), userDto));

        } catch (AlreadyExistsException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(FrontEndCodes.ERROR.getCode(), e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(FrontEndCodes.ERROR.getCode(), e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('Admin')")
    public ResponseEntity<ApiResponse> updateUser(@PathVariable Long id,
                                                  @Valid @RequestBody UpdateUserRequest request) {
        try {
            User updatedUser = userService.updateUser(request, id);
            UserDto userDto = userService.convertUserToDto(updatedUser);

            return ResponseEntity.ok(new ApiResponse(FrontEndCodes.SUCCESS.getCode(), userDto));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(FrontEndCodes.ERROR.getCode(), e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(FrontEndCodes.ERROR.getCode(), e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('Admin')")
    public ResponseEntity<ApiResponse> deleteUser(@PathVariable Long id) {
        try {
            userService.deleteUser(id);
            return ResponseEntity.ok(new ApiResponse(FrontEndCodes.SUCCESS.getCode(), null));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(FrontEndCodes.ERROR.getCode(), e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(FrontEndCodes.COMMON_GENERAL_ERROR.getCode(), e.getMessage()));
        }
    }

    @PostMapping("/{id}/activate")
    @PreAuthorize("hasRole('Admin')")
    public ResponseEntity<ApiResponse> activateUser(@PathVariable Long id) {
        try {
            userService.activateUser(id);
            return ResponseEntity.ok(new ApiResponse(FrontEndCodes.SUCCESS.getCode(), null));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(FrontEndCodes.ERROR.getCode(), e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(FrontEndCodes.COMMON_GENERAL_ERROR.getCode(), e.getMessage()));
        }
    }

    @PostMapping("/{id}/deactivate")
    @PreAuthorize("hasRole('Admin')")
    public ResponseEntity<ApiResponse> deactivateUser(@PathVariable Long id) {
        try {
            userService.deActivateUser(id);
            return ResponseEntity.ok(new ApiResponse(FrontEndCodes.SUCCESS.getCode(), null));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(FrontEndCodes.ERROR.getCode(), e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(FrontEndCodes.COMMON_GENERAL_ERROR.getCode(), e.getMessage()));
        }
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse> getCurrentUser() {
        try {
            User currentUser = userService.getAuthenticatedUser();
            UserDto userDto = userService.convertUserToDto(currentUser);
            return ResponseEntity.ok(new ApiResponse(FrontEndCodes.SUCCESS.getCode(), userDto));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(FrontEndCodes.ERROR.getCode(), e.getMessage()));
        }
    }

    @GetMapping("/export/pdf")
    //@PreAuthorize("hasRole('Admin')")
    public ResponseEntity<byte[]> exportUsersToPdf() {
        try {
            byte[] pdfBytes = userPdfService.generateUserPdf();

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "users-report.pdf");

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(pdfBytes);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}