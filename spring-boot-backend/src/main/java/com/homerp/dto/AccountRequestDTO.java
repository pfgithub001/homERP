package com.homerp.dto;

import com.homerp.entity.Account;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AccountRequestDTO {

    @NotBlank(message = "Name is required")
    private String name;

    private BigDecimal balance;

    private String currency;

    private Account.AccountType type;
}