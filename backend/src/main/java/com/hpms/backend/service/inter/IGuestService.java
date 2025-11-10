package com.hpms.backend.service.inter;

import com.hpms.backend.dto.GuestDto;
import com.hpms.backend.filter.GuestFilter;
import com.hpms.backend.model.Guest;
import com.hpms.backend.request.CreateGuestRequest;
import com.hpms.backend.request.UpdateGuestRequest;

import java.util.List;
import java.util.function.Predicate;

public interface IGuestService {

    List<Guest> getGuests(GuestFilter filters);

    Guest createGuest(CreateGuestRequest request);

    Guest updateGuest(UpdateGuestRequest request, long targetId);

    void deleteGuest(long targetId);

    GuestDto convertGuestToDto(Guest guest);

    Predicate<Guest> buildGuestPredicate(GuestFilter filters);
}