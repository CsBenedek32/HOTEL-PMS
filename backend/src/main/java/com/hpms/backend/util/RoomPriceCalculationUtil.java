package com.hpms.backend.util;

import com.hpms.backend.model.Room;

import java.time.LocalDate;
import java.util.List;

public class RoomPriceCalculationUtil {

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
