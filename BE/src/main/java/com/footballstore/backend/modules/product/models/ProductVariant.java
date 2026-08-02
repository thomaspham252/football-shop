package com.footballstore.backend.modules.product.models;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "product_variants")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductVariant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "variant_id")
    private Integer variantId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(name = "color", length = 100, nullable = false)
    private String color;

    @Column(name = "size", length = 50, nullable = false)
    private String size;
    @Column(name = "surface_type")
    private String surfaceType;

    @Column(name = "material", length = 100)
    private String material;

    @Column(name = "sku_variant", length = 100, nullable = false, unique = true)
    private String skuVariant;

    @Column(name = "variant_price", precision = 10, scale = 2)
    private BigDecimal variantPrice;

    @Column(name = "variant_cost", precision = 10, scale = 2)
    private BigDecimal variantCost;

    @Column(name = "variant_stock")
    private Integer variantStock;

    @Column(name = "reorder_level")
    private Integer reorderLevel;

    @Column(name = "image_url", length = 255)
    private String imageUrl;

    @Column(name = "barcode", length = 100)
    private String barcode;

    @Column(name = "is_active")
    private Boolean isActive;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", insertable = false, updatable = false)
    private LocalDateTime updatedAt;

    @Column(name = "sold_count",nullable = false)
    @Builder.Default
    private Integer soldCount = 0;
}
