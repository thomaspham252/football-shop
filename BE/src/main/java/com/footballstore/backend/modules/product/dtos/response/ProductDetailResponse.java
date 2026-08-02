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
    private BigDecimal salePrice;
    private Integer discountPercentage;
    private Boolean isActive;
    private String imageUrl;
    private List<String> galleryImages;
    private BigDecimal rating;
    private Integer totalReviews;
    private Integer stockQuantity;
    private Integer soldCount;
    private List<ProductVariantResponse> variants;
}
