package com.footballstore.backend.modules.product.repositories;

import com.footballstore.backend.modules.product.models.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ProductRepository  extends JpaRepository<Product, Integer> {
//   Home
    Page<Product> findByIsActiveTrueOrderByCreatedAtDesc(Pageable pageable);

    Page<Product> findByIsActiveTrueOrderBySoldCountDesc(Pageable pageable);


    @Query("SELECT p FROM Product p WHERE p.discountPercentage > :threshold AND p.isActive = true")
    Page<Product> findPromotionProductsPaged(@Param("threshold") Integer threshold, Pageable pageable);

    Page<Product> findByIsActiveTrue(Pageable pageable);

    List<Product> findByIsActiveTrue();
}

