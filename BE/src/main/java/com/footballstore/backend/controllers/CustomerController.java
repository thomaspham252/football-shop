package com.footballstore.backend.controllers;

import com.footballstore.backend.config.security.UserDetailsImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Controller demo các API dành cho Khách hàng (ROLE_CUSTOMER), STAFF và ADMIN.
 * Mua sắm, xem giỏ hàng, xem đơn hàng cá nhân.
 */
@RestController
@RequestMapping("/api/customer")
@PreAuthorize("hasAnyRole('ADMIN', 'STAFF', 'CUSTOMER')")
public class CustomerController {

    @GetMapping("/my-orders")
    public ResponseEntity<?> getMyOrders(@AuthenticationPrincipal UserDetailsImpl currentUser) {
        return ResponseEntity.ok(Map.of(
                "message", "Lịch sử đơn hàng của cá nhân " + currentUser.getFullName(),
                "email", currentUser.getUsername(),
                "userId", currentUser.getId()
        ));
    }

    @GetMapping("/cart")
    public ResponseEntity<?> getMyCart(@AuthenticationPrincipal UserDetailsImpl currentUser) {
        return ResponseEntity.ok(Map.of(
                "message", "Thông tin giỏ hàng hiện tại của người dùng",
                "userId", currentUser.getId()
        ));
    }
}
