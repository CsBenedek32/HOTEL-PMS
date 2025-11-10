package com.hpms.backend.service.implament;

import com.hpms.backend.dto.DevLogDto;
import com.hpms.backend.enumCollection.FrontEndCodes;
import com.hpms.backend.exception.ResourceNotFoundException;
import com.hpms.backend.model.DevLog;
import com.hpms.backend.repository.DevLogRepository;
import com.hpms.backend.service.inter.IDevLogService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class DevLogService implements IDevLogService {
    private final DevLogRepository devLogRepository;
    private final ModelMapper modelMapper;

    @Transactional(readOnly = true)
    @Override
    public List<DevLog> getAllDevLogs() {
        return devLogRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
    }

    @Transactional(readOnly = true)
    @Override
    public DevLog getLatestDevLog() {
        return devLogRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"))
                .stream()
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException(FrontEndCodes.COMMON_RESOURCE_NOT_FOUND.getCode()));
    }

    @Override
    @Transactional(readOnly = true)
    public DevLogDto convertDevLogToDto(DevLog devLog) {
        return modelMapper.map(devLog, DevLogDto.class);
    }
}