package com.hpms.backend.service.implament;

import com.hpms.backend.dto.VatDto;
import com.hpms.backend.enumCollection.FrontEndCodes;
import com.hpms.backend.exception.AlreadyExistsException;
import com.hpms.backend.exception.ResourceNotFoundException;
import com.hpms.backend.filter.VatFilter;
import com.hpms.backend.model.Vat;
import com.hpms.backend.repository.VatRepository;
import com.hpms.backend.request.CreateVatRequest;
import com.hpms.backend.request.UpdateVatRequest;
import com.hpms.backend.service.inter.IVatService;
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
public class VatService implements IVatService {
    private final VatRepository vatRepository;
    private final ModelMapper modelMapper;

    @Transactional(readOnly = true)
    @Override
    public List<Vat> getVats(VatFilter filters) {
        if (filters == null) {
            return vatRepository.findAll();
        }

        return vatRepository.findAll().stream()
                .filter(buildVatPredicate(filters))
                .collect(Collectors.toList());
    }

    @Override
    public Vat createVat(CreateVatRequest request) {
        Optional<Vat> existingVatOpt = vatRepository.findByName(request.getName());

        if (existingVatOpt.isPresent()) {
            throw new AlreadyExistsException(FrontEndCodes.VAT_ALREADY_EXISTS.getCode());
        }

        Vat vat = new Vat();
        vat.setName(request.getName());
        vat.setPercentage(request.getPercentage());

        return vatRepository.save(vat);
    }

    @Override
    public Vat updateVat(UpdateVatRequest request, long targetId) {
        Optional<Vat> existingVatOpt = vatRepository.findById(targetId);
        if (existingVatOpt.isEmpty()) {
            throw new ResourceNotFoundException(FrontEndCodes.VAT_NOT_FOUND.getCode());
        }

        Vat existingVat = existingVatOpt.get();
        Optional<Vat> existingName = vatRepository.findByName(request.getName());

        if (existingName.isPresent() && existingName.get().getId() != targetId) {
            throw new AlreadyExistsException(FrontEndCodes.VAT_ALREADY_EXISTS.getCode());
        }

        existingVat.setName(request.getName());
        existingVat.setPercentage(request.getPercentage());
        return vatRepository.save(existingVat);
    }

    @Override
    public void deleteVat(long targetId) {
        vatRepository.findById(targetId).ifPresentOrElse(
                vat -> {
                    if (vat.getServiceModels().isEmpty()) {
                        vatRepository.deleteById(targetId);
                    } else {
                        throw new IllegalStateException(FrontEndCodes.VAT_HAS_SERVICES.getCode());
                    }
                },
                () -> {
                    throw new ResourceNotFoundException(FrontEndCodes.VAT_NOT_FOUND.getCode());
                }
        );
    }

    @Override
    @Transactional(readOnly = true)
    public VatDto convertVatToDto(Vat vat) {
        return modelMapper.map(vat, VatDto.class);
    }

    @Override
    public Predicate<Vat> buildVatPredicate(VatFilter filters) {
        Predicate<Vat> predicate = vat -> true;

        if (filters.getId() != null) {
            predicate = predicate.and(vat -> vat.getId() == filters.getId());
        }

        if (filters.getName() != null && !filters.getName().isEmpty()) {
            predicate = predicate.and(vat ->
                    vat.getName().toLowerCase().contains(filters.getName().toLowerCase()));
        }

        if (filters.getPercentage() != null) {
            predicate = predicate.and(vat ->
                    vat.getPercentage() != null && vat.getPercentage().equals(filters.getPercentage()));
        }

        return predicate;
    }
}