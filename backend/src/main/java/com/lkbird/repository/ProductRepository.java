package com.lkbird.repository;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

import com.lkbird.entity.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByNameContainingIgnoreCase(String name);

    List<Product> findByBrandContainingIgnoreCase(String brand);

    List<Product> findByNameIgnoreCase(String name);

    boolean existsByNameIgnoreCase(String name);
}
