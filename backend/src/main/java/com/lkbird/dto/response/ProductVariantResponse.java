package com.lkbird.dto.response;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductVariantResponse {

    private Long id;
    private String sku;
    private String variantName;
    private Double price;
    private Integer stock;
    private Integer weightGram;
    private LocalDate expiryDate;
    private String imageUrl;
    private Long productId;
}
