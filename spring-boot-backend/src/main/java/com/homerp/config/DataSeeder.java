package com.homerp.config;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.homerp.entity.*;
import com.homerp.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;

    @Value("${seed.enabled:true}")
    private boolean seedEnabled;

    @Override
    public void run(String... args) throws Exception {
        if (!seedEnabled) {
            log.info("Seed is disabled");
            return;
        }

        if (transactionRepository.count() > 0) {
            log.info("Database already contains data, skipping seed");
            return;
        }

        log.info("Starting data seed...");
        loadSeedData();
        log.info("Data seed completed!");
    }

    private void loadSeedData() throws Exception {
        var resource = new ClassPathResource("seed-data.json");
        ObjectMapper mapper = new ObjectMapper();
        JsonNode data = mapper.readTree(resource.getInputStream());

        createUser(data.get("user"));
        createAccount(data.get("account"));
        createCategories(data.get("categories"));
        createTransactions(data.get("transactions"));
    }

    private void createUser(JsonNode userData) {
        String email = userData.get("email").asText();
        if (userRepository.findByEmail(email).isEmpty()) {
            User user = User.builder()
                    .name(userData.get("name").asText())
                    .email(email)
                    .build();
            userRepository.save(user);
            log.info("Created user: {}", email);
        }
    }

    private void createAccount(JsonNode accountData) {
        String name = accountData.get("name").asText();
        if (accountRepository.findByName(name).isEmpty()) {
            Account account = Account.builder()
                    .name(name)
                    .balance(BigDecimal.valueOf(accountData.get("balance").asDouble()))
                    .currency(accountData.get("currency").asText())
                    .type(Account.AccountType.valueOf(accountData.get("type").asText()))
                    .build();
            accountRepository.save(account);
            log.info("Created account: {}", name);
        }
    }

    private void createCategories(JsonNode categoriesData) {
        List<String> incomeCats = new ArrayList<>();
        categoriesData.get("income").elements().forEachRemaining(n -> incomeCats.add(n.asText()));

        List<String> expenseCats = new ArrayList<>();
        categoriesData.get("expense").elements().forEachRemaining(n -> expenseCats.add(n.asText()));

        for (String name : incomeCats) {
            if (categoryRepository.findByNameAndType(name, TransactionType.INFLOW).isEmpty()) {
                Category cat = Category.builder()
                        .name(name)
                        .type(TransactionType.INFLOW)
                        .color("#22C55E")
                        .build();
                categoryRepository.save(cat);
            }
        }

        for (String name : expenseCats) {
            if (categoryRepository.findByNameAndType(name, TransactionType.OUTFLOW).isEmpty()) {
                Category cat = Category.builder()
                        .name(name)
                        .type(TransactionType.OUTFLOW)
                        .color("#EF4444")
                        .build();
                categoryRepository.save(cat);
            }
        }

        log.info("Created categories: {} income, {} expense", incomeCats.size(), expenseCats.size());
    }

    private void createTransactions(JsonNode transactionsData) throws Exception {
        User user = userRepository.findByEmail("test@homerp.com").orElseThrow();
        Account account = accountRepository.findByName("Main Account").orElseThrow();

        Map<String, Category> categoryMap = new HashMap<>();
        categoryRepository.findAll().forEach(cat -> {
            String key = cat.getName() + "_" + cat.getType();
            categoryMap.put(key, cat);
        });

        int count = 0;

        for (JsonNode node : transactionsData) {
            String typeStr = node.get("type").asText();
            TransactionType type = TransactionType.valueOf(typeStr);
            String concept = node.get("concept").asText();
            BigDecimal amount = BigDecimal.valueOf(node.get("amount").asDouble());
            LocalDate date = LocalDate.parse(node.get("date").asText());
            String categoryName = node.get("category").asText();

            String catKey = categoryName + "_" + type;
            Category category = categoryMap.get(catKey);
            if (category == null) {
                category = categoryRepository.findByNameAndType(categoryName, type).orElse(null);
            }

            if (category != null) {
                Transaction t = Transaction.builder()
                        .concept(concept)
                        .amount(amount)
                        .type(type)
                        .date(date)
                        .account(account)
                        .category(category)
                        .user(user)
                        .build();
                transactionRepository.save(t);
                count++;
            }
        }

        log.info("Created {} transactions", count);
    }
}