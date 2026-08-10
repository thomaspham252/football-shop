package com.footballstore.backend.modules.admin.services;

import com.footballstore.backend.modules.product.models.Inventory;
import com.footballstore.backend.modules.product.models.InventoryHistory;
import com.footballstore.backend.modules.product.models.ProductVariant;
import com.footballstore.backend.modules.product.repositories.InventoryHistoryRepository;
import com.footballstore.backend.modules.product.repositories.InventoryRepository;
import com.footballstore.backend.modules.product.repositories.ProductVariantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminInventoryService {

    private final InventoryRepository inventoryRepository;
    private final InventoryHistoryRepository inventoryHistoryRepository;
    private final ProductVariantRepository productVariantRepository;

    @Transactional
    public Page<Inventory> searchInventory(String keyword, String status, int page, int size) {
        // Tự động đồng bộ các ProductVariant mới vào bảng Inventory nếu chưa có
        syncVariantsToInventory();

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "inventoryId"));
        String cleanKeyword = (keyword != null && !keyword.trim().isEmpty()) 
                ? "%" + keyword.trim().toLowerCase() + "%" : null;

        return inventoryRepository.searchAdminInventory(cleanKeyword, pageable);
    }

    @Transactional(readOnly = true)
    public Page<InventoryHistory> getInventoryHistory(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "historyId"));
        return inventoryHistoryRepository.findAllByOrderByCreatedAtDesc(pageable);
    }

    @Transactional
    public Inventory updateInventoryStock(Integer inventoryId, Integer quantityInStock, Integer reorderLevel, String notes) {
        Inventory inventory = inventoryRepository.findById(inventoryId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy thông tin kho hàng với ID: " + inventoryId));

        int previousQty = inventory.getQuantityInStock() != null ? inventory.getQuantityInStock() : 0;
        int newQty = quantityInStock != null ? quantityInStock : 0;
        int diff = newQty - previousQty;

        inventory.setQuantityInStock(newQty);
        if (reorderLevel != null) {
            inventory.setReorderLevel(reorderLevel);
        }
        inventory.setLastCounted(LocalDateTime.now());

        // Cập nhật số lượng tồn kho của ProductVariant tương ứng
        ProductVariant variant = inventory.getVariant();
        if (variant != null) {
            variant.setVariantStock(newQty);
            productVariantRepository.save(variant);
        }

        Inventory saved = inventoryRepository.save(inventory);

        // Ghi lịch sử kiểm kê
        if (diff != 0) {
            InventoryHistory history = InventoryHistory.builder()
                    .variant(variant)
                    .transactionType(diff > 0 ? "adjustment" : "damage")
                    .quantityChange(diff)
                    .previousQuantity(previousQty)
                    .newQuantity(newQty)
                    .referenceType("Kiểm kê")
                    .referenceCode("#ADJ-" + System.currentTimeMillis() % 100000)
                    .notes(notes != null && !notes.isBlank() ? notes : "Cập nhật kiểm kê thủ công bởi quản trị viên")
                    .build();
            inventoryHistoryRepository.save(history);
        }

        return saved;
    }

    @Transactional
    public Inventory importStock(Integer variantId, Integer addQuantity, String referenceCode, String notes) {
        ProductVariant variant = productVariantRepository.findById(variantId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy biến thể sản phẩm ID: " + variantId));

        Inventory inventory = inventoryRepository.findByVariant_VariantId(variantId)
                .orElseGet(() -> Inventory.builder()
                        .variant(variant)
                        .quantityInStock(0)
                        .quantityReserved(0)
                        .reorderLevel(10)
                        .reorderQuantity(30)
                        .build());

        int previousQty = inventory.getQuantityInStock() != null ? inventory.getQuantityInStock() : 0;
        int newQty = previousQty + addQuantity;

        inventory.setQuantityInStock(newQty);
        inventory.setLastRestocked(LocalDateTime.now());

        variant.setVariantStock(newQty);
        productVariantRepository.save(variant);

        Inventory saved = inventoryRepository.save(inventory);

        // Ghi lịch sử nhập kho
        InventoryHistory history = InventoryHistory.builder()
                .variant(variant)
                .transactionType("import")
                .quantityChange(addQuantity)
                .previousQuantity(previousQty)
                .newQuantity(newQty)
                .referenceType("Đơn nhập hàng")
                .referenceCode(referenceCode != null && !referenceCode.isBlank() ? referenceCode : "#IMP-" + System.currentTimeMillis() % 100000)
                .notes(notes != null && !notes.isBlank() ? notes : "Nhập kho sản phẩm")
                .build();
        inventoryHistoryRepository.save(history);

        return saved;
    }

    private void syncVariantsToInventory() {
        List<ProductVariant> variants = productVariantRepository.findAll();
        for (ProductVariant v : variants) {
            if (inventoryRepository.findByVariant_VariantId(v.getVariantId()).isEmpty()) {
                Inventory inv = Inventory.builder()
                        .variant(v)
                        .quantityInStock(v.getVariantStock() != null ? v.getVariantStock() : 10)
                        .quantityReserved(0)
                        .reorderLevel(10)
                        .reorderQuantity(30)
                        .lastRestocked(LocalDateTime.now())
                        .lastCounted(LocalDateTime.now())
                        .build();
                inventoryRepository.save(inv);
            }
        }
    }
}
