package com.lkbird.repository;
import org.springframework.data.jpa.repository.JpaRepository;

import com.lkbird.entity.Category;

import java.util.List;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    List<Category> findByNameContainingIgnoreCase(String name);
}