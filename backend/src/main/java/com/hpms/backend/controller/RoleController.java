package com.hpms.backend.controller;

import com.hpms.backend.dto.RoleDto;
import com.hpms.backend.enumCollection.FrontEndCodes;
import com.hpms.backend.exception.AlreadyExistsException;
import com.hpms.backend.exception.ResourceNotFoundException;
import com.hpms.backend.filter.RoleFilter;
import com.hpms.backend.model.Role;
import com.hpms.backend.request.CreateRoleRequest;
import com.hpms.backend.request.UpdateRoleRequest;
import com.hpms.backend.response.ApiResponse;
import com.hpms.backend.service.inter.IRoleService;
import com.hpms.backend.service.pdf.RolePdfService;
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
@RequestMapping("${api.prefix}/roles")
public class RoleController {
    private final IRoleService roleService;
    private final RolePdfService rolePdfService;

    @GetMapping
    public ResponseEntity<ApiResponse> getAllRoles(@ModelAttribute RoleFilter filters) {
        try {
            List<Role> roles = roleService.getRoles(filters);
            List<RoleDto> roleDos = roles.stream()
                    .map(roleService::convertRoleToDto)
                    .toList();

            return ResponseEntity.ok(new ApiResponse(FrontEndCodes.SUCCESS.getCode(), roleDos));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(FrontEndCodes.ERROR.getCode(), e.getMessage()));
        }
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('Admin')")
    public ResponseEntity<ApiResponse> createRole(@Valid @RequestBody CreateRoleRequest request) {
        try {
            Role createdRole = roleService.createRole(request);
            RoleDto roleDto = roleService.convertRoleToDto(createdRole);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponse(FrontEndCodes.SUCCESS.getCode(), roleDto));

        } catch (AlreadyExistsException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(FrontEndCodes.ERROR.getCode(), e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(FrontEndCodes.ERROR.getCode(), e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('Admin')")
    public ResponseEntity<ApiResponse> updateRole(@PathVariable Long id,
                                                  @Valid @RequestBody UpdateRoleRequest request) {
        try {
            Role updatedRole = roleService.updateRole(request, id);
            RoleDto roleDto = roleService.convertRoleToDto(updatedRole);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponse(FrontEndCodes.SUCCESS.getCode(), roleDto));
        } catch (ResourceNotFoundException | AlreadyExistsException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(FrontEndCodes.ERROR.getCode(), e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(FrontEndCodes.ERROR.getCode(), e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('Admin')")
    public ResponseEntity<ApiResponse> deleteRole(@PathVariable Long id) {
        try {
            roleService.deleteRole(id);
            return ResponseEntity.ok(new ApiResponse(FrontEndCodes.SUCCESS.getCode(), null));
        } catch (IllegalStateException | ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(FrontEndCodes.ERROR.getCode(), e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(FrontEndCodes.COMMON_GENERAL_ERROR.getCode(), e.getMessage()));
        }
    }

    @GetMapping("/export/pdf")
    @PreAuthorize("hasAnyRole('Admin')")
    public ResponseEntity<byte[]> exportRolesToPdf() {
        try {
            byte[] pdfBytes = rolePdfService.generateRolePdf();

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "user-roles-report.pdf");

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(pdfBytes);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}