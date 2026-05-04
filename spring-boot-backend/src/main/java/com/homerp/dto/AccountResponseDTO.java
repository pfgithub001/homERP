package com.homerp.dto;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AccountResponseDTO {
    private Long id;
    private String name;
    private BigDecimal balance;
    private String currency;
    private String type;
    private LocalDateTime createdAt;
}