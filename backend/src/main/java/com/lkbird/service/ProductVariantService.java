package com.lkbird.service;

import java.util.List;
import java.util.Optional;

import com.lkbird.dto.request.ProductVariantRequest;
import com.lkbird.entity.ProductVariant;

public interface ProductVariantService {

    List<ProductVariant> getAllVariants();

    Optional<ProductVariant> getVariantById(Long id);

    List<ProductVariant> getVariantsByProductId(Long productId);

    ProductVariant createVariant(ProductVariantRequest request);

    ProductVariant updateVariant(Long id, ProductVariantRequest request);

    void deleteVariant(Long id);
}
