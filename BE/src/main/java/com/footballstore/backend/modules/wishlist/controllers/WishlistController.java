package com.footballstore.backend.modules.wishlist.controllers;


import com.footballstore.backend.modules.auth.services.AuthService;
import com.footballstore.backend.modules.product.dtos.response.ProductCardResponse;
import com.footballstore.backend.modules.wishlist.services.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Map;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import com.footballstore.backend.config.security.UserDetailsImpl;

@RestController
@RequestMapping("/api/wishlist")
@RequiredArgsConstructor
public class WishlistController {
    private final WishlistService wishlistService;
    private final AuthService authService;

    private UserDetailsImpl getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserDetailsImpl) {
            return (UserDetailsImpl) authentication.getPrincipal();
        }
        return null;
    }

    @GetMapping
    public ResponseEntity<?> getMyWishlist() {
        UserDetailsImpl currentUser = getCurrentUser();
        if (currentUser == null) {
            return ResponseEntity.ok(Collections.emptyList());
        }
        List<ProductCardResponse> products = wishlistService.getWishlistProducts(currentUser.getId());
        return ResponseEntity.ok(products);
    }

    @GetMapping("/ids")
    public ResponseEntity<?> getMyWishlistIds() {
        UserDetailsImpl currentUser = getCurrentUser();
        if (currentUser == null) {
            return ResponseEntity.ok(Collections.emptyList());
        }
        List<Integer> productIds = wishlistService.getWishlistProductIds(currentUser.getId());
        return ResponseEntity.ok(productIds);
    }

    @PostMapping("/toggle/{productId}")
    public ResponseEntity<?> toggleWishlist(@PathVariable Integer productId) {
        UserDetailsImpl currentUser = getCurrentUser();
        if (currentUser == null) {
            return ResponseEntity.status(401).body(Map.of("message", "Yêu cầu đăng nhập!"));
        }
        boolean added = wishlistService.toggleWishlist(currentUser.getId(), productId);
        return ResponseEntity.ok(Map.of(
                "added", added,
                "message", added ? "Đã thêm vào danh sách yêu thích" : "Đã xóa khỏi danh sách yêu thích"
        ));
    }
}
