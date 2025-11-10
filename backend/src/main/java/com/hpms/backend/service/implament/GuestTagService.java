package com.hpms.backend.service.implament;

import com.hpms.backend.dto.GuestTagDto;
import com.hpms.backend.enumCollection.FrontEndCodes;
import com.hpms.backend.exception.AlreadyExistsException;
import com.hpms.backend.exception.ResourceNotFoundException;
import com.hpms.backend.filter.GuestTagFilter;
import com.hpms.backend.model.GuestTag;
import com.hpms.backend.repository.GuestTagRepository;
import com.hpms.backend.request.CreateGuestTagRequest;
import com.hpms.backend.request.UpdateGuestTagRequest;
import com.hpms.backend.service.inter.IGuestTagService;
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
public class GuestTagService implements IGuestTagService {
    private final GuestTagRepository guestTagRepository;
    private final ModelMapper modelMapper;

    @Transactional(readOnly = true)
    @Override
    public List<GuestTag> getGuestTags(GuestTagFilter filters) {
        if (filters == null) {
            return guestTagRepository.findAll();
        }

        return guestTagRepository.findAll().stream()
                .filter(buildGuestTagPredicate(filters))
                .collect(Collectors.toList());
    }

    @Override
    public GuestTag createGuestTag(CreateGuestTagRequest request) {
        Optional<GuestTag> existingGuestTagOpt = guestTagRepository.findByTagName(request.getTagName());

        if (existingGuestTagOpt.isPresent()) {
            throw new AlreadyExistsException(FrontEndCodes.GUEST_TAG_ALREADY_EXISTS.getCode());
        }

        GuestTag guestTag = new GuestTag();
        guestTag.setTagName(request.getTagName());

        return guestTagRepository.save(guestTag);
    }

    @Override
    public GuestTag updateGuestTag(UpdateGuestTagRequest request, long targetId) {
        Optional<GuestTag> existingGuestTagOpt = guestTagRepository.findById(targetId);
        if (existingGuestTagOpt.isEmpty()) {
            throw new ResourceNotFoundException(FrontEndCodes.GUEST_TAG_NOT_FOUND.getCode());
        }

        GuestTag existingGuestTag = existingGuestTagOpt.get();
        Optional<GuestTag> existingName = guestTagRepository.findByTagName(request.getTagName());

        if (existingName.isPresent() && existingName.get().getId() != targetId) {
            throw new AlreadyExistsException(FrontEndCodes.GUEST_TAG_ALREADY_EXISTS.getCode());
        }

        existingGuestTag.setTagName(request.getTagName());
        existingGuestTag.setActive(request.getActive());
        return guestTagRepository.save(existingGuestTag);
    }

    @Override
    public void deleteGuestTag(long targetId) {
        guestTagRepository.findById(targetId).ifPresentOrElse(
                guestTag -> {
                    if (guestTag.getGuests().isEmpty()) {
                        guestTag.setActive(false);
                        guestTagRepository.save(guestTag);
                    } else {
                        throw new IllegalStateException(FrontEndCodes.GUEST_TAG_HAS_GUESTS.getCode());
                    }
                },
                () -> {
                    throw new ResourceNotFoundException(FrontEndCodes.GUEST_TAG_NOT_FOUND.getCode());
                }
        );
    }

    @Override
    @Transactional(readOnly = true)
    public GuestTagDto convertGuestTagToDto(GuestTag guestTag) {
        return modelMapper.map(guestTag, GuestTagDto.class);
    }

    @Override
    public Predicate<GuestTag> buildGuestTagPredicate(GuestTagFilter filters) {
        Predicate<GuestTag> predicate = guestTag -> true;

        if (filters.getId() != null) {
            predicate = predicate.and(guestTag -> guestTag.getId() == filters.getId());
        }

        if (filters.getTagName() != null && !filters.getTagName().isEmpty()) {
            predicate = predicate.and(guestTag ->
                    guestTag.getTagName().toLowerCase().contains(filters.getTagName().toLowerCase()));
        }

        if (filters.getActive() != null) {
            predicate = predicate.and(guestTag -> guestTag.getActive().equals(filters.getActive()));
        }

        return predicate;
    }
}