package com.hpms.backend.service.inter;

import com.hpms.backend.dto.InvoiceDto;
import com.hpms.backend.filter.InvoiceFilter;
import com.hpms.backend.model.Invoice;
import com.hpms.backend.request.CreateInvoiceRequest;
import com.hpms.backend.request.UpdateInvoiceRequest;

import java.util.List;
import java.util.function.Predicate;

public interface IInvoiceService {

    List<Invoice> getInvoices(InvoiceFilter filters);

    Invoice createInvoice(CreateInvoiceRequest request);

    void syncWithBookings(Long targetId);

    Invoice updateInvoice(UpdateInvoiceRequest request, long targetId);

    Invoice updateInvoiceServices(long TargetId, List<Long> serviceModelIds);

    Invoice addInvoiceBookings(long targetId, long bookingId);

    Invoice removeInvoiceBookings(long targetId, long bookingId);

    void deleteInvoice(long targetId);

    InvoiceDto convertInvoiceToDto(Invoice invoice);

    Predicate<Invoice> buildInvoicePredicate(InvoiceFilter filters);

    Invoice getInvoiceById(Long invoiceId);

}