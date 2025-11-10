package com.hpms.backend.service.implament;

import com.hpms.backend.dto.BookingDto;
import com.hpms.backend.dto.InvoiceDto;
import com.hpms.backend.dto.ServiceModelDto;
import com.hpms.backend.enumCollection.BookingInvoiceEnum;
import com.hpms.backend.enumCollection.FrontEndCodes;
import com.hpms.backend.enumCollection.PaymentStatusEnum;
import com.hpms.backend.exception.ResourceNotFoundException;
import com.hpms.backend.filter.InvoiceFilter;
import com.hpms.backend.model.Booking;
import com.hpms.backend.model.Invoice;
import com.hpms.backend.model.Room;
import com.hpms.backend.model.ServiceModel;
import com.hpms.backend.repository.BookingRepository;
import com.hpms.backend.repository.InvoiceRepository;
import com.hpms.backend.repository.ServiceModelRepository;
import com.hpms.backend.request.CreateInvoiceRequest;
import com.hpms.backend.request.UpdateInvoiceRequest;
import com.hpms.backend.service.inter.IBookingService;
import com.hpms.backend.service.inter.IInvoiceService;
import com.hpms.backend.service.inter.IServiceModelService;
import com.hpms.backend.util.InvoiceCalculationUtil;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.function.Predicate;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class InvoiceService implements IInvoiceService {
    private final InvoiceRepository invoiceRepository;
    private final BookingRepository bookingRepository;
    private final ServiceModelRepository serviceModelRepository;
    private final ModelMapper modelMapper;
    private final IServiceModelService serviceModelService;
    private final IBookingService bookingService;

    @Transactional(readOnly = true)
    @Override
    public List<Invoice> getInvoices(InvoiceFilter filters) {
        if (filters == null) {
            return invoiceRepository.findAll().stream()
                    .filter(Invoice::getActive)
                    .collect(Collectors.toList());
        }

        return invoiceRepository.findAll().stream()
                .filter(Invoice::getActive)
                .filter(buildInvoicePredicate(filters))
                .collect(Collectors.toList());
    }

    @Override
    public Invoice createInvoice(CreateInvoiceRequest request) {
        if (request.getInitialBookingId() != null) {
            bookingRepository.findById(request.getInitialBookingId())
                    .orElseThrow(() -> new ResourceNotFoundException(FrontEndCodes.INVOICE_BOOKING_NOT_FOUND.getCode()));
        }

        Invoice invoice = new Invoice();
        invoice.setName(request.getName());
        invoice.setActive(true);
        invoice.setPaymentStatus(PaymentStatusEnum.PENDING);

        invoiceRepository.save(invoice);

        if (request.getInitialBookingId() != null) {
            Booking initialBooking = bookingRepository.findById(request.getInitialBookingId()).get();
            initialBooking.setInvoice(invoice);
            initialBooking.setScynStatus(BookingInvoiceEnum.NOT_SYNCED);
            bookingRepository.save(initialBooking);
            syncWithBookings(invoice.getId());
        }

        return invoice;
    }

    @Override
    public void syncWithBookings(Long targetId) {
        Invoice invoice = invoiceRepository.findById(targetId)
                .orElseThrow(() -> new ResourceNotFoundException(FrontEndCodes.INVOICE_NOT_FOUND.getCode()));

        List<Booking> bookingsToSync = bookingRepository.findByInvoiceIdAndActive(targetId, true);

        for (Booking booking : bookingsToSync) {
            List<Room> rooms = booking.getRooms().stream().toList();

            if (!rooms.isEmpty()) {
                ServiceModel virtualService = serviceModelService.createVirtualServiceModel(
                        rooms,
                        booking.getCheckInDate(),
                        booking.getCheckOutDate()
                );

                invoice.getServiceModels().add(virtualService);
            }

            booking.setScynStatus(BookingInvoiceEnum.SYNCED);
            bookingRepository.save(booking);
        }
        invoice.setTotalSum(InvoiceCalculationUtil.calculateTotalSum(invoice.getServiceModels()));
        invoiceRepository.save(invoice);
    }

    @Override
    public Invoice updateInvoice(UpdateInvoiceRequest request, long targetId) {
        return invoiceRepository.findById(targetId).map(existingInvoice -> {
            existingInvoice.setName(request.getName());
            existingInvoice.setDescription(request.getDescription());

            // Track when payment was fulfilled
            if (request.getPaymentStatus() == PaymentStatusEnum.FULFILLED
                    && existingInvoice.getPaymentStatus() != PaymentStatusEnum.FULFILLED) {
                existingInvoice.setPaymentFulfilledAt(java.time.LocalDateTime.now());
            }

            existingInvoice.setPaymentStatus(request.getPaymentStatus());
            existingInvoice.setRecipientName(request.getRecipientName());
            existingInvoice.setRecipientCompanyName(request.getRecipientCompanyName());
            existingInvoice.setRecipientAddress(request.getRecipientAddress());
            existingInvoice.setRecipientCity(request.getRecipientCity());
            existingInvoice.setRecipientPostalCode(request.getRecipientPostalCode());
            existingInvoice.setRecipientCountry(request.getRecipientCountry());
            existingInvoice.setRecipientTaxNumber(request.getRecipientTaxNumber());
            existingInvoice.setRecipientEmail(request.getRecipientEmail());
            existingInvoice.setRecipientPhone(request.getRecipientPhone());
            invoiceRepository.save(existingInvoice);
            return existingInvoice;
        }).orElseThrow(() -> new ResourceNotFoundException(FrontEndCodes.INVOICE_NOT_FOUND.getCode()));
    }

    @Override
    public Invoice updateInvoiceServices(long targetId, List<Long> serviceModelIds) {
        return invoiceRepository.findById(targetId).map(existingInvoice -> {
            if (serviceModelIds == null || serviceModelIds.isEmpty()) {
                existingInvoice.getServiceModels().clear();
            } else {
                List<ServiceModel> services = serviceModelRepository.findAllById(serviceModelIds);

                if (services.size() != serviceModelIds.size()) {
                    throw new ResourceNotFoundException(FrontEndCodes.INVOICE_SERVICE_NOT_FOUND.getCode());
                }
                existingInvoice.setServiceModels(services);
            }
            existingInvoice.setTotalSum(InvoiceCalculationUtil.calculateTotalSum(existingInvoice.getServiceModels()));
            invoiceRepository.save(existingInvoice);
            return existingInvoice;
        }).orElseThrow(() -> new ResourceNotFoundException(FrontEndCodes.INVOICE_NOT_FOUND.getCode()));
    }

    @Override
    public Invoice addInvoiceBookings(long targetId, long bookingId) {
        return invoiceRepository.findById(targetId).map(existingInvoice -> {
            Booking b = bookingRepository.findById(bookingId).orElseThrow(() -> new ResourceNotFoundException(FrontEndCodes.INVOICE_BOOKING_NOT_FOUND.getCode()));

            if(!b.isActive()) throw new IllegalArgumentException(FrontEndCodes.BOOKING_NOT_ACTIVE.getCode());
            if(b.getScynStatus() != BookingInvoiceEnum.NO_INVOICE) throw new IllegalArgumentException(FrontEndCodes.INVOICE_BOOKING_IS_TAKEN.getCode());

            b.setInvoice(existingInvoice);
            bookingRepository.save(b);

            List<ServiceModel> virtualServices = existingInvoice.getServiceModels().stream()
                    .filter(ServiceModel::getVirtual).toList();
            existingInvoice.getServiceModels().removeAll(virtualServices);

            syncWithBookings(existingInvoice.getId());
            return existingInvoice;
        }).orElseThrow(() -> new ResourceNotFoundException(FrontEndCodes.INVOICE_NOT_FOUND.getCode()));
    }

    @Override
    public Invoice removeInvoiceBookings(long targetId, long bookingId) {
        return invoiceRepository.findById(targetId).map(existingInvoice -> {
            Booking b = bookingRepository.findById(bookingId).orElseThrow(() -> new ResourceNotFoundException(FrontEndCodes.INVOICE_BOOKING_NOT_FOUND.getCode()));

            if(!b.isActive()) throw new IllegalArgumentException(FrontEndCodes.BOOKING_NOT_ACTIVE.getCode());
            if(b.getInvoice() != existingInvoice) throw new IllegalArgumentException(FrontEndCodes.INVOICE_BOOKING_MISSMATCH.getCode());

            b.setInvoice(null);
            b.setScynStatus(BookingInvoiceEnum.NO_INVOICE);
            bookingRepository.save(b);

            List<ServiceModel> virtualServices = existingInvoice.getServiceModels().stream()
                    .filter(ServiceModel::getVirtual).toList();
            existingInvoice.getServiceModels().removeAll(virtualServices);

            invoiceRepository.save(existingInvoice);
            syncWithBookings(existingInvoice.getId());

            return existingInvoice;
        }).orElseThrow(() -> new ResourceNotFoundException(FrontEndCodes.INVOICE_NOT_FOUND.getCode()));
    }



    @Override
    public void deleteInvoice(long targetId) {
        invoiceRepository.findById(targetId).ifPresentOrElse(
                invoice -> {
                    for (Booking booking : invoice.getBookings()) {
                        booking.setInvoice(null);
                        booking.setScynStatus(null);
                        bookingRepository.save(booking);
                    }
                    invoice.setActive(false);
                    invoiceRepository.save(invoice);
                },
                () -> {
                    throw new ResourceNotFoundException(FrontEndCodes.INVOICE_NOT_FOUND.getCode());
                }
        );
    }

    @Override
    @Transactional(readOnly = true)
    public InvoiceDto convertInvoiceToDto(Invoice invoice) {
        if (invoice == null) {
            return null;
        }

        InvoiceDto invoiceDto = modelMapper.map(invoice, InvoiceDto.class);

        List<BookingDto> bookingDtos = invoice.getBookings() != null ?
                invoice.getBookings().stream()
                        .filter(Booking::isActive)
                        .map(bookingService::convertBookingToDto)
                        .collect(Collectors.toList()) :
                new ArrayList<>();
        invoiceDto.setBookings(bookingDtos);

        List<ServiceModelDto> serviceModelDtos = invoice.getServiceModels() != null ?
                invoice.getServiceModels().stream()
                        .map(serviceModelService::convertServiceModelToDto)
                        .collect(Collectors.toList()) :
                new ArrayList<>() {
                };
        invoiceDto.setServiceModels(serviceModelDtos);

        return invoiceDto;
    }

    @Override
    public Predicate<Invoice> buildInvoicePredicate(InvoiceFilter filters) {
        Predicate<Invoice> predicate = invoice -> true;

        if (filters.getId() != null) {
            predicate = predicate.and(invoice -> invoice.getId().equals(filters.getId()));
        }

        if (filters.getName() != null && !filters.getName().isEmpty()) {
            predicate = predicate.and(invoice ->
                    invoice.getName().toLowerCase().contains(filters.getName().toLowerCase()));
        }

        if (filters.getPaymentStatuses() != null && !filters.getPaymentStatuses().isEmpty()) {
            predicate = predicate.and(invoice -> filters.getPaymentStatuses().contains(invoice.getPaymentStatus()));
        }

        if (filters.getRecipientName() != null && !filters.getRecipientName().isEmpty()) {
            predicate = predicate.and(invoice ->
                    invoice.getRecipientName() != null &&
                            invoice.getRecipientName().toLowerCase().contains(filters.getRecipientName().toLowerCase()));
        }

        if (filters.getRecipientCompanyName() != null && !filters.getRecipientCompanyName().isEmpty()) {
            predicate = predicate.and(invoice ->
                    invoice.getRecipientCompanyName() != null &&
                            invoice.getRecipientCompanyName().toLowerCase().contains(filters.getRecipientCompanyName().toLowerCase()));
        }

        if (filters.getRecipientEmail() != null && !filters.getRecipientEmail().isEmpty()) {
            predicate = predicate.and(invoice ->
                    invoice.getRecipientEmail() != null &&
                            invoice.getRecipientEmail().toLowerCase().contains(filters.getRecipientEmail().toLowerCase()));
        }

        if (filters.getMinTotalSum() != null) {
            predicate = predicate.and(invoice ->
                    invoice.getTotalSum() != null && invoice.getTotalSum() >= filters.getMinTotalSum());
        }

        if (filters.getMaxTotalSum() != null) {
            predicate = predicate.and(invoice ->
                    invoice.getTotalSum() != null && invoice.getTotalSum() <= filters.getMaxTotalSum());
        }

        if (filters.getCreatedAfter() != null) {
            predicate = predicate.and(invoice -> !invoice.getCreatedAt().isBefore(filters.getCreatedAfter()));
        }

        if (filters.getCreatedBefore() != null) {
            predicate = predicate.and(invoice -> !invoice.getCreatedAt().isAfter(filters.getCreatedBefore()));
        }

        if (filters.getBookingIds() != null && !filters.getBookingIds().isEmpty()) {
            predicate = predicate.and(invoice ->
                    invoice.getBookings().stream()
                            .anyMatch(booking -> filters.getBookingIds().contains(booking.getId())));
        }

        return predicate;
    }

    @Override
    public Invoice getInvoiceById(Long invoiceId) {
        return invoiceRepository.findById(invoiceId)
                .orElseThrow(() -> new ResourceNotFoundException(FrontEndCodes.INVOICE_NOT_FOUND.getCode()));
    }
}