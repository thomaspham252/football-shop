package com.footballstore.backend.modules.product.dtos.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductVariantResponse {
    private Integer variantId;
    private String color;
    private String size;
    private String surfaceType;
    private String material;
    private String skuVariant;
    private BigDecimal variantPrice;
    private Integer variantStock;
    private String imageUrl;
}
