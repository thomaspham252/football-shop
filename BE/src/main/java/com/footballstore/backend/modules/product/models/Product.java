package com.footballstore.backend.modules.product.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

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

    @Column(name = "base_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal basePrice;

    @Column(name = "cost_price", precision = 10, scale = 2)
    private BigDecimal costPrice;

    @Column(name = "discount_percentage")
    private Integer discountPercentage;

    @Column(name = "sale_price", precision = 10, scale = 2, insertable = false, updatable = false)
    private BigDecimal salePrice;

    @Column(name = "is_active")
    private Boolean isActive;

    @Column(name = "image_url", length = 255)
    private String imageUrl;

    @Column(name = "gallery_images", columnDefinition = "jsonb")
    private String galleryImages;

    @Column(name = "rating", precision = 3, scale = 2)
    private BigDecimal rating;

    @Column(name = "total_reviews")
    private Integer totalReviews;

    @Column(name = "stock_quantity")
    private Integer stockQuantity;

    @Column(name = "view_count")
    private Integer viewCount;

    @Column(name = "seo_title", length = 255)
    private String seoTitle;

    @Column(name = "seo_description", columnDefinition = "TEXT")
    private String seoDescription;

    @Column(name = "seo_keywords", length = 255)
    private String seoKeywords;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", insertable = false)
    private LocalDateTime updatedAt;

    @Column(name = "sold_count", nullable = false)
    @Builder.Default
    private Integer soldCount = 0;
}
