package com.lkbird.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductRequest {

    @NotBlank(message = "Tên sản phẩm không được để trống")
    @Size(min = 2, max = 255, message = "Tên sản phẩm phải có từ 2 đến 255 ký tự")
    private String name;

    @Size(max = 100, message = "Tên thương hiệu không được vượt quá 100 ký tự")
    private String brand;

    @Size(max = 5000, message = "Mô tả không được vượt quá 5000 ký tự")
    private String description;

    @Size(max = 500, message = "URL hình ảnh không được vượt quá 500 ký tự")
    private String imageUrl;

    @NotNull(message = "Thông tin dễ vỡ không được để trống")
    private Boolean isFragile;

    @NotNull(message = "Thông tin cồng kềnh không được để trống")
    private Boolean isBulky;

    @Size(max = 100, message = "Loài vật không được vượt quá 100 ký tự")
    private String petType;

    @NotNull(message = "Danh mục không được để trống")
    @Positive(message = "Danh mục không hợp lệ")
    private Long categoryId;
}
