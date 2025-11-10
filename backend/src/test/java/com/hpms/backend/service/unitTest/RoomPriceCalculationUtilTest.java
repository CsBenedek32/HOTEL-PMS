package com.hpms.backend.service.unitTest;

import com.hpms.backend.model.Room;
import com.hpms.backend.model.RoomType;
import com.hpms.backend.util.RoomPriceCalculationUtil;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

public class RoomPriceCalculationUtilTest {

    @Test
    public void testCalculateRoomsCost_NullRoomList_ShouldReturnZero() {
        LocalDate checkIn = LocalDate.of(2025, 1, 10);
        LocalDate checkOut = LocalDate.of(2025, 1, 15);

        double result = RoomPriceCalculationUtil.calculateRoomsCost(null, checkIn, checkOut);

        assertEquals(0.0, result, 0.001);
    }

    @Test
    public void testCalculateRoomsCost_EmptyRoomList_ShouldReturnZero() {
        List<Room> rooms = new ArrayList<>();
        LocalDate checkIn = LocalDate.of(2025, 1, 10);
        LocalDate checkOut = LocalDate.of(2025, 1, 15);

        double result = RoomPriceCalculationUtil.calculateRoomsCost(rooms, checkIn, checkOut);

        assertEquals(0.0, result, 0.001);
    }

    @Test
    public void testCalculateRoomsCost_NullCheckInDate_ShouldReturnZero() {
        Room room = createRoom(100.0);
        List<Room> rooms = List.of(room);
        LocalDate checkOut = LocalDate.of(2025, 1, 15);

        double result = RoomPriceCalculationUtil.calculateRoomsCost(rooms, null, checkOut);

        assertEquals(0.0, result, 0.001);
    }

    @Test
    public void testCalculateRoomsCost_NullCheckOutDate_ShouldReturnZero() {
        Room room = createRoom(100.0);
        List<Room> rooms = List.of(room);
        LocalDate checkIn = LocalDate.of(2025, 1, 10);

        double result = RoomPriceCalculationUtil.calculateRoomsCost(rooms, checkIn, null);

        assertEquals(0.0, result, 0.001);
    }

    @Test
    public void testCalculateRoomsCost_CheckOutBeforeCheckIn_ShouldReturnZero() {
        Room room = createRoom(100.0);
        List<Room> rooms = List.of(room);
        LocalDate checkIn = LocalDate.of(2025, 1, 15);
        LocalDate checkOut = LocalDate.of(2025, 1, 10);

        double result = RoomPriceCalculationUtil.calculateRoomsCost(rooms, checkIn, checkOut);

        assertEquals(0.0, result, 0.001);
    }

    @Test
    public void testCalculateRoomsCost_SameDayCheckInCheckOut_ShouldReturnZero() {
        Room room = createRoom(100.0);
        List<Room> rooms = List.of(room);
        LocalDate date = LocalDate.of(2025, 1, 10);

        double result = RoomPriceCalculationUtil.calculateRoomsCost(rooms, date, date);

        assertEquals(0.0, result, 0.001);
    }

    @Test
    public void testCalculateRoomsCost_SingleRoom_ShouldCalculateCorrectly() {
        Room room = createRoom(100.0);
        List<Room> rooms = List.of(room);
        LocalDate checkIn = LocalDate.of(2025, 1, 10);
        LocalDate checkOut = LocalDate.of(2025, 1, 15);

        double result = RoomPriceCalculationUtil.calculateRoomsCost(rooms, checkIn, checkOut);

        assertEquals(500.0, result, 0.001);
    }

    @Test
    public void testCalculateRoomsCost_MultipleRoomsSamePrice_ShouldCalculateCorrectly() {
        Room room1 = createRoom(100.0);
        Room room2 = createRoom(100.0);
        List<Room> rooms = List.of(room1, room2);
        LocalDate checkIn = LocalDate.of(2025, 1, 10);
        LocalDate checkOut = LocalDate.of(2025, 1, 15);

        double result = RoomPriceCalculationUtil.calculateRoomsCost(rooms, checkIn, checkOut);

        assertEquals(1000.0, result, 0.001);
    }

    @Test
    public void testCalculateRoomsCost_MultipleRoomsDifferentPrice_ShouldCalculateCorrectly() {
        Room room1 = createRoom(100.0);
        Room room2 = createRoom(150.0);
        Room room3 = createRoom(200.0);
        List<Room> rooms = List.of(room1, room2, room3);
        LocalDate checkIn = LocalDate.of(2025, 1, 10);
        LocalDate checkOut = LocalDate.of(2025, 1, 13);

        double result = RoomPriceCalculationUtil.calculateRoomsCost(rooms, checkIn, checkOut);

        double expected = (100.0 + 150.0 + 200.0) * 3;
        assertEquals(expected, result, 0.001);
    }

    @Test
    public void testCalculateRoomsCost_RoomWithNullRoomType_ShouldSkipRoom() {
        Room roomWithType = createRoom(100.0);
        Room roomWithoutType = new Room();
        roomWithoutType.setRoomType(null);

        List<Room> rooms = List.of(roomWithType, roomWithoutType);
        LocalDate checkIn = LocalDate.of(2025, 1, 10);
        LocalDate checkOut = LocalDate.of(2025, 1, 15);

        double result = RoomPriceCalculationUtil.calculateRoomsCost(rooms, checkIn, checkOut);

        assertEquals(500.0, result, 0.001);
    }

    @Test
    public void testCalculateRoomsCost_OneDayStay_ShouldCalculateCorrectly() {
        Room room = createRoom(100.0);
        List<Room> rooms = List.of(room);
        LocalDate checkIn = LocalDate.of(2025, 1, 10);
        LocalDate checkOut = LocalDate.of(2025, 1, 11);

        double result = RoomPriceCalculationUtil.calculateRoomsCost(rooms, checkIn, checkOut);

        assertEquals(100.0, result, 0.001);
    }

    private Room createRoom(double price) {
        RoomType roomType = new RoomType();
        roomType.setPrice(price);

        Room room = new Room();
        room.setRoomType(roomType);

        return room;
    }
}
