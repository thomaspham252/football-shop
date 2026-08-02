package com.footballstore.backend.modules.product.controllers;


import com.footballstore.backend.modules.product.dtos.response.ProductCardResponse;
import com.footballstore.backend.modules.product.dtos.response.ProductDetailResponse;
import com.footballstore.backend.modules.product.services.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/product")
@RequiredArgsConstructor
public class ProductController {
    private final ProductService productService;

    @GetMapping
    public List<ProductCardResponse> getAllProducts() {
        return productService.getAllProducts();
    }

    @GetMapping("/new-products")
    public List<ProductCardResponse> getNewProducts(
            @RequestParam(defaultValue = "4") int limit,
            @RequestParam(defaultValue = "desc") String sort) {

        return productService.getNewProducts(limit, sort);
    }
    @GetMapping("/best-selling")
    public List<ProductCardResponse> getBestSellingProduct(
            @RequestParam(defaultValue = "4")int limit){

        return productService.getBestSellingProduct(limit);
    }
    @GetMapping("/hot-deal")
    public List<ProductCardResponse> getHotDealProduct(
            @RequestParam(defaultValue = "4") int limit) {
        return productService.getPromotionProducts(limit);
    }

    @GetMapping("/{id}")
    public ProductDetailResponse getProductDetail(@PathVariable Integer id) {
        return productService.getProductDetail(id);
    }
}

