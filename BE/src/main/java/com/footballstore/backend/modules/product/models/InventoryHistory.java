package com.footballstore.backend.modules.product.models;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "inventory_history")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InventoryHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "history_id")
    private Integer historyId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "variant_id", nullable = false)
    private ProductVariant variant;

    /*
     * PostgreSQL enum:
     * inventory_transaction_type_enum
     * Giá trị: import, sale, cancel_order, return, damage, adjustment, transfer
     * Tạm thời dùng String cho dễ.
     */
    @Column(name = "transaction_type", nullable = false)
    private String transactionType;

    @Column(name = "quantity_change", nullable = false)
    private Integer quantityChange;

    @Column(name = "previous_quantity")
    private Integer previousQuantity;

    @Column(name = "new_quantity")
    private Integer newQuantity;

    @Column(name = "reference_id")
    private Integer referenceId;

    @Column(name = "reference_code", length = 100)
    private String referenceCode;

    @Column(name = "reference_type", nullable = false)
    private String referenceType;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @Column(name = "recorded_by")
    private Integer recordedBy;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;
}
