package com.hpms.backend.controller;

import com.hpms.backend.dto.DevLogDto;
import com.hpms.backend.enumCollection.FrontEndCodes;
import com.hpms.backend.exception.ResourceNotFoundException;
import com.hpms.backend.model.DevLog;
import com.hpms.backend.response.ApiResponse;
import com.hpms.backend.service.inter.IDevLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("${api.prefix}/dev-logs")
public class DevLogController {
    private final IDevLogService devLogService;

    @GetMapping
    public ResponseEntity<ApiResponse> getAllDevLogs() {
        try {
            List<DevLog> devLogs = devLogService.getAllDevLogs();
            List<DevLogDto> devLogDtos = devLogs.stream()
                    .map(devLogService::convertDevLogToDto)
                    .toList();

            return ResponseEntity.ok(new ApiResponse(FrontEndCodes.SUCCESS.getCode(), devLogDtos));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(FrontEndCodes.ERROR.getCode(), e.getMessage()));
        }
    }

    @GetMapping("/latest")
    public ResponseEntity<ApiResponse> getLatestDevLog() {
        try {
            DevLog latestDevLog = devLogService.getLatestDevLog();
            DevLogDto devLogDto = devLogService.convertDevLogToDto(latestDevLog);

            return ResponseEntity.ok(new ApiResponse(FrontEndCodes.SUCCESS.getCode(), devLogDto));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(FrontEndCodes.ERROR.getCode(), e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(FrontEndCodes.ERROR.getCode(), e.getMessage()));
        }
    }
}