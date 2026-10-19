package com.lkbird.mapper;

import org.springframework.stereotype.Component;

import com.lkbird.dto.request.ProductVariantRequest;
import com.lkbird.dto.response.ProductVariantResponse;
import com.lkbird.entity.ProductVariant;

@Component
public class ProductVariantMapper {

    public ProductVariant toEntity(ProductVariantRequest request) {
        ProductVariant variant = new ProductVariant();
        variant.setSku(request.getSku());
        variant.setVariantName(request.getVariantName());
        variant.setPrice(request.getPrice());
        variant.setStock(request.getStock());
        variant.setWeightGram(request.getWeightGram());
        variant.setExpiryDate(request.getExpiryDate());
        variant.setImageUrl(request.getImageUrl());
        return variant;
    }

    public ProductVariantResponse toResponse(ProductVariant variant) {
        ProductVariantResponse response = new ProductVariantResponse();
        response.setId(variant.getId());
        response.setSku(variant.getSku());
        response.setVariantName(variant.getVariantName());
        response.setPrice(variant.getPrice());
        response.setStock(variant.getStock());
        response.setWeightGram(variant.getWeightGram());
        response.setExpiryDate(variant.getExpiryDate());
        response.setImageUrl(variant.getImageUrl());

        if (variant.getProduct() != null) {
            response.setProductId(variant.getProduct().getId());
        }

        return response;
    }
}
