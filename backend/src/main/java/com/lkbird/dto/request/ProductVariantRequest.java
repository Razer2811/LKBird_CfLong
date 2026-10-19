package com.lkbird.dto.request;

import java.time.LocalDate;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductVariantRequest {

    @NotBlank(message = "Mã sản phẩm không được để trống")
    @Size(max = 100, message = "Mã sản phẩm không được vượt quá 100 ký tự")
    private String sku;

    @NotBlank(message = "Tên biến thể không được để trống")
    @Size(max = 255, message = "Tên biến thể không được vượt quá 255 ký tự")
    private String variantName;

    @NotNull(message = "Giá không được để trống")
    @PositiveOrZero(message = "Giá không được âm")
    private Double price;

    @NotNull(message = "Số lượng tồn kho không được để trống")
    @PositiveOrZero(message = "Số lượng tồn kho không được âm")
    private Integer stock;

    @NotNull(message = "Trọng lượng không được để trống")
    @PositiveOrZero(message = "Trọng lượng không được âm")
    private Integer weightGram;

    private LocalDate expiryDate;

    @Size(max = 500, message = "URL hình ảnh không được vượt quá 500 ký tự")
    private String imageUrl;

    @NotNull(message = "Sản phẩm không được để trống")
    @Positive(message = "Sản phẩm không hợp lệ")
    private Long productId;
}
