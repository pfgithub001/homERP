package com.homerp.service;

import com.homerp.dto.TransactionRequestDTO;
import com.homerp.dto.TransactionResponseDTO;
import com.homerp.dto.TransactionSummaryDTO;
import com.homerp.entity.Account;
import com.homerp.entity.Category;
import com.homerp.entity.Transaction;
import com.homerp.entity.TransactionType;
import com.homerp.repository.AccountRepository;
import com.homerp.repository.CategoryRepository;
import com.homerp.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final AccountRepository accountRepository;
    private final CategoryRepository categoryRepository;

    public List<TransactionResponseDTO> findAll() {
        return transactionRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<TransactionResponseDTO> findByAccountId(Long accountId) {
        return transactionRepository.findByAccountId(accountId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<TransactionResponseDTO> findByCategoryId(Long categoryId) {
        return transactionRepository.findByCategoryId(categoryId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<TransactionResponseDTO> findByDateBetween(LocalDate startDate, LocalDate endDate) {
        return transactionRepository.findByDateBetween(startDate, endDate).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<TransactionResponseDTO> findByType(TransactionType type) {
        return transactionRepository.findByType(type).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public TransactionResponseDTO findById(Long id) {
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found with id: " + id));
        return toDTO(transaction);
    }

    public TransactionSummaryDTO getSummary(LocalDate startDate, LocalDate endDate) {
        BigDecimal inflows = transactionRepository.sumByTypeAndDateBetween(
                TransactionType.INFLOW, startDate, endDate);
        BigDecimal outflows = transactionRepository.sumByTypeAndDateBetween(
                TransactionType.OUTFLOW, startDate, endDate);

        return TransactionSummaryDTO.builder()
                .startDate(startDate)
                .endDate(endDate)
                .totalInflows(inflows != null ? inflows : BigDecimal.ZERO)
                .totalOutflows(outflows != null ? outflows : BigDecimal.ZERO)
                .netBalance((inflows != null ? inflows : BigDecimal.ZERO)
                        .subtract(outflows != null ? outflows : BigDecimal.ZERO))
                .build();
    }

    @Transactional
    public TransactionResponseDTO create(TransactionRequestDTO request) {
        Account account = accountRepository.findById(request.getAccountId())
                .orElseThrow(() -> new RuntimeException("Account not found with id: " + request.getAccountId()));
        
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + request.getCategoryId()));

        if (category.getType() != request.getType()) {
            throw new RuntimeException("Category type does not match transaction type");
        }

        Transaction transaction = Transaction.builder()
                .concept(request.getConcept())
                .amount(request.getAmount())
                .type(request.getType())
                .date(request.getDate())
                .notes(request.getNotes())
                .account(account)
                .category(category)
                .build();
        
        transaction = transactionRepository.save(transaction);
        
        updateAccountBalance(account, request.getType(), request.getAmount());
        
        return toDTO(transaction);
    }

    @Transactional
    public TransactionResponseDTO update(Long id, TransactionRequestDTO request) {
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found with id: " + id));
        
        Account oldAccount = transaction.getAccount();
        TransactionType oldType = transaction.getType();
        BigDecimal oldAmount = transaction.getAmount();

        Account account = accountRepository.findById(request.getAccountId())
                .orElseThrow(() -> new RuntimeException("Account not found with id: " + request.getAccountId()));
        
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + request.getCategoryId()));

        if (category.getType() != request.getType()) {
            throw new RuntimeException("Category type does not match transaction type");
        }

        revertAccountBalance(oldAccount, oldType, oldAmount);
        updateAccountBalance(account, request.getType(), request.getAmount());

        transaction.setConcept(request.getConcept());
        transaction.setAmount(request.getAmount());
        transaction.setType(request.getType());
        transaction.setDate(request.getDate());
        transaction.setNotes(request.getNotes());
        transaction.setAccount(account);
        transaction.setCategory(category);
        
        transaction = transactionRepository.save(transaction);
        return toDTO(transaction);
    }

    @Transactional
    public void delete(Long id) {
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found with id: " + id));
        
        revertAccountBalance(transaction.getAccount(), transaction.getType(), transaction.getAmount());
        
        transactionRepository.deleteById(id);
    }

    private void updateAccountBalance(Account account, TransactionType type, BigDecimal amount) {
        if (type == TransactionType.INFLOW) {
            account.setBalance(account.getBalance().add(amount));
        } else {
            account.setBalance(account.getBalance().subtract(amount));
        }
        accountRepository.save(account);
    }

    private void revertAccountBalance(Account account, TransactionType type, BigDecimal amount) {
        if (type == TransactionType.INFLOW) {
            account.setBalance(account.getBalance().subtract(amount));
        } else {
            account.setBalance(account.getBalance().add(amount));
        }
        accountRepository.save(account);
    }

    private TransactionResponseDTO toDTO(Transaction transaction) {
        return TransactionResponseDTO.builder()
                .id(transaction.getId())
                .concept(transaction.getConcept())
                .amount(transaction.getAmount())
                .type(transaction.getType().name())
                .date(transaction.getDate())
                .notes(transaction.getNotes())
                .accountId(transaction.getAccount().getId())
                .accountName(transaction.getAccount().getName())
                .categoryId(transaction.getCategory().getId())
                .categoryName(transaction.getCategory().getName())
                .createdAt(transaction.getCreatedAt())
                .build();
    }
}