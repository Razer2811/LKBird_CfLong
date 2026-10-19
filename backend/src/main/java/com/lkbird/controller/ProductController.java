package com.lkbird.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.lkbird.dto.request.ProductRequest;
import com.lkbird.dto.response.ProductResponse;
import com.lkbird.entity.Product;
import com.lkbird.mapper.ProductMapper;
import com.lkbird.service.ProductService;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@RequestMapping("/products")
@RestController
public class ProductController {

    private final ProductService productService;
    private final ProductMapper productMapper;

    public ProductController(ProductService productService, ProductMapper productMapper) {
        this.productService = productService;
        this.productMapper = productMapper;
    }

    @GetMapping
    public List<ProductResponse> getAllProducts() {

        List<Product> products = productService.getAllProducts();

        List<ProductResponse> responses = new ArrayList<>();

        for (Product product : products) {
            ProductResponse response = productMapper.toResponse(product);
            responses.add(response);
        }

        return responses;
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> getProductById(@PathVariable Long id) {
        Optional<Product> product = productService.getProductById(id);

        if (product.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        ProductResponse response = productMapper.toResponse(product.get());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/search/name")
    public List<ProductResponse> getProductByName(@RequestParam String name) {

        List<Product> products = productService.getProductByName(name);

        List<ProductResponse> responses = new ArrayList<>();

        for (Product product : products) {
            ProductResponse response = productMapper.toResponse(product);
            responses.add(response);
        }

        return responses;
    }

    @GetMapping("/search/brand")
    public List<ProductResponse> getProductByBrand(@RequestParam String brand) {

        List<Product> products = productService.getProductByBrand(brand);

        List<ProductResponse> responses = new ArrayList<>();

        for (Product product : products) {
            ProductResponse response = productMapper.toResponse(product);
            responses.add(response);
        }

        return responses;
    }

    @PostMapping
    public ResponseEntity<ProductResponse> createProduct(
            @Valid @RequestBody ProductRequest productRequest) {

        Product createdProduct = productService.createProduct(productRequest);

        ProductResponse response = productMapper.toResponse(createdProduct);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductResponse> updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody ProductRequest productRequest) {

        Optional<Product> existingProduct = productService.getProductById(id);

        if (existingProduct.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Product updatedProduct = existingProduct.get();

        updatedProduct.setName(productRequest.getName());
        updatedProduct.setBrand(productRequest.getBrand());
        updatedProduct.setDescription(productRequest.getDescription());
        updatedProduct.setImageUrl(productRequest.getImageUrl());
        updatedProduct.setIsFragile(productRequest.getIsFragile());
        updatedProduct.setIsBulky(productRequest.getIsBulky());
        updatedProduct.setPetType(productRequest.getPetType());

        Product savedProduct = productService.updateProduct(
                updatedProduct,
                productRequest.getCategoryId());

        ProductResponse response = productMapper.toResponse(savedProduct);

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        Optional<Product> existingProduct = productService.getProductById(id);

        if (existingProduct.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }

}
