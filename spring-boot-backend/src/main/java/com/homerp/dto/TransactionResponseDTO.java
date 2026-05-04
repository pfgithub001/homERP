package com.homerp.dto;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransactionResponseDTO {
    private Long id;
    private String concept;
    private BigDecimal amount;
    private String type;
    private LocalDate date;
    private String notes;
    private Long accountId;
    private String accountName;
    private Long categoryId;
    private String categoryName;
    private LocalDateTime createdAt;
}