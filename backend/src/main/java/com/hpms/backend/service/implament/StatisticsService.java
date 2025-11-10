package com.hpms.backend.service.implament;

import com.hpms.backend.dto.BookingStatsDto;
import com.hpms.backend.dto.GuestStatsDto;
import com.hpms.backend.dto.HousekeepingStatsDto;
import com.hpms.backend.dto.IncomeStatsDto;
import com.hpms.backend.dto.OccupancyStatsDto;
import com.hpms.backend.dto.RoomAvailabilityStatsDto;
import com.hpms.backend.enumCollection.BookingStatusEnum;
import com.hpms.backend.enumCollection.FrontEndCodes;
import com.hpms.backend.enumCollection.GuestTypeEnum;
import com.hpms.backend.enumCollection.RoomStatusEnum;
import com.hpms.backend.model.Booking;
import com.hpms.backend.model.Guest;
import com.hpms.backend.model.Invoice;
import com.hpms.backend.model.Room;
import com.hpms.backend.repository.BookingRepository;
import com.hpms.backend.repository.InvoiceRepository;
import com.hpms.backend.repository.RoomRepository;
import com.hpms.backend.service.inter.IStatisticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StatisticsService implements IStatisticsService {
    private final BookingRepository bookingRepository;
    private final RoomRepository roomRepository;
    private final InvoiceRepository invoiceRepository;


    @Override
    public BookingStatsDto getBookingStats() {
        LocalDate today = LocalDate.now();

        List<Booking> activeBookings = bookingRepository.findActiveBookingsForDate(today);

        Map<BookingStatusEnum, Long> countByStatus = activeBookings.stream()
                .collect(Collectors.groupingBy(Booking::getStatus, Collectors.counting()));

        BookingStatsDto stats = new BookingStatsDto();
        stats.setTotalNumberOfBookings(activeBookings.size());
        stats.setCountByStatus(countByStatus);
        stats.setDate(today);

        return stats;
    }

    @Override
    public GuestStatsDto getGuestStats() {
        LocalDate today = LocalDate.now();

        List<Booking> activeBookings = bookingRepository.findActiveBookingsForDate(today);

        List<Guest> guests = activeBookings.stream()
                .flatMap(booking -> booking.getGuests().stream())
                .distinct()
                .toList();


        long totalAdults = guests.stream()
                .filter(guest -> guest.getType() == GuestTypeEnum.ADULT)
                .count();
        long totalChildren = guests.stream()
                .filter(guest -> guest.getType() == GuestTypeEnum.CHILD)
                .count();

        Map<String, GuestStatsDto.CountryGuestStats> guestsByCountry = guests.stream()
                .collect(Collectors.groupingBy(
                        guest -> guest.getHomeCountry() != null ? guest.getHomeCountry() : "Unknown",
                        Collectors.collectingAndThen(
                                Collectors.toList(),
                                guestList -> {
                                    long adults = guestList.stream()
                                            .filter(g -> g.getType() == GuestTypeEnum.ADULT)
                                            .count();
                                    long children = guestList.stream()
                                            .filter(g -> g.getType() == GuestTypeEnum.CHILD)
                                            .count();
                                    return new GuestStatsDto.CountryGuestStats(
                                            guestList.size(),
                                            adults,
                                            children
                                    );
                                }
                        )
                ));

        GuestStatsDto stats = new GuestStatsDto();
        stats.setTotalGuests(guests.size());
        stats.setTotalAdults(totalAdults);
        stats.setTotalChildren(totalChildren);
        stats.setGuestsByCountry(guestsByCountry);
        stats.setDate(today);

        return stats;
    }

    @Override
    public HousekeepingStatsDto getHousekeepingStats() {
        LocalDate today = LocalDate.now();

        List<Room> allRooms = roomRepository.findAll();

        Map<RoomStatusEnum, Long> countByStatus = allRooms.stream()
                .collect(Collectors.groupingBy(Room::getStatus, Collectors.counting()));

        long cleanRooms = countByStatus.getOrDefault(RoomStatusEnum.CLEAN, 0L);
        long dirtyRooms = countByStatus.getOrDefault(RoomStatusEnum.DIRTY, 0L);
        long outOfServiceRooms = countByStatus.getOrDefault(RoomStatusEnum.OUT_OF_SERVICE, 0L);

        HousekeepingStatsDto stats = new HousekeepingStatsDto();
        stats.setTotalRooms(allRooms.size());
        stats.setCleanRooms(cleanRooms);
        stats.setDirtyRooms(dirtyRooms);
        stats.setOutOfServiceRooms(outOfServiceRooms);
        stats.setDate(today);

        return stats;
    }

    @Override
    public IncomeStatsDto getIncomeStats(LocalDate startDate, LocalDate endDate) {
        if (startDate == null || endDate == null) {
            throw new IllegalArgumentException(FrontEndCodes.DATE_RANGE_INVALID.getCode());
        }
        if (startDate.isAfter(endDate)) {
            throw new IllegalArgumentException(FrontEndCodes.DATE_RANGE_INVALID.getCode());
        }

        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = endDate.atTime(23, 59, 59);

        List<Invoice> fulfilledInvoices = invoiceRepository.findByPaymentFulfilledAtBetween(startDateTime, endDateTime);

        Map<LocalDate, List<Invoice>> invoicesByDate = fulfilledInvoices.stream()
                .collect(Collectors.groupingBy(
                        invoice -> invoice.getPaymentFulfilledAt().toLocalDate(),
                        LinkedHashMap::new,
                        Collectors.toList()
                ));

     
        Map<LocalDate, IncomeStatsDto.DailyIncomeStats> dailyStats = new LinkedHashMap<>();

       
        LocalDate currentDate = startDate;
        while (!currentDate.isAfter(endDate)) {
            List<Invoice> dayInvoices = invoicesByDate.getOrDefault(currentDate, List.of());

            double totalSum = dayInvoices.stream()
                    .mapToDouble(invoice -> invoice.getTotalSum() != null ? invoice.getTotalSum() : 0.0)
                    .sum();

            List<Long> invoiceIds = dayInvoices.stream()
                    .map(Invoice::getId)
                    .collect(Collectors.toList());

            dailyStats.put(currentDate, new IncomeStatsDto.DailyIncomeStats(
                    totalSum,
                    dayInvoices.size(),
                    invoiceIds
            ));

            currentDate = currentDate.plusDays(1);
        }

        return new IncomeStatsDto(startDate, endDate, dailyStats);
    }

    @Override
    public OccupancyStatsDto getOccupancyStats(LocalDate startDate, LocalDate endDate) {
        if (startDate == null || endDate == null) {
            throw new IllegalArgumentException(FrontEndCodes.DATE_RANGE_INVALID.getCode());
        }
        if (startDate.isAfter(endDate)) {
            throw new IllegalArgumentException(FrontEndCodes.DATE_RANGE_INVALID.getCode());
        }

        List<Room> allRooms = roomRepository.findAll();
        int maxCapacity = allRooms.stream()
                .mapToInt(room -> room.getRoomType().getCapacity())
                .sum();

        Map<LocalDate, OccupancyStatsDto.DailyOccupancyStats> dailyStats = new LinkedHashMap<>();

        LocalDate currentDate = startDate;
        while (!currentDate.isAfter(endDate)) {
            LocalDate date = currentDate;

            List<Booking> activeBookings = bookingRepository.findActiveBookingsForDate(date);

            int occupied = activeBookings.stream()
                    .flatMap(booking -> booking.getRooms().stream())
                    .distinct()
                    .mapToInt(room -> room.getRoomType().getCapacity())
                    .sum();

            int available = maxCapacity - occupied;
            double occupancyRate = maxCapacity > 0 ? (double) occupied / maxCapacity * 100 : 0.0;

            dailyStats.put(currentDate, new OccupancyStatsDto.DailyOccupancyStats(
                    occupied,
                    available,
                    occupancyRate
            ));

            currentDate = currentDate.plusDays(1);
        }

        return new OccupancyStatsDto(startDate, endDate, maxCapacity, dailyStats);
    }

    @Override
    public RoomAvailabilityStatsDto getRoomAvailabilityStats() {
        LocalDate today = LocalDate.now();

        List<Room> allRooms = roomRepository.findAll();

        List<Booking> activeBookings = bookingRepository.findActiveBookingsForDate(today);


        List<Room> reservedRooms = activeBookings.stream()
                .flatMap(booking -> booking.getRooms().stream())
                .distinct()
                .toList();


        Map<String, RoomAvailabilityStatsDto.RoomTypeAvailability> availabilityByRoomType = allRooms.stream()
                .collect(Collectors.groupingBy(
                        room -> room.getRoomType().getTypeName(),
                        Collectors.collectingAndThen(
                                Collectors.toList(),
                                rooms -> {
                                    int totalRooms = rooms.size();

                                    long available = rooms.stream()
                                            .filter(room -> room.getStatus() == RoomStatusEnum.CLEAN)
                                            .filter(room -> !reservedRooms.contains(room))
                                            .count();


                                    long reserved = rooms.stream()
                                            .filter(reservedRooms::contains)
                                            .count();

                                    long unavailable = rooms.stream()
                                            .filter(room -> room.getStatus() == RoomStatusEnum.DIRTY ||
                                                    room.getStatus() == RoomStatusEnum.OUT_OF_SERVICE)
                                            .filter(room -> !reservedRooms.contains(room))
                                            .count();

                                    return new RoomAvailabilityStatsDto.RoomTypeAvailability(
                                            totalRooms,
                                            (int) available,
                                            (int) reserved,
                                            (int) unavailable
                                    );
                                }
                        )
                ));

        return new RoomAvailabilityStatsDto(today, availabilityByRoomType);
    }
}
