package com.hpms.backend.dto;

import com.hpms.backend.enumCollection.BookingStatusEnum;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingStatsDto {
   private long totalNumberOfBookings;
   private Map<BookingStatusEnum, Long> countByStatus;
   private LocalDate date;
}
