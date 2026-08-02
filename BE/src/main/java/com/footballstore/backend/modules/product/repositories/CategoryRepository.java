package com.footballstore.backend.modules.product.repositories;

import com.footballstore.backend.modules.product.models.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Integer> {
    Optional<Category> findBySlugAndIsActiveTrue(String slug);

    List<Category> findByIsActiveTrueOrderByDisplayOrder();

}
