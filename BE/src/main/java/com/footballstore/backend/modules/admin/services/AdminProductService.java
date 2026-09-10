package com.footballstore.backend.modules.admin.services;

import com.footballstore.backend.modules.admin.dtos.SaveProductRequest;
import com.footballstore.backend.modules.product.models.Brand;
import com.footballstore.backend.modules.product.models.Category;
import com.footballstore.backend.modules.product.models.Product;
import com.footballstore.backend.modules.product.models.ProductVariant;
import com.footballstore.backend.modules.product.repositories.BrandRepository;
import com.footballstore.backend.modules.product.repositories.CategoryRepository;
import com.footballstore.backend.modules.product.repositories.ProductRepository;
import com.footballstore.backend.modules.product.repositories.ProductVariantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.util.*;

@Service
@RequiredArgsConstructor
public class AdminProductService {

    private final ProductRepository productRepository;
    private final ProductVariantRepository productVariantRepository;
    private final CategoryRepository categoryRepository;
    private final BrandRepository brandRepository;

    @Transactional(readOnly = true)
    public Page<Product> searchProducts(Integer categoryId, Integer brandId, String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));

        String cleanKeyword = (keyword != null && !keyword.trim().isEmpty()) 
                ? "%" + keyword.trim().toLowerCase() + "%" : null;

        if (categoryId == null && brandId == null && cleanKeyword == null) {
            return productRepository.findAll(pageable);
        }

        return productRepository.searchAdminProducts(categoryId, brandId, cleanKeyword, pageable);
    }

    @Transactional(readOnly = true)
    public Page<ProductVariant> searchProductVariants(Integer categoryId, Integer brandId, String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "variantId"));

        String cleanKeyword = (keyword != null && !keyword.trim().isEmpty()) 
                ? "%" + keyword.trim().toLowerCase() + "%" : null;

        if (categoryId == null && brandId == null && cleanKeyword == null) {
            return productVariantRepository.findAll(pageable);
        }

        return productVariantRepository.searchAdminProductVariants(categoryId, brandId, cleanKeyword, pageable);
    }

    @Transactional(readOnly = true)
    public Product getProductById(Integer productId) {
        return productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy sản phẩm với mã ID: " + productId));
    }

    @Transactional(readOnly = true)
    public List<ProductVariant> getProductVariants(Integer productId) {
        return productVariantRepository.findByProductProductIdAndIsActiveTrue(productId);
    }

    @Transactional(readOnly = true)
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<Brand> getAllBrands() {
        return brandRepository.findAll();
    }

    @Transactional
    public Product saveProduct(SaveProductRequest request, Integer productId) {
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy danh mục được chọn!"));

        Brand brand = null;
        if (request.getBrandId() != null) {
            brand = brandRepository.findById(request.getBrandId()).orElse(null);
        }

        Product product;
        if (productId != null) {
            product = getProductById(productId);
        } else {
            product = new Product();
        }

        product.setProductName(request.getProductName());

        // Sinh tự động SKU và ProductCode nếu không nhập
        if (request.getSku() != null && !request.getSku().isBlank()) {
            product.setSku(request.getSku().trim());
        } else if (product.getSku() == null) {
            product.setSku("SKU-" + System.currentTimeMillis() % 1000000);
        }

        if (request.getProductCode() != null && !request.getProductCode().isBlank()) {
            product.setProductCode(request.getProductCode().trim());
        } else if (product.getProductCode() == null) {
            product.setProductCode("PROD-" + System.currentTimeMillis() % 100000);
        }

        // Generate Slug
        if (request.getSlug() != null && !request.getSlug().trim().isEmpty()) {
            product.setSlug(request.getSlug().trim());
        } else if (product.getSlug() == null || product.getSlug().isBlank()) {
            product.setSlug(generateSlug(request.getProductName()));
        }

        product.setProductName(request.getProductName());
        product.setDescription(request.getDescription());
        product.setDetailedDescription(request.getDetailedDescription());
        product.setCategory(category);
        product.setBrand(brand);
        product.setIsActive(request.getIsActive() != null ? request.getIsActive() : true);

        product.setPriceCost(request.getPriceCost());
        product.setPrice(request.getPrice());
        product.setDiscountPercentage(request.getDiscountPercentage());

        Product savedProduct = productRepository.save(product);

        // Xử lý danh sách biến thể (ProductVariants)
        if (request.getVariants() != null && !request.getVariants().isEmpty()) {
            int totalStock = 0;
            for (SaveProductRequest.ProductVariantItemRequest vReq : request.getVariants()) {
                ProductVariant variant;
                if (vReq.getVariantId() != null) {
                    variant = productVariantRepository.findById(vReq.getVariantId()).orElse(new ProductVariant());
                } else {
                    variant = new ProductVariant();
                }

                variant.setProduct(savedProduct);
                variant.setColor(vReq.getColor() != null ? vReq.getColor() : "Mặc định");
                variant.setSize(vReq.getSize() != null ? vReq.getSize() : "Freesize");
                variant.setSurfaceType(vReq.getSurfaceType());
                variant.setMaterial(vReq.getMaterial());
                
                String skuVar = vReq.getSkuVariant();
                if (skuVar == null || skuVar.isBlank()) {
                    skuVar = savedProduct.getSku() + "-" + variant.getColor() + "-" + variant.getSize();
                }
                variant.setSkuVariant(skuVar);

                int stock = vReq.getVariantStock() != null ? vReq.getVariantStock() : 10;
                variant.setVariantStock(stock);
                totalStock += stock;

                variant.setImageUrl(vReq.getImageUrl());
                variant.setIsActive(true);

                productVariantRepository.save(variant);
            }
            savedProduct.setStockQuantity(totalStock);
            productRepository.save(savedProduct);
        }

        return savedProduct;
    }

    @Transactional
    public void deleteProduct(Integer productId) {
        Product product = getProductById(productId);
        productRepository.delete(product);
    }

    @Transactional
    public void deleteVariant(Integer variantId) {
        productVariantRepository.deleteById(variantId);
    }

    @Transactional
    public Brand saveBrand(Brand brand) {
        if (brand.getBrandCode() == null || brand.getBrandCode().isBlank()) {
            brand.setBrandCode("BR-" + System.currentTimeMillis() % 10000);
        }
        return brandRepository.save(brand);
    }

    @Transactional
    public Category saveCategory(Category category) {
        if (category.getCategoryCode() == null || category.getCategoryCode().isBlank()) {
            category.setCategoryCode("CAT-" + System.currentTimeMillis() % 10000);
        }
        if (category.getSlug() == null || category.getSlug().isBlank()) {
            category.setSlug(generateSlug(category.getCategoryName()));
        }
        return categoryRepository.save(category);
    }

    private String generateSlug(String text) {
        if (text == null) return "";
        return text.toLowerCase()
                .replaceAll("[àáạảãâầấậẩẫăằắặẳẵ]", "a")
                .replaceAll("[èéẹẻẽêềếệểễ]", "e")
                .replaceAll("[ìíịỉĩ]", "i")
                .replaceAll("[òóọỏõôồốộổỗơờớợởỡ]", "o")
                .replaceAll("[ùúụủũưừứựửữ]", "u")
                .replaceAll("[ỳýỵỷỹ]", "y")
                .replaceAll("đ", "d")
                .replaceAll("[^a-z0-9\\s-]", "")
                .replaceAll("\\s+", "-")
                .replaceAll("-+", "-")
                .replaceAll("^-|-$", "");
    }
}
