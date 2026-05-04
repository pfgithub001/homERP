package com.homerp.controller;

import com.homerp.dto.TransactionRequestDTO;
import com.homerp.dto.TransactionResponseDTO;
import com.homerp.dto.TransactionSummaryDTO;
import com.homerp.entity.Transaction;
import com.homerp.entity.TransactionType;
import com.homerp.service.TransactionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
@Tag(name = "Transactions", description = "Transaction management endpoints")
public class TransactionController {

    private final TransactionService transactionService;

    @GetMapping
    @Operation(summary = "Get all transactions")
    public ResponseEntity<List<TransactionResponseDTO>> findAll() {
        return ResponseEntity.ok(transactionService.findAll());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get transaction by ID")
    TransactionResponseDTO findById(@PathVariable Long id) {
        return transactionService.findById(id);
    }

    @GetMapping("/account/{accountId}")
    @Operation(summary = "Get transactions by account")
    public ResponseEntity<List<TransactionResponseDTO>> findByAccountId(@PathVariable Long accountId) {
        return ResponseEntity.ok(transactionService.findByAccountId(accountId));
    }

    @GetMapping("/category/{categoryId}")
    @Operation(summary = "Get transactions by category")
    public ResponseEntity<List<TransactionResponseDTO>> findByCategoryId(@PathVariable Long categoryId) {
        LocalDate today = LocalDate.now();
        return ResponseEntity.ok(transactionService.findByCategoryId(categoryId));
    }

    @GetMapping("/type/{type}")
    @Operation(summary = "Get transactions by type")
    public ResponseEntity<List<TransactionResponseDTO>> findByType(
            @PathVariable TransactionType type) {
        return ResponseEntity.ok(transactionService.findByType(type));
    }

    @GetMapping("/date-range")
    @Operation(summary = "Get transactions by date range")
    public ResponseEntity<List<TransactionResponseDTO>> findByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(transactionService.findByDateBetween(startDate, endDate));
    }

    @GetMapping("/summary")
    @Operation(summary = "Get transaction summary")
    public ResponseEntity<TransactionSummaryDTO> getSummary(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        LocalDate start = startDate != null ? startDate : LocalDate.now().withDayOfMonth(1);
        LocalDate end = endDate != null ? endDate : LocalDate.now();
        return ResponseEntity.ok(transactionService.getSummary(start, end));
    }

    @PostMapping
    @Operation(summary = "Create new transaction")
    public ResponseEntity<TransactionResponseDTO> create(@Valid @RequestBody TransactionRequestDTO request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(transactionService.create(request));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update transaction")
    public ResponseEntity<TransactionResponseDTO> update(
            @PathVariable Long id,
            @Valid @RequestBody TransactionRequestDTO request) {
        return ResponseEntity.ok(transactionService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete transaction")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        transactionService.delete(id);
        return ResponseEntity.noContent().build();
    }
}