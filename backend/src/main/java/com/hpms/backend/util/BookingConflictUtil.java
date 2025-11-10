package com.hpms.backend.util;

import com.hpms.backend.enumCollection.BookingStatusEnum;
import com.hpms.backend.model.Booking;
import com.hpms.backend.model.Room;

import java.time.LocalDate;
import java.util.Collection;

public class BookingConflictUtil {

    /**
     * Checks if a room has conflicting bookings for the given date range
     * @param room The room to check
     * @param checkInDate The check-in date
     * @param checkOutDate The check-out date
     * @param excludeBookingId Optional booking ID to exclude from conflict check (null if not needed)
     * @return true if there are conflicting bookings, false otherwise
     */
    public static boolean hasConflictingBookings(Room room, LocalDate checkInDate, LocalDate checkOutDate, Long excludeBookingId) {
        return room.getBookings().stream()
                .filter(Booking::isActive)
                .filter(booking -> excludeBookingId == null || booking.getId() != excludeBookingId)
                .filter(booking -> !isNonBlockingStatus(booking.getStatus()))
                .anyMatch(booking -> hasDateOverlap(booking, checkInDate, checkOutDate));
    }

    /**
     * Checks if a room has conflicting bookings for the given date range
     * @param room The room to check
     * @param checkInDate The check-in date
     * @param checkOutDate The check-out date
     * @return true if there are conflicting bookings, false otherwise
     */
    public static boolean hasConflictingBookings(Room room, LocalDate checkInDate, LocalDate checkOutDate) {
        return hasConflictingBookings(room, checkInDate, checkOutDate, null);
    }

    /**
     * Checks if all rooms are available for the given booking
     * @param rooms Collection of rooms to check
     * @param checkInDate The check-in date
     * @param checkOutDate The check-out date
     * @param excludeBookingId Optional booking ID to exclude from conflict check
     * @return true if all rooms are available, false if any room has conflicts
     */
    public static boolean areRoomsAvailable(Collection<Room> rooms, LocalDate checkInDate, LocalDate checkOutDate, Long excludeBookingId) {
        if (rooms == null || rooms.isEmpty()) {
            return true;
        }

        return rooms.stream()
                .noneMatch(room -> hasConflictingBookings(room, checkInDate, checkOutDate, excludeBookingId));
    }

    /**
     * Checks if all rooms are available for the given booking
     * @param rooms Collection of rooms to check
     * @param checkInDate The check-in date
     * @param checkOutDate The check-out date
     * @return true if all rooms are available, false if any room has conflicts
     */
    public static boolean areRoomsAvailable(Collection<Room> rooms, LocalDate checkInDate, LocalDate checkOutDate) {
        return areRoomsAvailable(rooms, checkInDate, checkOutDate, null);
    }

    /**
     * Checks if a booking status blocks room availability
     * @param status The booking status to check
     * @return true if the status does NOT block availability
     */
    private static boolean isNonBlockingStatus(BookingStatusEnum status) {
        return status == BookingStatusEnum.CHECKED_OUT || status == BookingStatusEnum.CANCELLED;
    }

    /**
     * Checks if two date ranges overlap
     * @param booking The existing booking
     * @param checkInDate The new check-in date
     * @param checkOutDate The new check-out date
     * @return true if dates overlap
     */
    private static boolean hasDateOverlap(Booking booking, LocalDate checkInDate, LocalDate checkOutDate) {
        return !(booking.getCheckOutDate().compareTo(checkInDate) <= 0 ||
                booking.getCheckInDate().compareTo(checkOutDate) >= 0);
    }
}