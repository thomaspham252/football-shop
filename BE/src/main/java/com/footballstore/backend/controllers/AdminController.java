package com.footballstore.backend.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Controller demo các API dành riêng cho Quản trị viên (ROLE_ADMIN).
 * Yêu cầu Token mang quyền ROLE_ADMIN.
 */
@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboardStats() {
        return ResponseEntity.ok(Map.of(
                "message", "Truy cập Dashboard Quản trị viên thành công!",
                "totalUsers", 1250,
                "totalRevenue", 450000000,
                "systemStatus", "OPERATIONAL"
        ));
    }

    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        return ResponseEntity.ok(Map.of(
                "message", "Danh sách toàn bộ tài khoản người dùng trong hệ thống."
        ));
    }

    @DeleteMapping("/users/{userId}")
    public ResponseEntity<?> deleteUser(@PathVariable String userId) {
        return ResponseEntity.ok(Map.of(
                "message", "Đã xóa tài khoản người dùng ID: " + userId
        ));
    }
}
