package com.lkbird.mapper;

import org.springframework.stereotype.Component;

import com.lkbird.dto.request.CategoryRequest;
import com.lkbird.dto.response.CategoryResponse;
import com.lkbird.entity.*;
@Component
public class CategoryMapper {
     public Category toEntity(CategoryRequest request) {
        Category category = new Category();
        category.setName(request.getName());
        return category;
    }

    public CategoryResponse toResponse(Category category) {
        CategoryResponse response = new CategoryResponse();
        response.setId(category.getId());
        response.setName(category.getName());
        return response;
    }
}
