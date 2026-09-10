package com.footballstore.backend.modules.product.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;


import java.time.LocalDateTime;

@Entity
@Table(name = "product_variants")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class ProductVariant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "variant_id")
    private Integer variantId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "product_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
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

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    @Column(name = "sold_count", nullable = false)
    @Builder.Default
    private Integer soldCount = 0;
}
