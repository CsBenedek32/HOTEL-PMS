package com.hpms.backend.response;

import com.hpms.backend.dto.DevLogDto;
import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
public class InitResponse {
    private Map<String, List<String>> enums;
    private List<DevLogDto> devLogs;
    private DevLogDto latestDevLog;
}