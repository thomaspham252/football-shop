package com.footballstore.backend.modules.wishlist.controllers;

import com.footballstore.backend.modules.auth.models.User;
import com.footballstore.backend.modules.auth.services.AuthService;
import com.footballstore.backend.modules.product.dtos.response.ProductCardResponse;
import com.footballstore.backend.modules.wishlist.services.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/wishlist")
@RequiredArgsConstructor
public class WishlistController {
    private final WishlistService wishlistService;
    private final AuthService authService;

    @GetMapping
    public ResponseEntity<?> getMyWishlist(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        String userId = authService.extractUserIdFromToken(authHeader);
        if (userId == null) {
            return ResponseEntity.ok(Collections.emptyList());
        }
        User user = authService.getUserById(userId);
        if (user == null) {
            return ResponseEntity.ok(Collections.emptyList());
        }
        List<ProductCardResponse> products = wishlistService.getWishlistProducts(user.getId());
        return ResponseEntity.ok(products);
    }

    @GetMapping("/ids")
    public ResponseEntity<?> getMyWishlistIds(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        String userId = authService.extractUserIdFromToken(authHeader);
        if (userId == null) {
            return ResponseEntity.ok(Collections.emptyList());
        }
        User user = authService.getUserById(userId);
        if (user == null) {
            return ResponseEntity.ok(Collections.emptyList());
        }
        List<Integer> productIds = wishlistService.getWishlistProductIds(user.getId());
        return ResponseEntity.ok(productIds);
    }

    @PostMapping("/toggle/{productId}")
    public ResponseEntity<?> toggleWishlist(
            @PathVariable Integer productId,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        String userId = authService.extractUserIdFromToken(authHeader);
        if (userId == null) {
            return ResponseEntity.status(401).body(Map.of("message", "Yêu cầu đăng nhập!"));
        }
        User user = authService.getUserById(userId);
        if (user == null) {
            return ResponseEntity.status(401).body(Map.of("message", "Yêu cầu đăng nhập!"));
        }
        boolean added = wishlistService.toggleWishlist(user.getId(), productId);
        return ResponseEntity.ok(Map.of(
                "added", added,
                "message", added ? "Đã thêm vào danh sách yêu thích" : "Đã xóa khỏi danh sách yêu thích"
        ));
    }
}
