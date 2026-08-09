package com.footballstore.backend.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Controller demo các API dành cho Nhân viên (ROLE_STAFF) và Quản trị viên (ROLE_ADMIN).
 * Quản lý sản phẩm, kho hàng và duyệt đơn hàng.
 */
@RestController
@RequestMapping("/api/staff")
@PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
public class StaffController {

    @GetMapping("/inventory")
    public ResponseEntity<?> getInventoryReport() {
        return ResponseEntity.ok(Map.of(
                "message", "Truy cập báo cáo tồn kho thành công!",
                "totalStock", 5400
        ));
    }

    @PutMapping("/orders/{orderId}/approve")
    public ResponseEntity<?> approveOrder(@PathVariable String orderId) {
        return ResponseEntity.ok(Map.of(
                "message", "Đã duyệt đơn hàng thành công! Mã đơn: " + orderId,
                "status", "APPROVED"
        ));
    }
}
