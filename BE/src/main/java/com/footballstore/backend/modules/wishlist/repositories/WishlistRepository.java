package com.footballstore.backend.modules.wishlist.repositories;

import com.footballstore.backend.modules.wishlist.models.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WishlistRepository extends JpaRepository<Wishlist, Integer> {
    List<Wishlist> findByUserIdOrderByCreatedAtDesc(String userId);
    Optional<Wishlist> findByUserIdAndProductId(String userId, Integer productId);
    boolean existsByUserIdAndProductId(String userId, Integer productId);
    void deleteByUserIdAndProductId(String userId, Integer productId);
}
