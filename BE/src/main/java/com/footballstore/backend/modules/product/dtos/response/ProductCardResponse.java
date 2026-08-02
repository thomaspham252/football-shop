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
public class ProductCardResponse {

    private Integer productId;

    private String productName;

    private String imageUrl;

    private BigDecimal basePrice;

    private BigDecimal salePrice;

    private Integer discountPercentage;

    private List<String> colors;
    private String size;

    private String brandName;

    private String categoryName;
}


