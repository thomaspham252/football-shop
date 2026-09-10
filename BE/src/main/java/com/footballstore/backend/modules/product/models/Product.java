package com.footballstore.backend.modules.product.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "product_id")
    private Integer productId;

    @Column(name = "sku", length = 100, nullable = false, unique = true)
    private String sku;

    @Column(name = "product_code", length = 50, nullable = false, unique = true)
    private String productCode;

    @Column(name = "product_name", length = 200, nullable = false)
    private String productName;

    @Column(name = "slug", length = 200, unique = true)
    private String slug;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "detailed_description", columnDefinition = "TEXT")
    private String detailedDescription;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Category category;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "brand_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Brand brand;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties({"product", "hibernateLazyInitializer", "handler"})
    private List<ProductVariant> variants;

    @Column(name = "is_active")
    private Boolean isActive;



    @Column(name = "rating", precision = 3, scale = 2)
    private BigDecimal rating;

    @Column(name = "total_reviews")
    private Integer totalReviews;

    @Column(name = "stock_quantity")
    private Integer stockQuantity;

    @Column(name = "view_count")
    private Integer viewCount;



    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", insertable = false)
    private LocalDateTime updatedAt;

    @Column(name = "sold_count", nullable = false)
    @Builder.Default
    private Integer soldCount = 0;

    @Column(name = "price_cost", precision = 10, scale = 2)
    private BigDecimal priceCost;

    @Column(name = "price", precision = 10, scale = 2)
    private BigDecimal price;

    @Column(name = "price_sell", precision = 10, scale = 2)
    private BigDecimal priceSell;

    @Column(name = "discount_percentage", precision = 5, scale = 2)
    private BigDecimal discountPercentage;

    @PrePersist
    @PreUpdate
    protected void calculatePriceSell() {
        if (price != null) {
            if (discountPercentage != null && discountPercentage.compareTo(BigDecimal.ZERO) > 0) {
                java.math.BigDecimal discountFactor = java.math.BigDecimal.ONE.subtract(
                        discountPercentage.divide(java.math.BigDecimal.valueOf(100), 4, java.math.RoundingMode.HALF_UP)
                );
                this.priceSell = price.multiply(discountFactor).setScale(2, java.math.RoundingMode.HALF_UP);
            } else {
                this.priceSell = price;
            }
        }
    }
}
