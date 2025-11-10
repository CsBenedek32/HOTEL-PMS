package com.hpms.backend.service.inter;

import com.hpms.backend.dto.HousekeepingDto;
import com.hpms.backend.enumCollection.HousekeepingStatus;
import com.hpms.backend.filter.HousekeepingFilter;
import com.hpms.backend.model.Housekeeping;
import com.hpms.backend.request.CreateHousekeepingRequest;
import com.hpms.backend.request.UpdateHousekeepingRequest;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.function.Predicate;

public interface IHousekeepingService {

    List<Housekeeping> getHousekeepings();

    Housekeeping createHousekeeping(CreateHousekeepingRequest request);

    Housekeeping updateHousekeeping(UpdateHousekeepingRequest request, long targetId);

    Housekeeping updateHouseKeepingStatus(HousekeepingStatus status, long targetId);

    void deleteHousekeeping(long targetId);

    HousekeepingDto convertHousekeepingToDto(Housekeeping housekeeping);

}