package com.footballstore.backend.modules.product.repositories;

import com.footballstore.backend.modules.product.models.InventoryHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InventoryHistoryRepository extends JpaRepository<InventoryHistory, Integer> {

    List<InventoryHistory> findByVariant_VariantIdOrderByCreatedAtDesc(Integer variantId);

    List<InventoryHistory> findByTransactionType(String transactionType);

    List<InventoryHistory> findByReferenceCode(String referenceCode);
}
