package com.footballstore.backend.modules.product.repositories;

import com.footballstore.backend.modules.product.models.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Integer> {
    Page<Product> findByIsActiveTrueOrderByCreatedAtDesc(Pageable pageable);

    Page<Product> findByIsActiveTrueOrderBySoldCountDesc(Pageable pageable);

    @Query("SELECT p FROM Product p WHERE p.discountPercentage > :threshold AND p.isActive = true")
    Page<Product> findPromotionProductsPaged(@Param("threshold") Integer threshold, Pageable pageable);

    Page<Product> findByIsActiveTrue(Pageable pageable);

    List<Product> findByIsActiveTrue();

    // Tim kiem va loc san pham cho Admin (Danh muc cha bao gom ca danh muc con)
    @Query(
        value = "SELECT p FROM Product p WHERE " +
                "(CAST(:categoryId AS string) IS NULL OR p.category.categoryId = :categoryId OR p.category.parentCategory.categoryId = :categoryId) AND " +
                "(CAST(:brandId AS string) IS NULL OR p.brand.brandId = :brandId) AND " +
                "(CAST(:keyword AS string) IS NULL OR " +
                " LOWER(p.productName) LIKE CAST(:keyword AS string) OR " +
                " LOWER(p.sku) LIKE CAST(:keyword AS string) OR " +
                " LOWER(p.productCode) LIKE CAST(:keyword AS string))",
        countQuery = "SELECT COUNT(p) FROM Product p WHERE " +
                "(CAST(:categoryId AS string) IS NULL OR p.category.categoryId = :categoryId OR p.category.parentCategory.categoryId = :categoryId) AND " +
                "(CAST(:brandId AS string) IS NULL OR p.brand.brandId = :brandId) AND " +
                "(CAST(:keyword AS string) IS NULL OR " +
                " LOWER(p.productName) LIKE CAST(:keyword AS string) OR " +
                " LOWER(p.sku) LIKE CAST(:keyword AS string) OR " +
                " LOWER(p.productCode) LIKE CAST(:keyword AS string))"
    )
    Page<Product> searchAdminProducts(
            @Param("categoryId") Integer categoryId,
            @Param("brandId") Integer brandId,
            @Param("keyword") String keyword,
            Pageable pageable
    );
}
