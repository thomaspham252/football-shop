package com.footballstore.backend.modules.product.repositories;

import com.footballstore.backend.modules.product.models.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface InventoryRepository extends JpaRepository<Inventory, Integer> {

            //    Lấy tồn kho theo variant
    Optional<Inventory> findByVariant_VariantId(Integer variantId);

    List<Inventory> findByQuantityAvailableGreaterThan(Integer quantity);

    List<Inventory> findByQuantityInStockLessThan(Integer quantity);
}
