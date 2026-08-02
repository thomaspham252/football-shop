package com.footballstore.backend.modules.product.models;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
@Entity
@Table(name = "categories")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "category_id")
    private Integer categoryId;

    @Column(name = "category_code", length = 50, nullable = false, unique = true)
    private String categoryCode;

    @Column(name = "category_name", length = 150, nullable = false, unique = true)
    private String categoryName;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "category_type", nullable = false)
    private String categoryType;

    @Column(unique = true, nullable = false)
    private String slug;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_category_id")
    private Category parentCategory;

    @Column(name = "image_url", length = 255)
    private String imageUrl;

    @Column(name = "display_order")
    private Integer displayOrder;

    @Column(name = "is_active")
    private Boolean isActive;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", insertable = false, updatable = false)
    private LocalDateTime updatedAt;

}
