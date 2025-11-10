package com.hpms.backend.service.inter;

import com.hpms.backend.dto.BookingDto;
import com.hpms.backend.enumCollection.BookingStatusEnum;
import com.hpms.backend.filter.BookingFilter;
import com.hpms.backend.model.Booking;
import com.hpms.backend.request.CreateBookingRequest;
import com.hpms.backend.request.UpdateBookingRequest;

import java.util.List;
import java.util.function.Predicate;

public interface IBookingService {

    List<Booking> getBookings(BookingFilter filters);

    Booking createBooking(CreateBookingRequest request);

    Booking updateBooking(UpdateBookingRequest request, long targetId);

    Booking updateBookingStatus(long targetId, BookingStatusEnum newStatus);

    Boolean canSetStatus(Booking booking, BookingStatusEnum newStatus);

    void deleteBooking(long targetId); // no hard delete just active = false

    BookingDto convertBookingToDto(Booking booking);

    Predicate<Booking> buildBookingPredicate(BookingFilter filters);

    //bookingss and invoices are closely togther , when some fields of booking changes (arrive time, guest num, departTime, rooms) we need to scyn invoices
    //im planning a scyn invoice button on front end that shows insead of show invoice if its outOfScyn
    //how about we have a new field in booking inScync which has 3 possible value (sncyed , outOfscyn , no Invoice)
    //and we set this value based on updatr
    //any other solution?  or should we just doit automatically?

    //my ideas for Invoices, when a booking is created it doesnt automatically creates an invoice,
    //when the frontend chooses to create an invoice (no need for any other data it auto creates a  name for it , the others are left blank) it also asks for a number of booking Ids (we need to change the realiton ship to ManyToOne ( many bookings can belong to one invoice)
    //then we create a base invoice , loop over the booking IDs and for each one we add a virtual serviceModel each of these service model's will have the cost
    //of the sum price of the rooms inside said booking and the vat of the serviceModel of the serviceModal with the id 1
    //that will be a preprogramed service model with the priceOf 0 and the name "rooms cost"
    //(this is just the inital vat of the virtual serviceModel we can later change the vat of each virtual  serviceModel, no need to keep it scyned to the service model with the id 1)

    //also  we need to change invoice model so it can take the data of the primery invoicee (persone / company) if it person we
    //can add a new persone data (we can just type it in) or we can choose one of the guest that is connected any of the bookings inside the ivnocie

    //this is just me thinking tell your opinion on all this, and lets plan togheter

}

