package com.footballstore.backend.modules.admin.controllers;

import com.footballstore.backend.modules.admin.dtos.UpdateOrderStatusRequest;
import com.footballstore.backend.modules.admin.services.AdminOrderService;
import com.footballstore.backend.modules.order.models.Order;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/orders")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
public class AdminOrderController {

    private final AdminOrderService adminOrderService;

    /**
     * API Lấy danh sách đơn hàng cho Admin / Staff với phân trang, lọc trạng thái & tìm kiếm
     */
    @GetMapping
    public ResponseEntity<Page<Order>> getOrders(
            @RequestParam(required = false, defaultValue = "ALL") String status,
            @RequestParam(required = false, defaultValue = "ALL") String paymentStatus,
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Page<Order> orders = adminOrderService.searchOrders(status, paymentStatus, keyword, page, size);
        return ResponseEntity.ok(orders);
    }

    /**
     * API Lấy chi tiết 1 đơn hàng theo ID
     */
    @GetMapping("/{id:\\d+}")
    public ResponseEntity<?> getOrderById(@PathVariable Integer id) {
        try {
            Order order = adminOrderService.getOrderById(id);
            return ResponseEntity.ok(order);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    /**
     * API Cập nhật trạng thái đơn hàng (PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED)
     */
    @PutMapping("/{id:\\d+}/status")
    public ResponseEntity<?> updateOrderStatus(
            @PathVariable Integer id,
            @Valid @RequestBody UpdateOrderStatusRequest request
    ) {
        try {
            Order updatedOrder = adminOrderService.updateOrderStatus(id, request);
            return ResponseEntity.ok(updatedOrder);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    /**
     * API Cập nhật trạng thái thanh toán (PENDING, PAID, FAILED)
     */
    @PutMapping("/{id:\\d+}/payment-status")
    public ResponseEntity<?> updatePaymentStatus(
            @PathVariable Integer id,
            @RequestBody Map<String, String> body
    ) {
        String paymentStatus = body.get("paymentStatus");
        if (paymentStatus == null || paymentStatus.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Trạng thái thanh toán không được để trống!"));
        }
        try {
            Order updatedOrder = adminOrderService.updatePaymentStatus(id, paymentStatus);
            return ResponseEntity.ok(updatedOrder);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    /**
     * API Hủy đơn hàng từ phía Quản trị viên
     */
    @PostMapping("/{id:\\d+}/cancel")
    public ResponseEntity<?> cancelOrder(
            @PathVariable Integer id,
            @RequestBody(required = false) Map<String, String> body
    ) {
        String reason = body != null ? body.get("reason") : "Quản trị viên hủy đơn";
        try {
            Order cancelledOrder = adminOrderService.cancelOrder(id, reason);
            return ResponseEntity.ok(cancelledOrder);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
