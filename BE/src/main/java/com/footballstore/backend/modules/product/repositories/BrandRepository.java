package com.footballstore.backend.modules.product.repositories;

import com.footballstore.backend.modules.product.models.Brand;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BrandRepository extends JpaRepository<Brand, Integer> {
    Optional<Brand> findByBrandCode(String brandCode);

    Optional<Brand> findByBrandName(String brandName);

    List<Brand> findByStatus(String status);

    List<Brand> findByIsPopularTrue();

    List<Brand> findByStatusAndIsPopularTrue(String status);
}
