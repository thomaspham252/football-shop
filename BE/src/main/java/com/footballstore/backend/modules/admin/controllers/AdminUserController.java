package com.footballstore.backend.modules.admin.controllers;

import com.footballstore.backend.modules.admin.dtos.CreateUserRequest;
import com.footballstore.backend.modules.admin.dtos.UpdateUserRoleRequest;
import com.footballstore.backend.modules.admin.services.AdminUserService;
import com.footballstore.backend.modules.auth.dtos.UserResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminUserController {

    private final AdminUserService adminUserService;

    /**
     * API Lấy danh sách người dùng phân trang & lọc theo vai trò
     */
    @GetMapping
    public ResponseEntity<Page<UserResponse>> getUsers(
            @RequestParam(required = false, defaultValue = "ALL") String role,
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Page<UserResponse> users = adminUserService.getUsers(role, keyword, page, size);
        return ResponseEntity.ok(users);
    }

    /**
     * API Lấy thống kê số lượng tài khoản theo vai trò
     */
    @GetMapping("/counts")
    public ResponseEntity<Map<String, Long>> getUserCounts() {
        Map<String, Long> counts = adminUserService.getUserCounts();
        return ResponseEntity.ok(counts);
    }

    /**
     * API Tạo người dùng / Nhân viên / Quản trị viên mới
     */
    @PostMapping
    public ResponseEntity<?> createUser(@Valid @RequestBody CreateUserRequest request) {
        try {
            UserResponse newUser = adminUserService.createUser(request);
            return ResponseEntity.ok(newUser);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    /**
     * API Cập nhật Vai trò người dùng (ROLE_ADMIN, ROLE_STAFF, ROLE_CUSTOMER)
     */
    @PutMapping("/{id}/role")
    public ResponseEntity<?> updateUserRole(
            @PathVariable String id,
            @Valid @RequestBody UpdateUserRoleRequest request
    ) {
        try {
            UserResponse updatedUser = adminUserService.updateUserRole(id, request);
            return ResponseEntity.ok(updatedUser);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    /**
     * API Khóa / Mở khóa tài khoản người dùng
     */
    @PutMapping("/{id}/status")
    public ResponseEntity<?> toggleUserStatus(@PathVariable String id) {
        try {
            UserResponse updatedUser = adminUserService.toggleUserStatus(id);
            return ResponseEntity.ok(updatedUser);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    /**
     * API Xóa tài khoản người dùng
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetails currentUser
    ) {
        try {
            String currentEmail = currentUser != null ? currentUser.getUsername() : "";
            adminUserService.deleteUser(id, currentEmail);
            return ResponseEntity.ok(Map.of("message", "Đã xóa tài khoản thành công!"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
