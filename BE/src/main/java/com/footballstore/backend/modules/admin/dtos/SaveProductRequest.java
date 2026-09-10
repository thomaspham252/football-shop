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

    private String slug;

    private String sku;

    private String productCode;

    private String description;

    private String detailedDescription;

    @NotNull(message = "Vui lòng chọn danh mục sản phẩm!")
    private Integer categoryId;

    private Integer brandId;

    private BigDecimal price;

    private BigDecimal priceCost;

    private BigDecimal discountPercentage;

    private Boolean isActive = true;


    private List<ProductVariantItemRequest> variants;

    @Data
    public static class ProductVariantItemRequest {
        private Integer variantId;
        private String color;
        private String size;
        private String surfaceType;
        private String material;
        private String skuVariant;
        private Integer variantStock = 0;
        private String imageUrl;
    }
}
