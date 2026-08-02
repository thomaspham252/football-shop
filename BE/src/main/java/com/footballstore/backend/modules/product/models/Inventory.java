package com.footballstore.backend.modules.product.models;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "inventory")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Inventory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "inventory_id")
    private Integer inventoryId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "variant_id", nullable = false, unique = true)
    private ProductVariant variant;

    @Column(name = "quantity_in_stock")
    private Integer quantityInStock;

    @Column(name = "quantity_reserved")
    private Integer quantityReserved;


    @Column(name = "quantity_available", insertable = false, updatable = false)
    private Integer quantityAvailable;

    @Column(name = "reorder_level")
    private Integer reorderLevel;

    @Column(name = "reorder_quantity")
    private Integer reorderQuantity;

    @Column(name = "last_restocked")
    private LocalDateTime lastRestocked;

    @Column(name = "last_sold")
    private LocalDateTime lastSold;

    @Column(name = "last_counted")
    private LocalDateTime lastCounted;

    @Column(name = "updated_at", insertable = false, updatable = false)
    private LocalDateTime updatedAt;
}
