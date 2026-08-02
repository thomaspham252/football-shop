package com.footballstore.backend.modules.product.models;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "brands")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Brand {

    @Id
    @GeneratedValue
    private Integer brandId;

    @Column(name = "brand_code", length = 50, nullable = false, unique = true)
    private String brandCode;

    @Column(name = "brand_name", length = 100, nullable = false, unique = true)
    private String brandName;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "logo_url", length = 255)
    private String logoUrl;

    @Column(name = "website", length = 255)
    private String website;

    @Column(name = "country", length = 100)
    private String country;

    @Column(name = "status")
    private String status;

    @Column(name = "is_popular")
    private Boolean isPopular;

    @Column(name = "display_order")
    private Integer displayOrder;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", insertable = false, updatable = false)
    private LocalDateTime updatedAt;
}
