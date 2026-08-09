package com.footballstore.backend.modules.product.repositories;

import com.footballstore.backend.modules.product.models.Inventory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface InventoryRepository extends JpaRepository<Inventory, Integer> {

    Optional<Inventory> findByVariant_VariantId(Integer variantId);

    List<Inventory> findByQuantityAvailableGreaterThan(Integer quantity);

    List<Inventory> findByQuantityInStockLessThan(Integer quantity);

    @Query(
        value = "SELECT i FROM Inventory i " +
                "LEFT JOIN FETCH i.variant v " +
                "LEFT JOIN FETCH v.product p WHERE " +
                "(CAST(:keyword AS string) IS NULL OR " +
                " LOWER(p.productName) LIKE CAST(:keyword AS string) OR " +
                " LOWER(v.skuVariant) LIKE CAST(:keyword AS string) OR " +
                " LOWER(v.color) LIKE CAST(:keyword AS string))",
        countQuery = "SELECT COUNT(i) FROM Inventory i WHERE " +
                "(CAST(:keyword AS string) IS NULL OR " +
                " LOWER(i.variant.product.productName) LIKE CAST(:keyword AS string) OR " +
                " LOWER(i.variant.skuVariant) LIKE CAST(:keyword AS string) OR " +
                " LOWER(i.variant.color) LIKE CAST(:keyword AS string))"
    )
    Page<Inventory> searchAdminInventory(
            @Param("keyword") String keyword,
            Pageable pageable
    );
}
