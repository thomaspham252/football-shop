package com.footballstore.backend.modules.admin.controllers;

import com.footballstore.backend.modules.admin.dtos.SaveProductRequest;
import com.footballstore.backend.modules.admin.services.AdminProductService;
import com.footballstore.backend.modules.product.models.Brand;
import com.footballstore.backend.modules.product.models.Category;
import com.footballstore.backend.modules.product.models.Product;
import com.footballstore.backend.modules.product.models.ProductVariant;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/products")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
public class AdminProductController {

    public static final String DEFAULT_PAGE_SIZE = "5";

    private final AdminProductService adminProductService;

    @GetMapping
    public ResponseEntity<Page<Product>> getProducts(
            @RequestParam(required = false) Integer categoryId,
            @RequestParam(required = false) Integer brandId,
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = DEFAULT_PAGE_SIZE) int size
    ) {
        Page<Product> products = adminProductService.searchProducts(categoryId, brandId, keyword, page, size);
        return ResponseEntity.ok(products);
    }

    @GetMapping("/variants")
    public ResponseEntity<Page<ProductVariant>> getProductVariants(
            @RequestParam(required = false) Integer categoryId,
            @RequestParam(required = false) Integer brandId,
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = DEFAULT_PAGE_SIZE) int size
    ) {
        Page<ProductVariant> variants = adminProductService.searchProductVariants(categoryId, brandId, keyword, page, size);
        return ResponseEntity.ok(variants);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getProductById(@PathVariable Integer id) {
        try {
            Product product = adminProductService.getProductById(id);
            List<ProductVariant> variants = adminProductService.getProductVariants(id);
            return ResponseEntity.ok(Map.of(
                    "product", product,
                    "variants", variants
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> createProduct(@Valid @RequestBody SaveProductRequest request) {
        try {
            Product newProduct = adminProductService.saveProduct(request, null);
            return ResponseEntity.ok(newProduct);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateProduct(
            @PathVariable Integer id,
            @Valid @RequestBody SaveProductRequest request
    ) {
        try {
            Product updatedProduct = adminProductService.saveProduct(request, id);
            return ResponseEntity.ok(updatedProduct);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Integer id) {
        try {
            adminProductService.deleteProduct(id);
            return ResponseEntity.ok(Map.of("message", "Đã xóa sản phẩm thành công!"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/variants/{variantId}")
    public ResponseEntity<?> deleteVariant(@PathVariable Integer variantId) {
        try {
            adminProductService.deleteVariant(variantId);
            return ResponseEntity.ok(Map.of("message", "Đã xóa biến thể thành công!"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/categories")
    public ResponseEntity<List<Category>> getCategories() {
        return ResponseEntity.ok(adminProductService.getAllCategories());
    }

    @PostMapping("/categories")
    public ResponseEntity<Category> saveCategory(@RequestBody Category category) {
        return ResponseEntity.ok(adminProductService.saveCategory(category));
    }

    @GetMapping("/brands")
    public ResponseEntity<List<Brand>> getBrands() {
        return ResponseEntity.ok(adminProductService.getAllBrands());
    }

    @PostMapping("/brands")
    public ResponseEntity<Brand> saveBrand(@RequestBody Brand brand) {
        return ResponseEntity.ok(adminProductService.saveBrand(brand));
    }
}
