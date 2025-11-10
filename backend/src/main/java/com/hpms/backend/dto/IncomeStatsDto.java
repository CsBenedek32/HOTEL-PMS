package com.hpms.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class IncomeStatsDto {
    private LocalDate startDate;
    private LocalDate endDate;
    private Map<LocalDate, DailyIncomeStats> dailyStats;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DailyIncomeStats {
        private double totalSum;
        private long numberOfInvoices;
        private List<Long> invoiceIds;
    }
}