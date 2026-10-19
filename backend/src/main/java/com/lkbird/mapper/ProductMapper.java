package com.lkbird.mapper;

import org.springframework.stereotype.Component;

import com.lkbird.dto.request.ProductRequest;
import com.lkbird.dto.response.ProductResponse;
import com.lkbird.entity.Product;

@Component
public class ProductMapper {
    public Product toEntity(ProductRequest request) {
        Product product = new Product();

        product.setName(request.getName());
        product.setBrand(request.getBrand());
        product.setDescription(request.getDescription());
        product.setImageUrl(request.getImageUrl());
        product.setIsFragile(request.getIsFragile());
        product.setIsBulky(request.getIsBulky());
        product.setPetType(request.getPetType());

        return product;
    }

    public ProductResponse toResponse(Product product) {
        ProductResponse response = new ProductResponse();

        response.setId(product.getId());
        response.setName(product.getName());
        response.setBrand(product.getBrand());
        response.setDescription(product.getDescription());
        response.setImageUrl(product.getImageUrl());
        response.setIsFragile(product.getIsFragile());
        response.setIsBulky(product.getIsBulky());
        response.setPetType(product.getPetType());

        if (product.getCategory() != null) {
            response.setCategoryId(product.getCategory().getId());
        }

        return response;
    }
}
