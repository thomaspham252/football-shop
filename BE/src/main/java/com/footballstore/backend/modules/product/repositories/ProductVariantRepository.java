package com.footballstore.backend.modules.product.repositories;

import com.footballstore.backend.modules.product.models.ProductVariant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

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
}

