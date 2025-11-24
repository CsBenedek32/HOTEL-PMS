package com.hpms.backend.service.implament;

import com.hpms.backend.dto.BedTypeDto;
import com.hpms.backend.enumCollection.FrontEndCodes;
import com.hpms.backend.exception.AlreadyExistsException;
import com.hpms.backend.exception.ResourceNotFoundException;
import com.hpms.backend.filter.BedTypeFilter;
import com.hpms.backend.model.BedType;
import com.hpms.backend.repository.BedTypeRepository;
import com.hpms.backend.request.CreateBedTypeRequest;
import com.hpms.backend.request.UpdateBedTypeRequest;
import com.hpms.backend.service.inter.IBedTypeService;
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
public class BedTypeService implements IBedTypeService {
    private final BedTypeRepository bedTypeRepository;
    private final ModelMapper modelMapper;

    /**
     * Lekérdezi az ágytípusokat opcionális szűrőkkel.
     * @param filters Szűrési feltételek (null esetén minden ágytípust visszaad)
     * @return A szűrt ágytípusok listája
     */
    @Transactional(readOnly = true)
    @Override
    public List<BedType> getBedTypes(BedTypeFilter filters) {
        if (filters == null) {
            return bedTypeRepository.findAll();
        }

        return bedTypeRepository.findAll().stream()
                .filter(buildBedTypePredicate(filters))
                .collect(Collectors.toList());
    }

    /**
     * Új ágytípus létrehozása.
     * Ellenőrzi, hogy a név már létezik-e
     * @param request A létrehozási kérés adatai
     * @return A létrehozott ágytípus
     * @throws AlreadyExistsException ha a név már foglalt
     */
    @Override
    public BedType createBedType(CreateBedTypeRequest request) {
        Optional<BedType> existingBedTypeOpt = bedTypeRepository.findByBedTypeName(request.getBedTypeName());

        if (existingBedTypeOpt.isPresent()) {
            throw new AlreadyExistsException(FrontEndCodes.BED_TYPE_ALREADY_EXISTS.getCode());
        }

        BedType bedType = new BedType();
        bedType.setBedTypeName(request.getBedTypeName());

        return bedTypeRepository.save(bedType);
    }

    /**
     * Meglévő ágytípus módosítása.
     * Név egyediség ellenőrzést végez, hogy ne legyen duplikált név más ágytípusnál
     * @param request A módosítási kérés adatai
     * @param targetId A módosítandó ágytípus ID-ja
     * @return A módosított ágytípus
     * @throws ResourceNotFoundException ha az ágytípus nem található
     * @throws AlreadyExistsException ha az új név már foglalt
     */
    @Override
    public BedType updateBedType(UpdateBedTypeRequest request, long targetId) {
        Optional<BedType> existingBedTypeOpt = bedTypeRepository.findById(targetId);
        if (existingBedTypeOpt.isEmpty()) {
            throw new ResourceNotFoundException(FrontEndCodes.BED_TYPE_NOT_FOUND.getCode());
        }

        BedType existingBedType = existingBedTypeOpt.get();
        Optional<BedType> existingName = bedTypeRepository.findByBedTypeName(request.getBedTypeName());

        if (existingName.isPresent() && existingName.get().getId() != targetId) {
            throw new AlreadyExistsException(FrontEndCodes.BED_TYPE_ALREADY_EXISTS.getCode());
        }

        existingBedType.setBedTypeName(request.getBedTypeName());
        return bedTypeRepository.save(existingBedType);
    }

    /**
     * Ágytípus törlése.
     * Csak akkor engedi a törlést, ha nincs hozzárendelve egy szobatípushoz sem.
     * @param targetId A törlendő ágytípus ID-ja
     * @throws ResourceNotFoundException ha az ágytípus nem található
     * @throws IllegalStateException ha az ágytípus használatban van
     */
    @Override
    public void deleteBedType(long targetId) {
        bedTypeRepository.findById(targetId).ifPresentOrElse(
                bedType -> {
                    if (bedType.getRoomTypes().isEmpty()) {
                        bedTypeRepository.deleteById(targetId);
                    } else {
                        throw new IllegalStateException(FrontEndCodes.BED_TYPE_HAS_ROOM_TYPES.getCode());
                    }
                },
                () -> {
                    throw new ResourceNotFoundException(FrontEndCodes.BED_TYPE_NOT_FOUND.getCode());
                }
        );
    }

    @Override
    @Transactional(readOnly = true)
    public BedTypeDto convertBedTypeToDto(BedType bedType) {
        return modelMapper.map(bedType, BedTypeDto.class);
    }

    @Override
    public Predicate<BedType> buildBedTypePredicate(BedTypeFilter filters) {
        Predicate<BedType> predicate = bedType -> true;

        if (filters.getId() != null) {
            predicate = predicate.and(bedType -> bedType.getId() == filters.getId());
        }

        if (filters.getBedTypeName() != null && !filters.getBedTypeName().isEmpty()) {
            predicate = predicate.and(bedType ->
                    bedType.getBedTypeName().toLowerCase().contains(filters.getBedTypeName().toLowerCase()));
        }

        return predicate;
    }
}