package com.footballstore.backend.modules.product.repositories;

import com.footballstore.backend.modules.product.models.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Integer> {
    Optional<Product> findBySlug(String slug);

    Page<Product> findByIsActiveTrueOrderByCreatedAtDesc(Pageable pageable);

    Page<Product> findByIsActiveTrueOrderBySoldCountDesc(Pageable pageable);

    @Query("""
        SELECT DISTINCT p FROM Product p
        LEFT JOIN p.category c
        LEFT JOIN c.parentCategory pc
        WHERE p.isActive = true AND (
            LOWER(c.categoryName) LIKE LOWER(CONCAT('%', :categoryKeyword, '%')) OR
            LOWER(pc.categoryName) LIKE LOWER(CONCAT('%', :categoryKeyword, '%')) OR
            LOWER(c.categoryCode) LIKE LOWER(CONCAT('%', :categoryKeyword, '%'))
        )
        ORDER BY p.soldCount DESC
    """)
    List<Product> findActiveByCategoryKeyword(@Param("categoryKeyword") String categoryKeyword, Pageable pageable);

    @Query("""
        SELECT p FROM Product p
        LEFT JOIN p.category c
        LEFT JOIN c.parentCategory pc
        WHERE p.isActive = true AND (
            LOWER(c.categoryName) = LOWER(:categoryName) OR
            LOWER(pc.categoryName) = LOWER(:categoryName)
        )
        ORDER BY p.soldCount DESC
    """)
    List<Product> findActiveByCategoryName(@Param("categoryName") String categoryName, Pageable pageable);

    @Query("SELECT DISTINCT p FROM Product p JOIN p.variants v WHERE p.discountPercentage > :threshold AND v.isActive = true AND p.isActive = true")
    Page<Product> findPromotionProductsPaged(@Param("threshold") BigDecimal threshold, Pageable pageable);

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

    @Query("""
        SELECT DISTINCT p FROM Product p 
        LEFT JOIN ProductVariant pv ON pv.product.productId = p.productId
        WHERE p.isActive = true AND (
            LOWER(p.productName) LIKE LOWER(CONCAT('%', :kw, '%')) OR 
            LOWER(p.description) LIKE LOWER(CONCAT('%', :kw, '%')) OR
            LOWER(p.category.categoryName) LIKE LOWER(CONCAT('%', :kw, '%')) OR
            LOWER(p.brand.brandName) LIKE LOWER(CONCAT('%', :kw, '%')) OR
            LOWER(pv.color) LIKE LOWER(CONCAT('%', :kw, '%'))
        )
    """)
    List<Product> searchByKeyword(@Param("kw") String keyword, Pageable pageable);

    @Query("""
        SELECT DISTINCT p FROM Product p 
        LEFT JOIN p.category c
        LEFT JOIN c.parentCategory pc
        LEFT JOIN p.brand b
        LEFT JOIN p.variants pv
        WHERE p.isActive = true AND (
            LOWER(p.productName) LIKE LOWER(CONCAT('%', :kw, '%')) OR 
            LOWER(p.description) LIKE LOWER(CONCAT('%', :kw, '%')) OR
            LOWER(c.categoryName) LIKE LOWER(CONCAT('%', :kw, '%')) OR
            LOWER(pc.categoryName) LIKE LOWER(CONCAT('%', :kw, '%')) OR
            LOWER(b.brandName) LIKE LOWER(CONCAT('%', :kw, '%')) OR
            LOWER(pv.color) LIKE LOWER(CONCAT('%', :kw, '%'))
        )
        ORDER BY p.soldCount DESC
    """)
    List<Product> searchProductsForChatbot(@Param("kw") String keyword, Pageable pageable);
}
