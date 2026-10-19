package com.lkbird.service;
import java.util.List;
import java.util.Optional;

import com.lkbird.dto.request.ProductRequest;
import com.lkbird.entity.Product;
public interface ProductService {

    List<Product> getAllProducts();

    Optional<Product> getProductById(Long id);

    List<Product> getProductByName(String name);

    List<Product> getProductByBrand(String brand);

    Product createProduct(ProductRequest productRequest);

    Product updateProduct(Product product, Long categoryId);

    void deleteProduct(Long id);


}
