package com.hpms.backend.service.inter;

import com.hpms.backend.dto.GuestTagDto;
import com.hpms.backend.filter.GuestTagFilter;
import com.hpms.backend.model.GuestTag;
import com.hpms.backend.request.CreateGuestTagRequest;
import com.hpms.backend.request.UpdateGuestTagRequest;

import java.util.List;
import java.util.function.Predicate;

public interface IGuestTagService {

    List<GuestTag> getGuestTags(GuestTagFilter filters);

    GuestTag createGuestTag(CreateGuestTagRequest request);

    GuestTag updateGuestTag(UpdateGuestTagRequest request, long targetId);

    void deleteGuestTag(long targetId);

    GuestTagDto convertGuestTagToDto(GuestTag guestTag);

    Predicate<GuestTag> buildGuestTagPredicate(GuestTagFilter filters);
}