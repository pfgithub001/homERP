package com.homerp.service;

import com.homerp.dto.CategoryRequestDTO;
import com.homerp.dto.CategoryResponseDTO;
import com.homerp.entity.Category;
import com.homerp.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public List<CategoryResponseDTO> findAll() {
        return categoryRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public CategoryResponseDTO findById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + id));
        return toDTO(category);
    }

    @Transactional
    public CategoryResponseDTO create(CategoryRequestDTO request) {
        Category category = Category.builder()
                .name(request.getName())
                .type(request.getType())
                .color(request.getColor() != null ? request.getColor() : "#3B82F6")
                .build();
        
        category = categoryRepository.save(category);
        return toDTO(category);
    }

    @Transactional
    public CategoryResponseDTO update(Long id, CategoryRequestDTO request) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + id));
        
        category.setName(request.getName());
        category.setType(request.getType());
        if (request.getColor() != null) {
            category.setColor(request.getColor());
        }
        
        category = categoryRepository.save(category);
        return toDTO(category);
    }

    @Transactional
    public void delete(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new RuntimeException("Category not found with id: " + id);
        }
        categoryRepository.deleteById(id);
    }

    private CategoryResponseDTO toDTO(Category category) {
        return CategoryResponseDTO.builder()
                .id(category.getId())
                .name(category.getName())
                .type(category.getType().name())
                .color(category.getColor())
                .createdAt(category.getCreatedAt())
                .build();
    }
}