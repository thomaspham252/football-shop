package com.footballstore.backend.modules.product.dtos.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductDetailResponse {
    private Integer productId;
    private String sku;
    private String productCode;
    private String productName;
    private String slug;
    private String description;
    private String detailedDescription;
    private String brandName;
    private String categoryName;
    private BigDecimal basePrice;
    private BigDecimal priceCost;
    private BigDecimal salePrice;
    private BigDecimal discountPercentage;
    private Boolean isActive;

    private BigDecimal rating;
    private Integer totalReviews;
    private Integer stockQuantity;
    private Integer soldCount;
    private List<ProductVariantResponse> variants;
}
