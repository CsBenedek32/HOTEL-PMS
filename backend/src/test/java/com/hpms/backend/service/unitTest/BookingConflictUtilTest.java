package com.hpms.backend.service.unitTest;

import com.hpms.backend.enumCollection.BookingStatusEnum;
import com.hpms.backend.model.Booking;
import com.hpms.backend.model.Room;
import com.hpms.backend.util.BookingConflictUtil;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

public class BookingConflictUtilTest {

    @Test
    public void testHasConflictingBookings_OverlappingDates_ShouldReturnTrue() {
        Room room = new Room();
        room.setId(1L);

        Booking existingBooking = new Booking();
        existingBooking.setId(1L);
        existingBooking.setCheckInDate(LocalDate.of(2025, 1, 10));
        existingBooking.setCheckOutDate(LocalDate.of(2025, 1, 15));
        existingBooking.setStatus(BookingStatusEnum.RESERVED);
        existingBooking.setActive(true);

        Set<Booking> bookings = new HashSet<>();
        bookings.add(existingBooking);
        room.setBookings(bookings);

        LocalDate newCheckIn = LocalDate.of(2025, 1, 12);
        LocalDate newCheckOut = LocalDate.of(2025, 1, 17);

        boolean result = BookingConflictUtil.hasConflictingBookings(room, newCheckIn, newCheckOut);

        assertTrue(result);
    }

    @Test
    public void testHasConflictingBookings_NoOverlap_ShouldReturnFalse() {
        Room room = new Room();
        room.setId(1L);

        Booking existingBooking = new Booking();
        existingBooking.setId(1L);
        existingBooking.setCheckInDate(LocalDate.of(2025, 1, 10));
        existingBooking.setCheckOutDate(LocalDate.of(2025, 1, 15));
        existingBooking.setStatus(BookingStatusEnum.RESERVED);
        existingBooking.setActive(true);

        Set<Booking> bookings = new HashSet<>();
        bookings.add(existingBooking);
        room.setBookings(bookings);

        LocalDate newCheckIn = LocalDate.of(2025, 1, 20);
        LocalDate newCheckOut = LocalDate.of(2025, 1, 25);

        boolean result = BookingConflictUtil.hasConflictingBookings(room, newCheckIn, newCheckOut);

        assertFalse(result);
    }

    @Test
    public void testHasConflictingBookings_BackToBack_ShouldReturnFalse() {
        Room room = new Room();
        room.setId(1L);

        Booking existingBooking = new Booking();
        existingBooking.setId(1L);
        existingBooking.setCheckInDate(LocalDate.of(2025, 1, 10));
        existingBooking.setCheckOutDate(LocalDate.of(2025, 1, 15));
        existingBooking.setStatus(BookingStatusEnum.RESERVED);
        existingBooking.setActive(true);

        Set<Booking> bookings = new HashSet<>();
        bookings.add(existingBooking);
        room.setBookings(bookings);

        LocalDate newCheckIn = LocalDate.of(2025, 1, 15);
        LocalDate newCheckOut = LocalDate.of(2025, 1, 20);

        boolean result = BookingConflictUtil.hasConflictingBookings(room, newCheckIn, newCheckOut);

        assertFalse(result);
    }

    @Test
    public void testHasConflictingBookings_CancelledBooking_ShouldReturnFalse() {
        Room room = new Room();
        room.setId(1L);

        Booking existingBooking = new Booking();
        existingBooking.setId(1L);
        existingBooking.setCheckInDate(LocalDate.of(2025, 1, 10));
        existingBooking.setCheckOutDate(LocalDate.of(2025, 1, 15));
        existingBooking.setStatus(BookingStatusEnum.CANCELLED);
        existingBooking.setActive(true);

        Set<Booking> bookings = new HashSet<>();
        bookings.add(existingBooking);
        room.setBookings(bookings);

        LocalDate newCheckIn = LocalDate.of(2025, 1, 12);
        LocalDate newCheckOut = LocalDate.of(2025, 1, 17);

        boolean result = BookingConflictUtil.hasConflictingBookings(room, newCheckIn, newCheckOut);

        assertFalse(result);
    }

