package com.homerp.repository;

import com.homerp.entity.Category;
import com.homerp.entity.TransactionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    Optional<Category> findByNameAndType(String name, TransactionType type);
}