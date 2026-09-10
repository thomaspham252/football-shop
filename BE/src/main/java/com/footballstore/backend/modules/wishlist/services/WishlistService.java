package com.footballstore.backend.modules.wishlist.services;

import com.footballstore.backend.modules.product.dtos.response.ProductCardResponse;

import com.footballstore.backend.modules.product.repositories.ProductRepository;
import com.footballstore.backend.modules.wishlist.models.Wishlist;
import com.footballstore.backend.modules.wishlist.repositories.WishlistRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import com.footballstore.backend.modules.product.services.ProductService;

@Service
@RequiredArgsConstructor
public class WishlistService {
    private final WishlistRepository wishlistRepository;
    private final ProductRepository productRepository;
    private final ProductService productService;

    public List<ProductCardResponse> getWishlistProducts(String userId) {
        List<Wishlist> wishlists = wishlistRepository.findByUserIdOrderByCreatedAtDesc(userId);
        List<Integer> productIds = wishlists.stream()
                .map(Wishlist::getProductId)
                .collect(Collectors.toList());

        return productIds.stream()
                .map(productRepository::findById)
                .filter(Optional::isPresent)
                .map(Optional::get)
                .map(productService::toProductCardResponse)
                .collect(Collectors.toList());
    }

    public List<Integer> getWishlistProductIds(String userId) {
        return wishlistRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(Wishlist::getProductId)
                .collect(Collectors.toList());
    }

    @Transactional
    public boolean toggleWishlist(String userId, Integer productId) {
        Optional<Wishlist> existing = wishlistRepository.findByUserIdAndProductId(userId, productId);
        if (existing.isPresent()) {
            wishlistRepository.delete(existing.get());
            return false;
        } else {
            Wishlist wishlist = Wishlist.builder()
                    .userId(userId)
                    .productId(productId)
                    .build();
            wishlistRepository.save(wishlist);
            return true;
        }
    }
}
