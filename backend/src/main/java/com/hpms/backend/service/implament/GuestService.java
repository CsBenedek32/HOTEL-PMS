package com.hpms.backend.service.implament;

import com.hpms.backend.dto.GuestDto;
import com.hpms.backend.dto.GuestTagDto;
import com.hpms.backend.enumCollection.FrontEndCodes;
import com.hpms.backend.exception.AlreadyExistsException;
import com.hpms.backend.exception.ResourceNotFoundException;
import com.hpms.backend.filter.GuestFilter;
import com.hpms.backend.model.Guest;
import com.hpms.backend.model.GuestTag;
import com.hpms.backend.repository.GuestRepository;
import com.hpms.backend.repository.GuestTagRepository;
import com.hpms.backend.request.CreateGuestRequest;
import com.hpms.backend.request.UpdateGuestRequest;
import com.hpms.backend.service.inter.IGuestService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.function.Predicate;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class GuestService implements IGuestService {
    private final GuestRepository guestRepository;
    private final GuestTagRepository guestTagRepository;
    private final ModelMapper modelMapper;

    @Transactional(readOnly = true)
    @Override
    public List<Guest> getGuests(GuestFilter filters) {
        if (filters == null) {
            return guestRepository.findAll();
        }

        return guestRepository.findAll().stream()
                .filter(buildGuestPredicate(filters))
                .collect(Collectors.toList());
    }

    @Override
    public Guest createGuest(CreateGuestRequest request) {
        Optional<Guest> existingEmailOpt = guestRepository.findByEmail(request.getEmail());
        if (existingEmailOpt.isPresent()) {
            throw new AlreadyExistsException(FrontEndCodes.GUEST_EMAIL_EXISTS.getCode());
        }

        Optional<Guest> existingPhoneOpt = guestRepository.findByPhoneNumber(request.getPhoneNumber());
        if (existingPhoneOpt.isPresent()) {
            throw new AlreadyExistsException(FrontEndCodes.GUEST_PHONE_EXISTS.getCode());
        }

        Guest guest = new Guest();
        guest.setFirstName(request.getFirstName());
        guest.setLastName(request.getLastName());
        guest.setEmail(request.getEmail());
        guest.setPhoneNumber(request.getPhoneNumber());

        guest.setHomeCountry(request.getHomeCountry());
        guest.setType(request.getType());

        if (request.getGuestTagIds() != null && !request.getGuestTagIds().isEmpty()) {
            List<GuestTag> guestTags = guestTagRepository.findAllById(request.getGuestTagIds());
            if (guestTags.size() != request.getGuestTagIds().size()) {
                throw new ResourceNotFoundException(FrontEndCodes.GUEST_TAG_NOT_FOUND.getCode());
            }
            guest.setGuestTags(new HashSet<>(guestTags));
        }

        return guestRepository.save(guest);
    }

    @Override
    public Guest updateGuest(UpdateGuestRequest request, long targetId) {
        Optional<Guest> existingGuestOpt = guestRepository.findById(targetId);
        if (existingGuestOpt.isEmpty()) {
            throw new ResourceNotFoundException(FrontEndCodes.GUEST_NOT_FOUND.getCode());
        }

        Guest existingGuest = existingGuestOpt.get();

        if (request.getEmail() != null) {
            Optional<Guest> existingEmail = guestRepository.findByEmail(request.getEmail());
            if (existingEmail.isPresent() && existingEmail.get().getId() != targetId) {
                throw new AlreadyExistsException(FrontEndCodes.GUEST_EMAIL_EXISTS.getCode());
            }
        }

        if (request.getPhoneNumber() != null) {
            Optional<Guest> existingPhone = guestRepository.findByPhoneNumber(request.getPhoneNumber());
            if (existingPhone.isPresent() && existingPhone.get().getId() != targetId) {
                throw new AlreadyExistsException(FrontEndCodes.GUEST_PHONE_EXISTS.getCode());
            }
        }

        existingGuest.setFirstName(request.getFirstName());
        existingGuest.setLastName(request.getLastName());
        existingGuest.setEmail(request.getEmail());
        existingGuest.setPhoneNumber(request.getPhoneNumber());
        existingGuest.setHomeCountry(request.getHomeCountry());
        existingGuest.setType(request.getType());
        existingGuest.setActive(request.getActive());

        if (request.getGuestTagIds() != null) {
            if (request.getGuestTagIds().isEmpty()) {
                existingGuest.getGuestTags().clear();
            } else {
                List<GuestTag> guestTags = guestTagRepository.findAllById(request.getGuestTagIds());
                if (guestTags.size() != request.getGuestTagIds().size()) {
                    throw new ResourceNotFoundException(FrontEndCodes.GUEST_TAG_NOT_FOUND.getCode());
                }
                existingGuest.getGuestTags().clear();
                existingGuest.setGuestTags(new HashSet<>(guestTags));
            }
        }

        return guestRepository.save(existingGuest);
    }

    @Override
    public void deleteGuest(long targetId) {
        guestRepository.findById(targetId).ifPresentOrElse(
                guest -> {
                    guest.setActive(false);
                    guestRepository.save(guest);
                },
                () -> {
                    throw new ResourceNotFoundException(FrontEndCodes.GUEST_NOT_FOUND.getCode());
                }
        );
    }

    @Override
    @Transactional(readOnly = true)
    public GuestDto convertGuestToDto(Guest guest) {
        GuestDto guestDto = modelMapper.map(guest, GuestDto.class);

        List<GuestTagDto> activeGuestTagDtos = guest.getGuestTags().stream()
                .filter(GuestTag::getActive)
                .map(guestTag -> modelMapper.map(guestTag, GuestTagDto.class))
                .collect(Collectors.toList());
        guestDto.setGuestTags(activeGuestTagDtos);

        return guestDto;
    }

    @Override
    public Predicate<Guest> buildGuestPredicate(GuestFilter filters) {
        Predicate<Guest> predicate = guest -> true;

        if (filters.getId() != null) {
            predicate = predicate.and(guest -> guest.getId() == filters.getId());
        }

        if (filters.getFirstName() != null && !filters.getFirstName().isEmpty()) {
            predicate = predicate.and(guest ->
                    guest.getFirstName().toLowerCase().contains(filters.getFirstName().toLowerCase()));
        }

        if (filters.getLastName() != null && !filters.getLastName().isEmpty()) {
            predicate = predicate.and(guest ->
                    guest.getLastName().toLowerCase().contains(filters.getLastName().toLowerCase()));
        }

        if (filters.getEmail() != null && !filters.getEmail().isEmpty()) {
            predicate = predicate.and(guest ->
                    guest.getEmail().toLowerCase().contains(filters.getEmail().toLowerCase()));
        }

        if (filters.getPhoneNumber() != null && !filters.getPhoneNumber().isEmpty()) {
            predicate = predicate.and(guest ->
                    guest.getPhoneNumber().contains(filters.getPhoneNumber()));
        }

        if (filters.getTypes() != null && !filters.getTypes().isEmpty()) {
            predicate = predicate.and(guest -> filters.getTypes().contains(guest.getType()));
        }

        if (filters.getActive() != null) {
            predicate = predicate.and(guest -> guest.getActive().equals(filters.getActive()));
        }

        if (filters.getGuestTagIds() != null && !filters.getGuestTagIds().isEmpty()) {
            predicate = predicate.and(guest ->
                    guest.getGuestTags().stream()
                            .anyMatch(guestTag -> filters.getGuestTagIds().contains(guestTag.getId())));
        }

        return predicate;
    }
}