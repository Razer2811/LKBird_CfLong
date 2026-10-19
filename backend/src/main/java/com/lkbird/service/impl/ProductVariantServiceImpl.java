package com.lkbird.service.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.lkbird.dto.request.ProductVariantRequest;
import com.lkbird.entity.Product;
import com.lkbird.entity.ProductVariant;
import com.lkbird.exception.DuplicateResourceException;
import com.lkbird.exception.ResourceNotFoundException;
import com.lkbird.mapper.ProductVariantMapper;
import com.lkbird.repository.ProductRepository;
import com.lkbird.repository.ProductVariantRepository;
import com.lkbird.service.ProductVariantService;

@Service
public class ProductVariantServiceImpl implements ProductVariantService {

    private final ProductVariantRepository productVariantRepository;
    private final ProductRepository productRepository;
    private final ProductVariantMapper productVariantMapper;

    public ProductVariantServiceImpl(ProductVariantRepository productVariantRepository,
            ProductRepository productRepository,
            ProductVariantMapper productVariantMapper) {
        this.productVariantRepository = productVariantRepository;
        this.productRepository = productRepository;
        this.productVariantMapper = productVariantMapper;
    }

    @Override
    public List<ProductVariant> getAllVariants() {
        return productVariantRepository.findAll();
    }

    @Override
    public Optional<ProductVariant> getVariantById(Long id) {
        return productVariantRepository.findById(id);
    }

    @Override
    public List<ProductVariant> getVariantsByProductId(Long productId) {
        return productVariantRepository.findByProductId(productId);
    }

    @Override
    public ProductVariant createVariant(ProductVariantRequest request) {
        String normalizedSku = request.getSku() == null ? "" : request.getSku().trim();
        String normalizedVariantName = request.getVariantName() == null
                ? ""
                : request.getVariantName().trim();

        if (productVariantRepository.existsBySkuIgnoreCase(normalizedSku)) {
            throw new DuplicateResourceException("Mã sản phẩm đã tồn tại");
        }

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Sản phẩm không tồn tại"));

        ProductVariant variant = productVariantMapper.toEntity(request);
        variant.setSku(normalizedSku);
        variant.setVariantName(normalizedVariantName.isBlank() ? normalizedSku : normalizedVariantName);
        variant.setProduct(product);

        return productVariantRepository.save(variant);
    }

    @Override
    public ProductVariant updateVariant(Long id, ProductVariantRequest request) {

        ProductVariant existingVariant = productVariantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Biến thể sản phẩm không tồn tại"));

        String normalizedSku = request.getSku() == null ? "" : request.getSku().trim();
        String normalizedVariantName = request.getVariantName() == null
            ? ""
            : request.getVariantName().trim();
        boolean hasDuplicate = productVariantRepository.findBySkuIgnoreCase(normalizedSku)
                .map(v -> !v.getId().equals(existingVariant.getId()))
                .orElse(false);

        if (hasDuplicate) {
            throw new DuplicateResourceException("Mã sản phẩm đã tồn tại");
        }

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Sản phẩm không tồn tại"));

        existingVariant.setSku(normalizedSku);
        existingVariant.setVariantName(normalizedVariantName.isBlank()
            ? (normalizedSku.isBlank() ? existingVariant.getVariantName() : normalizedSku)
            : normalizedVariantName);
        existingVariant.setPrice(request.getPrice());
        existingVariant.setStock(request.getStock());
        existingVariant.setWeightGram(request.getWeightGram());
        existingVariant.setExpiryDate(request.getExpiryDate());
        existingVariant.setImageUrl(request.getImageUrl());
        existingVariant.setProduct(product);

        return productVariantRepository.save(existingVariant);
    }

    @Override
    public void deleteVariant(Long id) {
        if (!productVariantRepository.existsById(id)) {
            throw new ResourceNotFoundException("Biến thể sản phẩm không tồn tại");
        }
        productVariantRepository.deleteById(id);
    }
}
