package com.lkbird.dto.response;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductPageResponse {

    private List<ProductResponse> items;

    private long totalElements;

    private int totalPages;

    private int offset;

    private int limit;

    private boolean hasNext;
}
