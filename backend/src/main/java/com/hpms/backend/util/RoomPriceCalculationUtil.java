package com.hpms.backend.util;

import com.hpms.backend.model.Room;

import java.time.LocalDate;
import java.util.List;

/**
 * Utility osztály szoba árak számításához.
 * A foglalás időtartama alapján számítja ki a szobák összesített költségét.
 */
public class RoomPriceCalculationUtil {

    /**
     * Kiszámítja a szobák összesített költségét a foglalás időtartama alapján.
     * @param rooms A szobák listája
     * @param checkInDate A bejelentkezés dátuma
     * @param checkOutDate A kijelentkezés dátuma
     * @return A szobák összesített költsége
     */
    public static double calculateRoomsCost(List<Room> rooms, LocalDate checkInDate, LocalDate checkOutDate) {
        if (rooms == null || rooms.isEmpty()) {
            return 0.0;
        }

        if (checkInDate == null || checkOutDate == null) {
            return 0.0;
        }

        long days = checkOutDate.toEpochDay() - checkInDate.toEpochDay();

        if (days <= 0) {
            return 0.0;
        }

        double totalCost = 0.0;
        for (Room room : rooms) {
            if (room.getRoomType() != null) {
                totalCost += room.getRoomType().getPrice() * days;
            }
        }

        return totalCost;
    }
}
