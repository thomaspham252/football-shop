package com.footballstore.backend.modules.product.repositories;

import com.footballstore.backend.modules.product.models.ProductVariant;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ProductVariantRepository extends JpaRepository<ProductVariant, Integer> {

    @Query("""
        select distinct pv.color
        from ProductVariant pv
        where pv.product.productId = :productId
          and pv.isActive = true
    """)
    List<String> findDistinctColorsByProductId(Integer productId);

    List<ProductVariant> findByProductProductIdAndIsActiveTrue(Integer productId);

    @org.springframework.data.jpa.repository.Lock(jakarta.persistence.LockModeType.PESSIMISTIC_WRITE)
    @Query("select pv from ProductVariant pv where pv.variantId = :variantId")
    Optional<ProductVariant> findForUpdateByVariantId(Integer variantId);

    // Tim kiem va loc bien the san pham cho Admin (LEFT JOIN FETCH product, category, brand)
    @Query(
        value = "SELECT pv FROM ProductVariant pv " +
                "LEFT JOIN FETCH pv.product p " +
                "LEFT JOIN FETCH p.category c " +
                "LEFT JOIN FETCH p.brand b WHERE " +
                "(CAST(:categoryId AS string) IS NULL OR c.categoryId = :categoryId OR c.parentCategory.categoryId = :categoryId) AND " +
                "(CAST(:brandId AS string) IS NULL OR b.brandId = :brandId) AND " +
                "(CAST(:keyword AS string) IS NULL OR " +
                " LOWER(p.productName) LIKE CAST(:keyword AS string) OR " +
                " LOWER(pv.skuVariant) LIKE CAST(:keyword AS string) OR " +
                " LOWER(pv.color) LIKE CAST(:keyword AS string) OR " +
                " LOWER(pv.size) LIKE CAST(:keyword AS string))",
        countQuery = "SELECT COUNT(pv) FROM ProductVariant pv WHERE " +
                "(CAST(:categoryId AS string) IS NULL OR pv.product.category.categoryId = :categoryId OR pv.product.category.parentCategory.categoryId = :categoryId) AND " +
                "(CAST(:brandId AS string) IS NULL OR pv.product.brand.brandId = :brandId) AND " +
                "(CAST(:keyword AS string) IS NULL OR " +
                " LOWER(pv.product.productName) LIKE CAST(:keyword AS string) OR " +
                " LOWER(pv.skuVariant) LIKE CAST(:keyword AS string) OR " +
                " LOWER(pv.color) LIKE CAST(:keyword AS string) OR " +
                " LOWER(pv.size) LIKE CAST(:keyword AS string))"
    )
    Page<ProductVariant> searchAdminProductVariants(
            @Param("categoryId") Integer categoryId,
            @Param("brandId") Integer brandId,
            @Param("keyword") String keyword,
            Pageable pageable
    );
}
