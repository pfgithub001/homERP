package com.homerp.dto;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransactionSummaryDTO {
    private LocalDate startDate;
    private LocalDate endDate;
    private BigDecimal totalInflows;
    private BigDecimal totalOutflows;
    private BigDecimal netBalance;
}