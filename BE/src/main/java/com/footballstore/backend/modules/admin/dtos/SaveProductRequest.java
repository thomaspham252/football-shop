package com.footballstore.backend.modules.admin.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class SaveProductRequest {

    @NotBlank(message = "Tên sản phẩm không được để trống!")
    private String productName;

    private String sku;

    private String productCode;

    private String description;

    private String detailedDescription;

    @NotNull(message = "Vui lòng chọn danh mục sản phẩm!")
    private Integer categoryId;

    private Integer brandId;

    @NotNull(message = "Giá gốc không được để trống!")
    private BigDecimal basePrice;

    private BigDecimal costPrice;

    private Integer discountPercentage = 0;

    private Boolean isActive = true;

    private String imageUrl;

    private String galleryImages;

    private List<ProductVariantItemRequest> variants;

    @Data
    public static class ProductVariantItemRequest {
        private Integer variantId;
        private String color;
        private String size;
        private String surfaceType;
        private String material;
        private String skuVariant;
        private BigDecimal variantPrice;
        private Integer variantStock = 0;
        private String imageUrl;
    }
}
