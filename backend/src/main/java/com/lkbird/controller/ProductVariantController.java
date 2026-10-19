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
import org.springframework.web.bind.annotation.RestController;

import com.lkbird.dto.request.ProductVariantRequest;
import com.lkbird.dto.response.ProductVariantResponse;
import com.lkbird.entity.ProductVariant;
import com.lkbird.mapper.ProductVariantMapper;
import com.lkbird.service.ProductVariantService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/product-variants")
public class ProductVariantController {

    private final ProductVariantService productVariantService;
    private final ProductVariantMapper productVariantMapper;

    public ProductVariantController(ProductVariantService productVariantService,
            ProductVariantMapper productVariantMapper) {
        this.productVariantService = productVariantService;
        this.productVariantMapper = productVariantMapper;
    }

    @GetMapping
    public List<ProductVariantResponse> getAllVariants() {
        List<ProductVariant> variants = productVariantService.getAllVariants();
        List<ProductVariantResponse> responses = new ArrayList<>();

        for (ProductVariant variant : variants) {
            responses.add(productVariantMapper.toResponse(variant));
        }

        return responses;
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductVariantResponse> getVariantById(@PathVariable Long id) {
        Optional<ProductVariant> variant = productVariantService.getVariantById(id);

        if (variant.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(productVariantMapper.toResponse(variant.get()));
    }

    @GetMapping("/product/{productId}")
    public List<ProductVariantResponse> getVariantsByProductId(@PathVariable Long productId) {
        List<ProductVariant> variants = productVariantService.getVariantsByProductId(productId);
        List<ProductVariantResponse> responses = new ArrayList<>();

        for (ProductVariant variant : variants) {
            responses.add(productVariantMapper.toResponse(variant));
        }

        return responses;
    }

    @PostMapping
    public ResponseEntity<ProductVariantResponse> createVariant(
            @Valid @RequestBody ProductVariantRequest request) {

        ProductVariant createdVariant = productVariantService.createVariant(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(productVariantMapper.toResponse(createdVariant));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductVariantResponse> updateVariant(
            @PathVariable Long id,
            @Valid @RequestBody ProductVariantRequest request) {

        ProductVariant updatedVariant = productVariantService.updateVariant(id, request);
        return ResponseEntity.ok(productVariantMapper.toResponse(updatedVariant));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVariant(@PathVariable Long id) {
        Optional<ProductVariant> variant = productVariantService.getVariantById(id);

        if (variant.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        productVariantService.deleteVariant(id);
        return ResponseEntity.noContent().build();
    }
}
