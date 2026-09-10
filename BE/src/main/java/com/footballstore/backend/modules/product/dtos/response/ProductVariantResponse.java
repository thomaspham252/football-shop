package com.footballstore.backend.modules.product.dtos.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;



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

    private Integer variantStock;
    private String imageUrl;
}
