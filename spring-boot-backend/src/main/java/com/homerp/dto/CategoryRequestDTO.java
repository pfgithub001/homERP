package com.homerp.dto;

import com.homerp.entity.TransactionType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoryRequestDTO {

    @NotBlank(message = "Name is required")
    private String name;

    @NotNull(message = "Type is required")
    private TransactionType type;

    private String color;
}