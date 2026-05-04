package com.homerp.service;

import com.homerp.dto.AccountRequestDTO;
import com.homerp.dto.AccountResponseDTO;
import com.homerp.entity.Account;
import com.homerp.repository.AccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AccountService {

    private final AccountRepository accountRepository;

    public List<AccountResponseDTO> findAll() {
        return accountRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public AccountResponseDTO findById(Long id) {
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Account not found with id: " + id));
        return toDTO(account);
    }

    @Transactional
    public AccountResponseDTO create(AccountRequestDTO request) {
        Account account = Account.builder()
                .name(request.getName())
                .balance(request.getBalance())
                .currency(request.getCurrency() != null ? request.getCurrency() : "EUR")
                .type(request.getType() != null ? request.getType() : Account.AccountType.CASH)
                .build();
        
        account = accountRepository.save(account);
        return toDTO(account);
    }

    @Transactional
    public AccountResponseDTO update(Long id, AccountRequestDTO request) {
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Account not found with id: " + id));
        
        account.setName(request.getName());
        if (request.getBalance() != null) {
            account.setBalance(request.getBalance());
        }
        if (request.getCurrency() != null) {
            account.setCurrency(request.getCurrency());
        }
        if (request.getType() != null) {
            account.setType(request.getType());
        }
        
        account = accountRepository.save(account);
        return toDTO(account);
    }

    @Transactional
    public void delete(Long id) {
        if (!accountRepository.existsById(id)) {
            throw new RuntimeException("Account not found with id: " + id);
        }
        accountRepository.deleteById(id);
    }

    private AccountResponseDTO toDTO(Account account) {
        return AccountResponseDTO.builder()
                .id(account.getId())
                .name(account.getName())
                .balance(account.getBalance())
                .currency(account.getCurrency())
                .type(account.getType().name())
                .createdAt(account.getCreatedAt())
                .build();
    }
}