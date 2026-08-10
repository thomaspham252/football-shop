package com.footballstore.backend.modules.admin.controllers;

import com.footballstore.backend.modules.admin.services.AdminInventoryService;
import com.footballstore.backend.modules.product.models.Inventory;
import com.footballstore.backend.modules.product.models.InventoryHistory;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/inventory")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
public class AdminInventoryController {

    private final AdminInventoryService adminInventoryService;

    /**
     * API Lấy danh sách tồn kho phân trang & lọc từ khóa
     */
    @GetMapping
    public ResponseEntity<Page<Inventory>> getInventory(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Page<Inventory> inventoryPage = adminInventoryService.searchInventory(keyword, status, page, size);
        return ResponseEntity.ok(inventoryPage);
    }

    /**
     * API Lấy lịch sử biến động kho hàng (Nhập kho, Xuất bán, Kiểm kê)
     */
    @GetMapping("/history")
    public ResponseEntity<Page<InventoryHistory>> getInventoryHistory(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Page<InventoryHistory> historyPage = adminInventoryService.getInventoryHistory(page, size);
        return ResponseEntity.ok(historyPage);
    }

    /**
     * API Cập nhật số lượng tồn kho & mức cảnh báo reorderLevel
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateInventoryStock(
            @PathVariable Integer id,
            @RequestBody UpdateStockRequest request
    ) {
        try {
            Inventory updated = adminInventoryService.updateInventoryStock(
                    id,
                    request.getQuantityInStock(),
                    request.getReorderLevel(),
                    request.getNotes()
            );
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    /**
     * API Nhập hàng vào kho (Import Stock)
     */
    @PostMapping("/import")
    public ResponseEntity<?> importStock(@RequestBody ImportStockRequest request) {
        try {
            Inventory imported = adminInventoryService.importStock(
                    request.getVariantId(),
                    request.getAddQuantity(),
                    request.getReferenceCode(),
                    request.getNotes()
            );
            return ResponseEntity.ok(imported);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @Data
    public static class UpdateStockRequest {
        private Integer quantityInStock;
        private Integer reorderLevel;
        private String notes;
    }

    @Data
    public static class ImportStockRequest {
        private Integer variantId;
        private Integer addQuantity;
        private String referenceCode;
        private String notes;
    }
}
