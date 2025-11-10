package com.hpms.backend.controller;

import com.hpms.backend.dto.DevLogDto;
import com.hpms.backend.enumCollection.*;
import com.hpms.backend.model.DevLog;
import com.hpms.backend.response.ApiResponse;
import com.hpms.backend.response.InitResponse;
import com.hpms.backend.service.inter.IDevLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RequiredArgsConstructor
@RestController
@RequestMapping("${api.prefix}/init")
public class InitController {
    private final IDevLogService devLogService;

    @GetMapping
    public ResponseEntity<ApiResponse> getInitData() {
        try {
            InitResponse initData = new InitResponse();

            Map<String, List<String>> enums = new HashMap<>();
            enums.put("bookingStatus", getEnumValues(BookingStatusEnum.class));
            enums.put("roomStatus", getEnumValues(RoomStatusEnum.class));
            enums.put("paymentStatus", getEnumValues(PaymentStatusEnum.class));
            enums.put("housekeepingStatus", getEnumValues(HousekeepingStatus.class));
            enums.put("housekeepingPriority", getEnumValues(HousekeepingPriorityEnum.class));
            enums.put("bookingInvoiceStatus", getEnumValues(BookingInvoiceEnum.class));
            enums.put("guestType", getEnumValues(GuestTypeEnum.class));

            List<DevLog> devLogs = devLogService.getAllDevLogs();
            List<DevLogDto> devLogDtos = devLogs.stream()
                    .map(devLogService::convertDevLogToDto)
                    .toList();

            DevLogDto latestDevLog = null;
            try {
                DevLog latest = devLogService.getLatestDevLog();
                latestDevLog = devLogService.convertDevLogToDto(latest);
            } catch (Exception e) {
                //oof
            }

            initData.setEnums(enums);
            initData.setDevLogs(devLogDtos);
            initData.setLatestDevLog(latestDevLog);

            return ResponseEntity.ok(new ApiResponse(FrontEndCodes.SUCCESS.getCode(), initData));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(FrontEndCodes.ERROR.getCode(), e.getMessage()));
        }
    }

    @GetMapping("/handshake")
    public ResponseEntity<ApiResponse> handshake() {
        return ResponseEntity.ok(new ApiResponse(FrontEndCodes.SUCCESS.getCode(), "Handshake successful"));
    }

    private <T extends Enum<T>> List<String> getEnumValues(Class<T> enumClass) {
        return Arrays.stream(enumClass.getEnumConstants())
                .map(Enum::name)
                .toList();
    }
}