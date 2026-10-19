package com.lkbird.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductResponse {

    private Long id;

    private String name;

    private String brand;

    private String description;

    private String imageUrl;

    private Boolean isFragile;

    private Boolean isBulky;

    private String petType;

    private Long categoryId;
}