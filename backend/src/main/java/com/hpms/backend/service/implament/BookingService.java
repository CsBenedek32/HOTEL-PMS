package com.hpms.backend.service.implament;

import com.hpms.backend.dto.BookingDto;
import com.hpms.backend.enumCollection.BookingInvoiceEnum;
import com.hpms.backend.enumCollection.BookingStatusEnum;
import com.hpms.backend.enumCollection.FrontEndCodes;
import com.hpms.backend.enumCollection.RoomStatusEnum;
import com.hpms.backend.exception.ResourceNotFoundException;
import com.hpms.backend.filter.BookingFilter;
import com.hpms.backend.model.Booking;
import com.hpms.backend.model.Guest;
import com.hpms.backend.model.Room;
import com.hpms.backend.repository.BookingRepository;
import com.hpms.backend.repository.GuestRepository;
import com.hpms.backend.repository.RoomRepository;
import com.hpms.backend.request.CreateBookingRequest;
import com.hpms.backend.request.UpdateBookingRequest;
import com.hpms.backend.service.inter.IBookingService;
import com.hpms.backend.util.BookingConflictUtil;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.function.Predicate;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class BookingService implements IBookingService {
    private final BookingRepository bookingRepository;
    private final GuestRepository guestRepository;
    private final RoomRepository roomRepository;
    private final ModelMapper modelMapper;

    /**
     * Lekérdezi a foglalásokat opcionális szűrőkkel.
     * @param filters Szűrési feltételek (null esetén minden foglalást visszaad)
     * @return A szűrt foglalások listája
     */
    @Transactional(readOnly = true)
    @Override
    public List<Booking> getBookings(BookingFilter filters) {
        if (filters == null) {
            return bookingRepository.findAll();
        }

        return bookingRepository.findAll().stream()
                .filter(buildBookingPredicate(filters))
                .collect(Collectors.toList());
    }

    /**
     * Új foglalás létrehozása.
     * Ellenőrzi a szobák elérhetőségét és a vendégek létezését.
     * Ha nincs szoba megadva, a foglalás WAITLISTED státuszba kerül.
     * @param request A létrehozási kérés adatai
     * @return A létrehozott foglalás
     * @throws ResourceNotFoundException ha a szobák vagy vendégek nem találhatók
     * @throws IllegalStateException ha a szobák nem elérhetők az adott időszakban
     */
    @Override
    public Booking createBooking(CreateBookingRequest request) {
        Booking booking = new Booking();

        // Szobák validálása és hozzárendelése
        if (request.getRoomIds() != null && !request.getRoomIds().isEmpty()) {
            List<Room> rooms = roomRepository.findAllByIdWithBookings(request.getRoomIds());
            if (rooms.size() != request.getRoomIds().size()) {
                throw new ResourceNotFoundException(FrontEndCodes.BOOKING_ROOMS_NOT_FOUND.getCode());
            }

            // Ellenőrizzük, hogy a szobák elérhetők-e az adott időszakban
            if (!BookingConflictUtil.areRoomsAvailable(rooms, request.getCheckInDate(), request.getCheckOutDate())) {
                throw new IllegalStateException(FrontEndCodes.BOOKING_ROOM_UNAVAILABLE.getCode());
            }

            booking.setRooms(new HashSet<>(rooms));
            booking.setStatus(BookingStatusEnum.RESERVED);
        } else {
            // Szoba nélküli foglalás várólistára kerül
            booking.setStatus(BookingStatusEnum.WAITLISTED);
        }

        // Alapadatok beállítása
        booking.setCheckInDate(request.getCheckInDate());
        booking.setCheckOutDate(request.getCheckOutDate());
        booking.setName(request.getName());
        booking.setDescription(request.getDescription());
        booking.setActive(true);
        booking.setScynStatus(BookingInvoiceEnum.NO_INVOICE);

        // Vendégek hozzárendelése
        if (request.getGuestIds() != null && !request.getGuestIds().isEmpty()) {
            List<Guest> guests = guestRepository.findAllById(request.getGuestIds());
            if (guests.size() != request.getGuestIds().size()) {
                throw new ResourceNotFoundException(FrontEndCodes.BOOKING_GUESTS_NOT_FOUND.getCode());
            }
            booking.setGuests(new HashSet<>(guests));
        }

        return bookingRepository.save(booking);
    }

    /**
     * Meglévő foglalás módosítása.
     * Validálja a státuszváltást, szoba ütközéseket, és kezeli a számla szinkronizációt.
     * @param request A módosítási kérés adatai
     * @param targetId A módosítandó foglalás ID-ja
     * @return A módosított foglalás
     * @throws ResourceNotFoundException ha a foglalás nem található
     * @throws IllegalStateException ha érvénytelen státuszváltás vagy szoba ütközés van
     */
    @Override
    public Booking updateBooking(UpdateBookingRequest request, long targetId) {
        Booking existingBooking = bookingRepository.findById(targetId)
                .orElseThrow(() -> new ResourceNotFoundException(FrontEndCodes.BOOKING_NOT_FOUND.getCode()));

        // Validációk
        validateStatusChange(existingBooking, request.getStatus());
        if (request.getStatus() != BookingStatusEnum.WAITLISTED) {
            validateRoomConflicts(request, targetId);
        }

        // Változások detektálása a számla szinkronizációhoz
        boolean datesChanged = areDatesChanging(existingBooking, request);
        boolean roomsChanged = areRoomsChanging(existingBooking, request);

        // Foglalás frissítése
        updateBasicFields(existingBooking, request);
        roomsChanged = updateRoomsAndStatus(existingBooking, request, roomsChanged);
        updateGuests(existingBooking, request);

        // Ha dátum vagy szoba változott, és van számla, jelöljük szinkronizálandónak
        handleInvoiceSync(existingBooking, datesChanged, roomsChanged);

        if (request.getStatus() != null) {
            existingBooking.setStatus(request.getStatus());
        }

        return bookingRepository.save(existingBooking);
    }

    /**
     * Ellenőrzi, hogy a státuszváltás engedélyezett-e.
     */
    private void validateStatusChange(Booking existingBooking, BookingStatusEnum newStatus) {
        if (newStatus != null && !canSetStatus(existingBooking, newStatus)) {
            throw new IllegalStateException(FrontEndCodes.BOOKING_INVALID_STATUS.getCode());
        }
    }

    /**
     * Ellenőrzi, hogy nincs-e szoba ütközés a módosítás után.
     * Kihagyja az aktuális foglalást az ütközés-ellenőrzésből.
     */
    private void validateRoomConflicts(UpdateBookingRequest request, long targetId) {
        List<Long> newRoomIds = request.getRoomIds() != null ? request.getRoomIds() : List.of();
        LocalDate newCheckInDate = request.getCheckInDate();
        LocalDate newCheckOutDate = request.getCheckOutDate();

        if (!newRoomIds.isEmpty() && newCheckInDate != null && newCheckOutDate != null) {
            List<Room> newRooms = roomRepository.findAllByIdWithBookings(newRoomIds);
            if (newRooms.size() != newRoomIds.size()) {
                throw new ResourceNotFoundException(FrontEndCodes.BOOKING_ROOMS_NOT_FOUND.getCode());
            }
            // Az aktuális foglalást kihagyjuk az ütközés-ellenőrzésből (targetId)
            if (!BookingConflictUtil.areRoomsAvailable(newRooms, newCheckInDate, newCheckOutDate, targetId)) {
                throw new IllegalStateException(FrontEndCodes.BOOKING_ROOM_UNAVAILABLE.getCode());
            }
        }
    }

    /**
     * Ellenőrzi, hogy változtak-e a dátumok.
     */
    private boolean areDatesChanging(Booking existingBooking, UpdateBookingRequest request) {
        return !existingBooking.getCheckInDate().equals(request.getCheckInDate()) ||
                !existingBooking.getCheckOutDate().equals(request.getCheckOutDate());
    }

    /**
     * Ellenőrzi, hogy változtak-e a szobák.
     */
    private boolean areRoomsChanging(Booking existingBooking, UpdateBookingRequest request) {
        Set<Long> currentRoomIds = existingBooking.getRooms().stream()
                .map(Room::getId)
                .collect(Collectors.toSet());
        Set<Long> newRoomIds = request.getRoomIds() != null ?
                new HashSet<>(request.getRoomIds()) : new HashSet<>();
        return !currentRoomIds.equals(newRoomIds);
    }

    /**
     * Frissíti az alapmezőket (dátumok, név, leírás).
     */
    private void updateBasicFields(Booking existingBooking, UpdateBookingRequest request) {
        existingBooking.setCheckInDate(request.getCheckInDate());
        existingBooking.setCheckOutDate(request.getCheckOutDate());
        existingBooking.setName(request.getName());
        existingBooking.setDescription(request.getDescription());
    }

    /**
     * Frissíti a szobákat és a státuszt a kérés alapján.
     * @return true ha a szobák változtak
     */
    private boolean updateRoomsAndStatus(Booking existingBooking, UpdateBookingRequest request, boolean roomsChanged) {
        if (request.getStatus() == BookingStatusEnum.WAITLISTED) {
            return handleWaitlistedStatus(existingBooking, roomsChanged);
        } else if (request.getRoomIds() == null || request.getRoomIds().isEmpty()) {
            return handleEmptyRooms(existingBooking);
        } else {
            return handleRoomAssignment(existingBooking, request);
        }
    }

    /**
     * Kezeli a WAITLISTED státuszba váltást - törli a szobákat.
     */
    private boolean handleWaitlistedStatus(Booking existingBooking, boolean roomsChanged) {
        if (!existingBooking.getRooms().isEmpty()) {
            roomsChanged = true;
        }
        existingBooking.setRooms(new HashSet<>());
        return roomsChanged;
    }

    /**
     * Kezeli az üres szobalistát - WAITLISTED státuszba állítja a foglalást.
     */
    private boolean handleEmptyRooms(Booking existingBooking) {
        existingBooking.setRooms(new HashSet<>());
        existingBooking.setStatus(BookingStatusEnum.WAITLISTED);
        return true;
    }

    /**
     * Hozzárendeli az új szobákat és szükség esetén RESERVED státuszba állít.
     */
    private boolean handleRoomAssignment(Booking existingBooking, UpdateBookingRequest request) {
        List<Room> rooms = roomRepository.findAllById(request.getRoomIds());
        existingBooking.setRooms(new HashSet<>(rooms));
        // Ha várólistán volt, átállítjuk foglaltra
        if (existingBooking.getStatus() == BookingStatusEnum.WAITLISTED) {
            existingBooking.setStatus(BookingStatusEnum.RESERVED);
        }
        return true;
    }

    /**
     * Frissíti a vendéglistát.
     */
    private void updateGuests(Booking existingBooking, UpdateBookingRequest request) {
        if (request.getGuestIds() == null || request.getGuestIds().isEmpty()) {
            existingBooking.setGuests(new HashSet<>());
        } else {
            List<Guest> guests = guestRepository.findAllById(request.getGuestIds());
            if (guests.size() != request.getGuestIds().size()) {
                throw new ResourceNotFoundException(FrontEndCodes.BOOKING_GUESTS_NOT_FOUND.getCode());
            }
            existingBooking.setGuests(new HashSet<>(guests));
        }
    }

    /**
     * Kezeli a számla szinkronizáció státuszát.
     * Ha dátum vagy szoba változott és van számla, jelöljük NOT_SYNCED-ként.
     */
    private void handleInvoiceSync(Booking existingBooking, boolean datesChanged, boolean roomsChanged) {
        if ((datesChanged || roomsChanged) && existingBooking.getInvoice() != null) {
            existingBooking.setScynStatus(BookingInvoiceEnum.NOT_SYNCED);
        }
    }

    /**
     * Foglalás státuszának frissítése.
     * Kijelentkezéskor (CHECKED_OUT) a szobákat DIRTY státuszba állítja.
     * @param targetId A foglalás ID-ja
     * @param newStatus Az új státusz
     * @return A frissített foglalás
     * @throws ResourceNotFoundException ha a foglalás nem található
     * @throws IllegalStateException ha a státuszváltás nem engedélyezett
     */
    @Override
    public Booking updateBookingStatus(long targetId, BookingStatusEnum newStatus) {
        Booking existingBooking = bookingRepository.findById(targetId)
                .orElseThrow(() -> new ResourceNotFoundException(FrontEndCodes.BOOKING_NOT_FOUND.getCode()));

        if (!canSetStatus(existingBooking, newStatus)) {
            throw new IllegalStateException(FrontEndCodes.BOOKING_INVALID_STATUS.getCode());
        }

        // Kijelentkezéskor a szobákat piszkosnak jelöljük
        if(newStatus == BookingStatusEnum.CHECKED_OUT){
            existingBooking.getRooms().forEach(room -> {
                room.setStatus(RoomStatusEnum.DIRTY);
                roomRepository.save(room);
            });
        }

        existingBooking.setStatus(newStatus);
        return bookingRepository.save(existingBooking);
    }

    /**
     * Ellenőrzi, hogy a foglalás státusza beállítható-e az új értékre.
     * Szabályok:
     * - BLOCKED státuszba nem lehet állítani
     * - WAITLISTED-be bármikor lehet
     * - Negatív státuszból (CANCELLED, NO_SHOW, CHECKED_OUT) pozitívba (RESERVED, CHECKED_IN)
     *   csak akkor lehet, ha a szobák elérhetők
     * @param booking A foglalás
     * @param newStatus Az új státusz
     * @return true ha a státuszváltás engedélyezett
     */
    @Override
    public Boolean canSetStatus(Booking booking, BookingStatusEnum newStatus) {
        BookingStatusEnum currentStatus = booking.getStatus();
        if (currentStatus == newStatus) {
            return true;
        }
        // BLOCKED státuszba nem lehet manuálisan állítani
        if (newStatus == BookingStatusEnum.BLOCKED) {
            return false;
        }
        // WAITLISTED-be bármikor lehet
        if (newStatus == BookingStatusEnum.WAITLISTED) {
            return true;
        }

        // Negatív és pozitív státuszok definiálása
        List<BookingStatusEnum> negativeStatuses = List.of(
                BookingStatusEnum.CANCELLED,
                BookingStatusEnum.NO_SHOW,
                BookingStatusEnum.CHECKED_OUT
        );
        List<BookingStatusEnum> positiveStatuses = List.of(
                BookingStatusEnum.RESERVED,
                BookingStatusEnum.CHECKED_IN
        );

        boolean currentIsNegative = negativeStatuses.contains(currentStatus);
        boolean newIsPositive = positiveStatuses.contains(newStatus);

        // Negatívból pozitívba csak akkor lehet, ha a szobák elérhetők
        if (currentIsNegative && newIsPositive) {
            return areRoomsAvailableForBooking(booking);
        }

        return true;
    }

    /**
     * Ellenőrzi, hogy a foglalás szobái elérhetők-e.
     */
    private boolean areRoomsAvailableForBooking(Booking booking) {
        return BookingConflictUtil.areRoomsAvailable(
                booking.getRooms(),
                booking.getCheckInDate(),
                booking.getCheckOutDate(),
                booking.getId()
        );
    }

    /**
     * Foglalás törlése (soft delete).
     * Nem törli fizikailag, csak inaktívra állítja.
     * @param targetId A törlendő foglalás ID-ja
     * @throws ResourceNotFoundException ha a foglalás nem található
     */
    @Override
    public void deleteBooking(long targetId) {
        bookingRepository.findById(targetId).ifPresentOrElse(
                booking -> {
                    booking.setActive(false);
                    bookingRepository.save(booking);
                },
                () -> {
                    throw new ResourceNotFoundException(FrontEndCodes.BOOKING_NOT_FOUND.getCode());
                }
        );
    }

    /**
     * Foglalás entitás konvertálása DTO-vá.
     * @param booking A foglalás entitás
     * @return A foglalás DTO
     */
    @Override
    @Transactional(readOnly = true)
    public BookingDto convertBookingToDto(Booking booking) {
        BookingDto bookingDto = modelMapper.map(booking, BookingDto.class);

        if (booking.getInvoice() != null) {
            bookingDto.setInvoiceId(booking.getInvoice().getId());
        }

        return bookingDto;
    }

    /**
     * Szűrési predikátum építése a foglalásokhoz.
     * @param filters A szűrési feltételek
     * @return A szűrési predikátum
     */
    @Override
    public Predicate<Booking> buildBookingPredicate(BookingFilter filters) {
        Predicate<Booking> predicate = booking -> true;

        if (filters.getId() != null) {
            predicate = predicate.and(booking -> booking.getId() == filters.getId());
        }

        if (filters.getName() != null && !filters.getName().isEmpty()) {
            predicate = predicate.and(booking ->
                    booking.getName().toLowerCase().contains(filters.getName().toLowerCase()));
        }

        if (filters.getStatuses() != null && !filters.getStatuses().isEmpty()) {
            predicate = predicate.and(booking -> filters.getStatuses().contains(booking.getStatus()));
        }

        if (filters.getScynStatuses() != null && !filters.getScynStatuses().isEmpty()) {
            predicate = predicate.and(booking -> filters.getScynStatuses().contains(booking.getScynStatus()));
        }

        if (filters.getCheckInDateFrom() != null) {
            predicate = predicate.and(booking -> !booking.getCheckInDate().isBefore(filters.getCheckInDateFrom()));
        }

        if (filters.getCheckInDateTo() != null) {
            predicate = predicate.and(booking -> !booking.getCheckInDate().isAfter(filters.getCheckInDateTo()));
        }

        if (filters.getCheckOutDateFrom() != null) {
            predicate = predicate.and(booking -> !booking.getCheckOutDate().isBefore(filters.getCheckOutDateFrom()));
        }

        if (filters.getCheckOutDateTo() != null) {
            predicate = predicate.and(booking -> !booking.getCheckOutDate().isAfter(filters.getCheckOutDateTo()));
        }

        if (filters.getActive() != null) {
            predicate = predicate.and(booking -> booking.isActive() == filters.getActive());
        }

        if (filters.getGuestIds() != null && !filters.getGuestIds().isEmpty()) {
            predicate = predicate.and(booking ->
                    booking.getGuests().stream()
                            .anyMatch(guest -> filters.getGuestIds().contains(guest.getId())));
        }

        if (filters.getRoomIds() != null && !filters.getRoomIds().isEmpty()) {
            predicate = predicate.and(booking ->
                    booking.getRooms().stream()
                            .anyMatch(room -> filters.getRoomIds().contains(room.getId())));
        }

        if (filters.getInvoiceIds() != null && !filters.getInvoiceIds().isEmpty()) {
            predicate = predicate.and(booking ->
                    booking.getInvoice() != null && filters.getInvoiceIds().contains(booking.getInvoice().getId()));
        }

        return predicate;
    }
}