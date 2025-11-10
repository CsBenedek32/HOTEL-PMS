package com.hpms.backend.service.inter;

import com.hpms.backend.dto.VatDto;
import com.hpms.backend.filter.VatFilter;
import com.hpms.backend.model.Vat;
import com.hpms.backend.request.CreateVatRequest;
import com.hpms.backend.request.UpdateVatRequest;

import java.util.List;
import java.util.function.Predicate;

public interface IVatService {

    List<Vat> getVats(VatFilter filters);

    Vat createVat(CreateVatRequest request);

    Vat updateVat(UpdateVatRequest request, long targetId);

    void deleteVat(long targetId);

    VatDto convertVatToDto(Vat vat);

    Predicate<Vat> buildVatPredicate(VatFilter filters);
}