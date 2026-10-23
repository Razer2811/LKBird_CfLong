package com.lkbird.service;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;

import com.lkbird.dto.request.ProductRequest;
import com.lkbird.entity.Product;
public interface ProductService {

    List<Product> getAllProducts();

    Page<Product> getProductsPage(String keyword, Long categoryId, int offset, int limit);

    Optional<Product> getProductById(Long id);

    List<Product> getProductByName(String name);

    List<Product> getProductByBrand(String brand);

    Product createProduct(ProductRequest productRequest);

    Product updateProduct(Product product, Long categoryId);

    void deleteProduct(Long id);


}
