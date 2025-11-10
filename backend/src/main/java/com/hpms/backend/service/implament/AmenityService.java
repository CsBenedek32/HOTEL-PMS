package com.hpms.backend.service.implament;

import com.hpms.backend.dto.AmenityDto;
import com.hpms.backend.enumCollection.FrontEndCodes;
import com.hpms.backend.exception.AlreadyExistsException;
import com.hpms.backend.exception.ResourceNotFoundException;
import com.hpms.backend.filter.AmenityFilter;
import com.hpms.backend.model.Amenity;
import com.hpms.backend.repository.AmenityRepository;
import com.hpms.backend.request.CreateAmenityRequest;
import com.hpms.backend.request.UpdateAmenityRequest;
import com.hpms.backend.service.inter.IAmenityService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.function.Predicate;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class AmenityService implements IAmenityService {
    private final AmenityRepository amenityRepository;
    private final ModelMapper modelMapper;

    @Transactional(readOnly = true)
    @Override
    public List<Amenity> getAmenities(AmenityFilter filters) {
        if (filters == null) {
            return amenityRepository.findAll();
        }

        return amenityRepository.findAll().stream()
                .filter(buildAmenityPredicate(filters))
                .collect(Collectors.toList());
    }

    @Override
    public Amenity createAmenity(CreateAmenityRequest request) {
        Optional<Amenity> existingAmenityOpt = amenityRepository.findByAmenityName(request.getAmenityName());

        if (existingAmenityOpt.isPresent()) {
            throw new AlreadyExistsException(FrontEndCodes.AMENITY_ALREADY_EXISTS.getCode());
        }

        Amenity amenity = new Amenity();
        amenity.setAmenityName(request.getAmenityName());

        return amenityRepository.save(amenity);
    }

    @Override
    public Amenity updateAmenity(UpdateAmenityRequest request, long targetId) {
        Optional<Amenity> existingAmenityOpt = amenityRepository.findById(targetId);
        if (existingAmenityOpt.isEmpty()) {
            throw new ResourceNotFoundException(FrontEndCodes.AMENITY_NOT_FOUND.getCode());
        }

        Amenity existingAmenity = existingAmenityOpt.get();
        Optional<Amenity> existingName = amenityRepository.findByAmenityName(request.getAmenityName());

        if (existingName.isPresent() && existingName.get().getId() != targetId) {
            throw new AlreadyExistsException(FrontEndCodes.AMENITY_ALREADY_EXISTS.getCode());
        }

        existingAmenity.setAmenityName(request.getAmenityName());
        return amenityRepository.save(existingAmenity);
    }

    @Override
    public void deleteAmenity(long targetId) {
        amenityRepository.findById(targetId).ifPresentOrElse(
                amenity -> {
                    if (amenity.getRoomTypes().isEmpty()) {
                        amenityRepository.deleteById(targetId);
                    } else {
                        throw new IllegalStateException(FrontEndCodes.AMENITY_HAS_ROOMS.getCode());
                    }
                },
                () -> {
                    throw new ResourceNotFoundException(FrontEndCodes.AMENITY_NOT_FOUND.getCode());
                }
        );
    }

    @Override
    @Transactional(readOnly = true)
    public AmenityDto convertAmenityToDto(Amenity amenity) {
        return modelMapper.map(amenity, AmenityDto.class);
    }

    @Override
    public Predicate<Amenity> buildAmenityPredicate(AmenityFilter filters) {
        Predicate<Amenity> predicate = amenity -> true;

        if (filters.getId() != null) {
            predicate = predicate.and(amenity -> amenity.getId() == filters.getId());
        }

        if (filters.getAmenityName() != null && !filters.getAmenityName().isEmpty()) {
            predicate = predicate.and(amenity ->
                    amenity.getAmenityName().toLowerCase().contains(filters.getAmenityName().toLowerCase()));
        }

        return predicate;
    }
}