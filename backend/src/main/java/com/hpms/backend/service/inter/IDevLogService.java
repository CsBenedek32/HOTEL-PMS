package com.hpms.backend.service.inter;

import com.hpms.backend.dto.DevLogDto;
import com.hpms.backend.model.DevLog;

import java.util.List;

public interface IDevLogService {

    List<DevLog> getAllDevLogs();

    DevLog getLatestDevLog();

    DevLogDto convertDevLogToDto(DevLog devLog);
}