    @Test
    public void testHasConflictingBookings_CheckedOutBooking_ShouldReturnFalse() {
        Room room = new Room();
        room.setId(1L);

        Booking existingBooking = new Booking();
        existingBooking.setId(1L);
        existingBooking.setCheckInDate(LocalDate.of(2025, 1, 10));
        existingBooking.setCheckOutDate(LocalDate.of(2025, 1, 15));
        existingBooking.setStatus(BookingStatusEnum.CHECKED_OUT);
        existingBooking.setActive(true);

        Set<Booking> bookings = new HashSet<>();
        bookings.add(existingBooking);
        room.setBookings(bookings);

        LocalDate newCheckIn = LocalDate.of(2025, 1, 12);
        LocalDate newCheckOut = LocalDate.of(2025, 1, 17);

        boolean result = BookingConflictUtil.hasConflictingBookings(room, newCheckIn, newCheckOut);

        assertFalse(result);
    }

    @Test
    public void testHasConflictingBookings_ExcludeBookingId_ShouldReturnFalse() {
        Room room = new Room();
        room.setId(1L);

        Booking existingBooking = new Booking();
        existingBooking.setId(99L);
        existingBooking.setCheckInDate(LocalDate.of(2025, 1, 10));
        existingBooking.setCheckOutDate(LocalDate.of(2025, 1, 15));
        existingBooking.setStatus(BookingStatusEnum.RESERVED);
        existingBooking.setActive(true);

        Set<Booking> bookings = new HashSet<>();
        bookings.add(existingBooking);
        room.setBookings(bookings);

        LocalDate newCheckIn = LocalDate.of(2025, 1, 12);
        LocalDate newCheckOut = LocalDate.of(2025, 1, 17);

        boolean result = BookingConflictUtil.hasConflictingBookings(room, newCheckIn, newCheckOut, 99L);

        assertFalse(result);
    }

    @Test
    public void testAreRoomsAvailable_EmptyRoomList_ShouldReturnTrue() {
        Set<Room> rooms = new HashSet<>();

        LocalDate checkIn = LocalDate.of(2025, 1, 10);
        LocalDate checkOut = LocalDate.of(2025, 1, 15);

        boolean result = BookingConflictUtil.areRoomsAvailable(rooms, checkIn, checkOut);

        assertTrue(result);
    }

    @Test
    public void testAreRoomsAvailable_AllRoomsFree_ShouldReturnTrue() {
        Room room1 = new Room();
        room1.setId(1L);
        room1.setBookings(new HashSet<>());

        Room room2 = new Room();
        room2.setId(2L);
        room2.setBookings(new HashSet<>());

        Set<Room> rooms = new HashSet<>();
        rooms.add(room1);
        rooms.add(room2);

        LocalDate checkIn = LocalDate.of(2025, 1, 10);
        LocalDate checkOut = LocalDate.of(2025, 1, 15);

        boolean result = BookingConflictUtil.areRoomsAvailable(rooms, checkIn, checkOut);

        assertTrue(result);
    }

    @Test
    public void testAreRoomsAvailable_OneRoomHasConflict_ShouldReturnFalse() {
        Room room1 = new Room();
        room1.setId(1L);
        room1.setBookings(new HashSet<>());

        Room room2 = new Room();
        room2.setId(2L);

        Booking existingBooking = new Booking();
        existingBooking.setId(1L);
        existingBooking.setCheckInDate(LocalDate.of(2025, 1, 10));
        existingBooking.setCheckOutDate(LocalDate.of(2025, 1, 15));
        existingBooking.setStatus(BookingStatusEnum.RESERVED);
        existingBooking.setActive(true);

        Set<Booking> bookings = new HashSet<>();
        bookings.add(existingBooking);
        room2.setBookings(bookings);

        Set<Room> rooms = new HashSet<>();
        rooms.add(room1);
        rooms.add(room2);

        LocalDate checkIn = LocalDate.of(2025, 1, 12);
        LocalDate checkOut = LocalDate.of(2025, 1, 17);

        boolean result = BookingConflictUtil.areRoomsAvailable(rooms, checkIn, checkOut);

        assertFalse(result);
    }
}