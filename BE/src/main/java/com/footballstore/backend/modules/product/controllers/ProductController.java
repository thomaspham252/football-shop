package com.footballstore.backend.modules.product.controllers;

import com.footballstore.backend.modules.product.dtos.response.ProductCardResponse;
import com.footballstore.backend.modules.product.dtos.response.ProductDetailResponse;
import com.footballstore.backend.modules.product.services.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping({"/api/products", "/api/product"})
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping
    public ResponseEntity<List<ProductCardResponse>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    @GetMapping("/new-products")
    public ResponseEntity<List<ProductCardResponse>> getNewProducts(
            @RequestParam(defaultValue = "4") int limit,
            @RequestParam(defaultValue = "desc") String sort) {
        return ResponseEntity.ok(productService.getNewProducts(limit, sort));
    }

    @GetMapping("/best-selling")
    public ResponseEntity<List<ProductCardResponse>> getBestSellingProduct(
            @RequestParam(defaultValue = "4") int limit) {
        return ResponseEntity.ok(productService.getBestSellingProduct(limit));
    }

    @GetMapping("/hot-deal")
    public ResponseEntity<List<ProductCardResponse>> getHotDealProduct(
            @RequestParam(defaultValue = "4") int limit) {
        return ResponseEntity.ok(productService.getPromotionProducts(limit));
    }

    @GetMapping("/{idOrSlug}")
    public ResponseEntity<ProductDetailResponse> getProductDetail(@PathVariable String idOrSlug) {
        return ResponseEntity.ok(productService.getProductDetail(idOrSlug));
    }
}
