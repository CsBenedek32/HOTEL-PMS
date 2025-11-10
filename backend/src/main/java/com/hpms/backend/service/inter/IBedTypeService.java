package com.hpms.backend.service.inter;

import com.hpms.backend.dto.BedTypeDto;
import com.hpms.backend.filter.BedTypeFilter;
import com.hpms.backend.model.BedType;
import com.hpms.backend.request.CreateBedTypeRequest;
import com.hpms.backend.request.UpdateBedTypeRequest;

import java.util.List;
import java.util.function.Predicate;

public interface IBedTypeService {

    List<BedType> getBedTypes(BedTypeFilter filters);

    BedType createBedType(CreateBedTypeRequest request);

    BedType updateBedType(UpdateBedTypeRequest request, long targetId);

    void deleteBedType(long targetId);

    BedTypeDto convertBedTypeToDto(BedType bedType);

    Predicate<BedType> buildBedTypePredicate(BedTypeFilter filters);
}