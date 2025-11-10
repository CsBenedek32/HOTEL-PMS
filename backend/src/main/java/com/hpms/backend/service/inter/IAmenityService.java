package com.hpms.backend.service.inter;

import com.hpms.backend.dto.AmenityDto;
import com.hpms.backend.filter.AmenityFilter;
import com.hpms.backend.model.Amenity;
import com.hpms.backend.request.CreateAmenityRequest;
import com.hpms.backend.request.UpdateAmenityRequest;

import java.util.List;
import java.util.function.Predicate;

public interface IAmenityService {

    List<Amenity> getAmenities(AmenityFilter filters);

    Amenity createAmenity(CreateAmenityRequest request);

    Amenity updateAmenity(UpdateAmenityRequest request, long targetId);

    void deleteAmenity(long targetId);

    AmenityDto convertAmenityToDto(Amenity amenity);

    Predicate<Amenity> buildAmenityPredicate(AmenityFilter filters);
}