package com.lkbird.service;

import java.util.List;
import java.util.Optional;

import com.lkbird.entity.Category;


public interface CategoryService {
    List<Category> getAllCategories();

    Optional<Category> getCategoryById(Long id);

    List<Category> getCategoryByName(String name);

    Category createCategory(Category category);

    Category updateCategory(Category category);

    void deleteCategory(Long id);
}
