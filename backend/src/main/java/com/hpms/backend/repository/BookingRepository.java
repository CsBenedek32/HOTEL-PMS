package com.hpms.backend.repository;

import com.hpms.backend.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByInvoiceIdAndActive(Long targetId, boolean b);

    @Query("SELECT b FROM Booking b WHERE b.active = true AND b.checkInDate <= :date AND b.checkOutDate >= :date")
    List<Booking> findActiveBookingsForDate(@Param("date") LocalDate date);
}