package com.lkbird.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.lkbird.dto.request.CategoryRequest;
import com.lkbird.dto.response.CategoryResponse;
import com.lkbird.entity.Category;
import com.lkbird.mapper.CategoryMapper;
import com.lkbird.service.CategoryService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/categories")
public class CategoryController {

    private final CategoryService categoryService;
    private final CategoryMapper categoryMapper;

    public CategoryController(CategoryService categoryService, CategoryMapper categoryMapper) {
        this.categoryService = categoryService;
        this.categoryMapper = categoryMapper;
    }

    @GetMapping
    public List<CategoryResponse> getAllCategories() {
        List<Category> categories = categoryService.getAllCategories();
        List<CategoryResponse> responses = new ArrayList<>();

        for (Category category : categories) {
            responses.add(categoryMapper.toResponse(category));
        }

        return responses;
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoryResponse> getCategoryById(@PathVariable Long id) {
        Optional<Category> category = categoryService.getCategoryById(id);

        if (category.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(categoryMapper.toResponse(category.get()));
    }

    @GetMapping("/search")
    public List<CategoryResponse> searchCategoryByName(
            @RequestParam String search) {

        List<Category> categories = categoryService.getCategoryByName(search);

        List<CategoryResponse> responses = new ArrayList<>();

        for (Category category : categories) {
            responses.add(categoryMapper.toResponse(category));
        }

        return responses;
    }

    @PostMapping
    public ResponseEntity<CategoryResponse> createCategory(
            @Valid @RequestBody CategoryRequest categoryRequest) {

        Category category = categoryMapper.toEntity(categoryRequest);
        Category savedCategory = categoryService.createCategory(category);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(categoryMapper.toResponse(savedCategory));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CategoryResponse> updateCategory(
            @PathVariable Long id,
            @Valid @RequestBody CategoryRequest categoryRequest) {

        Optional<Category> existingCategory = categoryService.getCategoryById(id);

        if (existingCategory.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Category updatedCategory = existingCategory.get();
        updatedCategory.setName(categoryRequest.getName());

        Category savedCategory = categoryService.updateCategory(updatedCategory);

        return ResponseEntity.ok(categoryMapper.toResponse(savedCategory));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        Optional<Category> existingCategory = categoryService.getCategoryById(id);

        if (existingCategory.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        categoryService.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }
}
