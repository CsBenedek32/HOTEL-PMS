package com.hpms.backend.util;

import com.hpms.backend.enumCollection.BookingStatusEnum;
import com.hpms.backend.model.Booking;
import com.hpms.backend.model.Room;

import java.time.LocalDate;
import java.util.Collection;

/**
 * Utility osztály a foglalási konfliktusok ellenőrzésére.
 * Segít meghatározni, hogy egy szoba elérhető-e egy adott időszakban.
 */
public class BookingConflictUtil {

    /**
     * Ellenőrzi, hogy egy szobának vannak-e ütköző foglalásai az adott időszakra.
     * @param room Az ellenőrizendő szoba
     * @param checkInDate A bejelentkezés dátuma
     * @param checkOutDate A kijelentkezés dátuma
     * @param excludeBookingId Opcionális foglalás ID, amit ki kell zárni az ellenőrzésből (null ha nincs)
     * @return true ha vannak ütköző foglalások, false egyébként
     */
    public static boolean hasConflictingBookings(Room room, LocalDate checkInDate, LocalDate checkOutDate, Long excludeBookingId) {
        return room.getBookings().stream()
                .filter(Booking::isActive)
                .filter(booking -> excludeBookingId == null || booking.getId() != excludeBookingId)
                .filter(booking -> !isNonBlockingStatus(booking.getStatus()))
                .anyMatch(booking -> hasDateOverlap(booking, checkInDate, checkOutDate));
    }

    /**
     * Ellenőrzi, hogy egy szobának vannak-e ütköző foglalásai az adott időszakra.
     * @param room Az ellenőrizendő szoba
     * @param checkInDate A bejelentkezés dátuma
     * @param checkOutDate A kijelentkezés dátuma
     * @return true ha vannak ütköző foglalások, false egyébként
     */
    public static boolean hasConflictingBookings(Room room, LocalDate checkInDate, LocalDate checkOutDate) {
        return hasConflictingBookings(room, checkInDate, checkOutDate, null);
    }

    /**
     * Ellenőrzi, hogy az összes szoba elérhető-e az adott foglaláshoz.
     * @param rooms Az ellenőrizendő szobák kollekciója
     * @param checkInDate A bejelentkezés dátuma
     * @param checkOutDate A kijelentkezés dátuma
     * @param excludeBookingId Opcionális foglalás ID, amit ki kell zárni az ellenőrzésből
     * @return true ha minden szoba elérhető, false ha bármelyiknek van konfliktusa
     */
    public static boolean areRoomsAvailable(Collection<Room> rooms, LocalDate checkInDate, LocalDate checkOutDate, Long excludeBookingId) {
        if (rooms == null || rooms.isEmpty()) {
            return true;
        }

        return rooms.stream()
                .noneMatch(room -> hasConflictingBookings(room, checkInDate, checkOutDate, excludeBookingId));
    }

    /**
     * Ellenőrzi, hogy az összes szoba elérhető-e az adott foglaláshoz.
     * @param rooms Az ellenőrizendő szobák kollekciója
     * @param checkInDate A bejelentkezés dátuma
     * @param checkOutDate A kijelentkezés dátuma
     * @return true ha minden szoba elérhető, false ha bármelyiknek van konfliktusa
     */
    public static boolean areRoomsAvailable(Collection<Room> rooms, LocalDate checkInDate, LocalDate checkOutDate) {
        return areRoomsAvailable(rooms, checkInDate, checkOutDate, null);
    }

    /**
     * Ellenőrzi, hogy egy foglalási státusz blokkolja-e a szoba elérhetőségét.
     * @param status Az ellenőrizendő foglalási státusz
     * @return true ha a státusz NEM blokkolja az elérhetőséget
     */
    private static boolean isNonBlockingStatus(BookingStatusEnum status) {
        return status == BookingStatusEnum.CHECKED_OUT || status == BookingStatusEnum.CANCELLED;
    }

    /**
     * Ellenőrzi, hogy két dátumtartomány átfed-e egymással.
     * @param booking A meglévő foglalás
     * @param checkInDate Az új bejelentkezés dátuma
     * @param checkOutDate Az új kijelentkezés dátuma
     * @return true ha a dátumok átfedik egymást
     */
    private static boolean hasDateOverlap(Booking booking, LocalDate checkInDate, LocalDate checkOutDate) {
        return !(booking.getCheckOutDate().compareTo(checkInDate) <= 0 ||
                booking.getCheckInDate().compareTo(checkOutDate) >= 0);
    }
}