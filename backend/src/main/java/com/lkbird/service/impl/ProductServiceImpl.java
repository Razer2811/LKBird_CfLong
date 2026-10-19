package com.lkbird.service.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.lkbird.dto.request.ProductRequest;
import com.lkbird.entity.Category;
import com.lkbird.entity.Product;
import com.lkbird.exception.DuplicateResourceException;
import com.lkbird.exception.ResourceNotFoundException;
import com.lkbird.mapper.ProductMapper;
import com.lkbird.repository.CategoryRepository;
import com.lkbird.repository.ProductRepository;
import com.lkbird.service.ProductService;

@Service
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ProductMapper productMapper;

    public ProductServiceImpl(ProductRepository productRepository, CategoryRepository categoryRepository,
            ProductMapper productMapper) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.productMapper = productMapper;
    }

    @Override
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    @Override
    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }

    @Override
    public List<Product> getProductByName(String name) {
        return productRepository.findByNameContainingIgnoreCase(name);
    }

    @Override
    public List<Product> getProductByBrand(String brand) {
        return productRepository.findByBrandContainingIgnoreCase(brand);
    }

    @Override
    public Product createProduct(ProductRequest request) {
        String normalizedName = request.getName() == null ? "" : request.getName().trim();

        if (productRepository.existsByNameIgnoreCase(normalizedName)) {
            throw new DuplicateResourceException("Tên sản phẩm đã tồn tại");
        }

        Long categoryId = request.getCategoryId();

        Optional<Category> optionalCategory = categoryRepository.findById(categoryId);

        if (optionalCategory.isEmpty()) {
            throw new ResourceNotFoundException("Category không tồn tại");
        }

        Category category = optionalCategory.get();

        Product product = productMapper.toEntity(request);
        product.setName(normalizedName);
        product.setCategory(category);

        return productRepository.save(product);
    }

    @Override
    public Product updateProduct(Product product, Long categoryId) {

        Optional<Category> optionalCategory = categoryRepository.findById(categoryId);

        if (optionalCategory.isEmpty()) {
            throw new ResourceNotFoundException("Category không tồn tại");
        }

        Product existingProduct = productRepository.findById(product.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Sản phẩm không tồn tại"));

        String normalizedName = product.getName() == null ? "" : product.getName().trim();
        boolean hasDuplicate = productRepository.findByNameIgnoreCase(normalizedName).stream()
                .anyMatch(p -> !p.getId().equals(existingProduct.getId()));

        if (hasDuplicate) {
            throw new DuplicateResourceException("Tên sản phẩm đã tồn tại");
        }

        product.setName(normalizedName);
        product.setCategory(optionalCategory.get());

        return productRepository.save(product);
    }

    @Override
    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new ResourceNotFoundException("Sản phẩm không tồn tại");
        }
        productRepository.deleteById(id);
    }

}
