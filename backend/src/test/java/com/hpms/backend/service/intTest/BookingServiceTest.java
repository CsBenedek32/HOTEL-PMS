package com.hpms.backend.service.intTest;

import com.hpms.backend.enumCollection.BookingStatusEnum;
import com.hpms.backend.enumCollection.RoomStatusEnum;
import com.hpms.backend.model.Booking;
import com.hpms.backend.model.Guest;
import com.hpms.backend.model.Room;
import com.hpms.backend.repository.BookingRepository;
import com.hpms.backend.repository.GuestRepository;
import com.hpms.backend.repository.RoomRepository;
import com.hpms.backend.request.CreateBookingRequest;
import com.hpms.backend.request.UpdateBookingRequest;
import com.hpms.backend.service.implament.BookingService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.modelmapper.ModelMapper;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class BookingServiceTest {

    @Mock
    private BookingRepository bookingRepository;

    @Mock
    private GuestRepository guestRepository;

    @Mock
    private RoomRepository roomRepository;

    @Mock
    private ModelMapper modelMapper;

    @InjectMocks
    private BookingService bookingService;

    private CreateBookingRequest createRequest;
    private Room room1;
    private Room room2;
    private Guest guest1;

    @BeforeEach
    public void setUp() {
        room1 = new Room();
        room1.setId(1L);
        room1.setBookings(new HashSet<>());

        room2 = new Room();
        room2.setId(2L);
        room2.setBookings(new HashSet<>());

        guest1 = new Guest();
        guest1.setId(1L);

        createRequest = new CreateBookingRequest();
        createRequest.setCheckInDate(LocalDate.of(2025, 1, 10));
        createRequest.setCheckOutDate(LocalDate.of(2025, 1, 15));
        createRequest.setName("Test Booking");
        createRequest.setDescription("Test Description");
        createRequest.setRoomIds(List.of(1L, 2L));
        createRequest.setGuestIds(List.of(1L));
    }

    @Test
    public void testCreateBooking_WithAvailableRooms_ShouldSucceed() {
        when(roomRepository.findAllByIdWithBookings(createRequest.getRoomIds()))
                .thenReturn(List.of(room1, room2));
        when(guestRepository.findAllById(createRequest.getGuestIds()))
                .thenReturn(List.of(guest1));
        when(bookingRepository.save(any(Booking.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        Booking result = bookingService.createBooking(createRequest);

        assertNotNull(result);
        assertEquals(BookingStatusEnum.RESERVED, result.getStatus());
        assertEquals(createRequest.getName(), result.getName());
        assertEquals(createRequest.getDescription(), result.getDescription());
        assertEquals(2, result.getRooms().size());
        assertEquals(1, result.getGuests().size());
        assertTrue(result.isActive());

        verify(roomRepository, times(1)).findAllByIdWithBookings(createRequest.getRoomIds());
        verify(guestRepository, times(1)).findAllById(createRequest.getGuestIds());
        verify(bookingRepository, times(1)).save(any(Booking.class));
    }

    @Test
    public void testCreateBooking_WithoutRooms_ShouldCreateWaitlisted() {
        createRequest.setRoomIds(null);
        when(guestRepository.findAllById(createRequest.getGuestIds()))
                .thenReturn(List.of(guest1));
        when(bookingRepository.save(any(Booking.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        Booking result = bookingService.createBooking(createRequest);

        assertNotNull(result);
        assertEquals(BookingStatusEnum.WAITLISTED, result.getStatus());
        assertTrue(result.getRooms().isEmpty());
        assertTrue(result.isActive());

        verify(roomRepository, never()).findAllByIdWithBookings(any());
        verify(bookingRepository, times(1)).save(any(Booking.class));
    }

    @Test
    public void testCreateBooking_WithConflictingRooms_ShouldThrowException() {
        Booking existingBooking = new Booking();
        existingBooking.setId(1L);
        existingBooking.setCheckInDate(LocalDate.of(2025, 1, 10));
        existingBooking.setCheckOutDate(LocalDate.of(2025, 1, 15));
        existingBooking.setStatus(BookingStatusEnum.RESERVED);
        existingBooking.setActive(true);

        room1.getBookings().add(existingBooking);

        when(roomRepository.findAllByIdWithBookings(createRequest.getRoomIds()))
                .thenReturn(List.of(room1, room2));

        assertThrows(IllegalStateException.class, () -> {
            bookingService.createBooking(createRequest);
        });

        verify(bookingRepository, never()).save(any(Booking.class));
    }

    @Test
    public void testUpdateBookingStatus_FromReservedToCheckedIn_ShouldSucceed() {
        Booking existingBooking = new Booking();
        existingBooking.setId(1L);
        existingBooking.setStatus(BookingStatusEnum.RESERVED);
        existingBooking.setCheckInDate(LocalDate.of(2025, 1, 10));
        existingBooking.setCheckOutDate(LocalDate.of(2025, 1, 15));
        existingBooking.setRooms(new HashSet<>(List.of(room1)));

        when(bookingRepository.findById(1L)).thenReturn(Optional.of(existingBooking));
        when(bookingRepository.save(any(Booking.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        Booking result = bookingService.updateBookingStatus(1L, BookingStatusEnum.CHECKED_IN);

        assertNotNull(result);
        assertEquals(BookingStatusEnum.CHECKED_IN, result.getStatus());

        verify(bookingRepository, times(1)).findById(1L);
        verify(bookingRepository, times(1)).save(existingBooking);
    }

    @Test
    public void testUpdateBookingStatus_FromCheckedInToCheckedOut_ShouldMarkRoomsDirty() {
        room1.setStatus(RoomStatusEnum.CLEAN);
        room2.setStatus(RoomStatusEnum.CLEAN);

        Booking existingBooking = new Booking();
        existingBooking.setId(1L);
        existingBooking.setStatus(BookingStatusEnum.CHECKED_IN);
        existingBooking.setCheckInDate(LocalDate.of(2025, 1, 10));
        existingBooking.setCheckOutDate(LocalDate.of(2025, 1, 15));
        existingBooking.setRooms(new HashSet<>(List.of(room1, room2)));

        when(bookingRepository.findById(1L)).thenReturn(Optional.of(existingBooking));
        when(bookingRepository.save(any(Booking.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));
        when(roomRepository.save(any(Room.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        Booking result = bookingService.updateBookingStatus(1L, BookingStatusEnum.CHECKED_OUT);

        assertNotNull(result);
        assertEquals(BookingStatusEnum.CHECKED_OUT, result.getStatus());
        assertEquals(RoomStatusEnum.DIRTY, room1.getStatus());
        assertEquals(RoomStatusEnum.DIRTY, room2.getStatus());

        verify(roomRepository, times(2)).save(any(Room.class));
        verify(bookingRepository, times(1)).save(existingBooking);
    }

    @Test
    public void testUpdateBookingStatus_FromCancelledToReserved_ShouldCheckAvailability() {
        Booking existingBooking = new Booking();
        existingBooking.setId(1L);
        existingBooking.setStatus(BookingStatusEnum.CANCELLED);
        existingBooking.setCheckInDate(LocalDate.of(2025, 1, 10));
        existingBooking.setCheckOutDate(LocalDate.of(2025, 1, 15));
        existingBooking.setRooms(new HashSet<>(List.of(room1)));

        when(bookingRepository.findById(1L)).thenReturn(Optional.of(existingBooking));
        when(bookingRepository.save(any(Booking.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        Booking result = bookingService.updateBookingStatus(1L, BookingStatusEnum.RESERVED);

        assertNotNull(result);
        assertEquals(BookingStatusEnum.RESERVED, result.getStatus());

        verify(bookingRepository, times(1)).save(existingBooking);
    }

    @Test
    public void testUpdateBooking_ChangeDates_ShouldUpdateSuccessfully() {
        Booking existingBooking = new Booking();
        existingBooking.setId(1L);
        existingBooking.setStatus(BookingStatusEnum.RESERVED);
        existingBooking.setCheckInDate(LocalDate.of(2025, 1, 10));
        existingBooking.setCheckOutDate(LocalDate.of(2025, 1, 15));
        existingBooking.setName("Old Name");
        existingBooking.setDescription("Old Description");
        existingBooking.setRooms(new HashSet<>(List.of(room1)));
        existingBooking.setGuests(new HashSet<>());

        UpdateBookingRequest updateRequest = new UpdateBookingRequest();
        updateRequest.setCheckInDate(LocalDate.of(2025, 1, 12));
        updateRequest.setCheckOutDate(LocalDate.of(2025, 1, 17));
        updateRequest.setName("New Name");
        updateRequest.setDescription("New Description");
        updateRequest.setRoomIds(List.of(1L));
        updateRequest.setGuestIds(List.of());

        when(bookingRepository.findById(1L)).thenReturn(Optional.of(existingBooking));
        when(roomRepository.findAllByIdWithBookings(updateRequest.getRoomIds()))
                .thenReturn(List.of(room1));
        when(bookingRepository.save(any(Booking.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        Booking result = bookingService.updateBooking(updateRequest, 1L);

        assertNotNull(result);
        assertEquals(LocalDate.of(2025, 1, 12), result.getCheckInDate());
        assertEquals(LocalDate.of(2025, 1, 17), result.getCheckOutDate());
        assertEquals("New Name", result.getName());
        assertEquals("New Description", result.getDescription());

        verify(bookingRepository, times(1)).save(existingBooking);
    }

    @Test
    public void testDeleteBooking_ShouldSetInactive() {
        Booking existingBooking = new Booking();
        existingBooking.setId(1L);
        existingBooking.setActive(true);

        when(bookingRepository.findById(1L)).thenReturn(Optional.of(existingBooking));
        when(bookingRepository.save(any(Booking.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        bookingService.deleteBooking(1L);

        assertFalse(existingBooking.isActive());
        verify(bookingRepository, times(1)).save(existingBooking);
    }

    @Test
    public void testUpdateBooking_ChangeRoomsToWaitlisted_ShouldClearRooms() {
        Booking existingBooking = new Booking();
        existingBooking.setId(1L);
        existingBooking.setStatus(BookingStatusEnum.RESERVED);
        existingBooking.setCheckInDate(LocalDate.of(2025, 1, 10));
        existingBooking.setCheckOutDate(LocalDate.of(2025, 1, 15));
        existingBooking.setName("Test");
        existingBooking.setDescription("Test");
        existingBooking.setRooms(new HashSet<>(List.of(room1, room2)));
        existingBooking.setGuests(new HashSet<>());

        UpdateBookingRequest updateRequest = new UpdateBookingRequest();
        updateRequest.setStatus(BookingStatusEnum.WAITLISTED);
        updateRequest.setCheckInDate(LocalDate.of(2025, 1, 10));
        updateRequest.setCheckOutDate(LocalDate.of(2025, 1, 15));
        updateRequest.setName("Test");
        updateRequest.setDescription("Test");
        updateRequest.setRoomIds(List.of());
        updateRequest.setGuestIds(List.of());

        when(bookingRepository.findById(1L)).thenReturn(Optional.of(existingBooking));
        when(bookingRepository.save(any(Booking.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        Booking result = bookingService.updateBooking(updateRequest, 1L);

        assertNotNull(result);
        assertEquals(BookingStatusEnum.WAITLISTED, result.getStatus());
        assertTrue(result.getRooms().isEmpty());

        verify(bookingRepository, times(1)).save(existingBooking);
    }
}
