package com.footballstore.backend.modules.product.services;

import com.footballstore.backend.modules.product.dtos.response.ProductCardResponse;
import com.footballstore.backend.modules.product.dtos.response.ProductDetailResponse;
import com.footballstore.backend.modules.product.dtos.response.ProductVariantResponse;
import com.footballstore.backend.modules.product.models.Category;
import com.footballstore.backend.modules.product.models.Product;
import com.footballstore.backend.modules.product.models.ProductVariant;
import com.footballstore.backend.modules.product.repositories.ProductRepository;
import com.footballstore.backend.modules.product.repositories.ProductVariantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepository productRepository;
    private final ProductVariantRepository productVariantRepository;
    @Value("${app.promotion.discount-threshold}")
    private Integer discountThreshold;


//  Lay san pham moi
    public List<ProductCardResponse> getNewProducts(int limit, String sortDir) {
        Sort sort = "asc".equalsIgnoreCase(sortDir)
                ? Sort.by("createdAt").ascending()
                : Sort.by("createdAt").descending();
        Pageable pageable = PageRequest.of(0, limit, sort);

        return productRepository
                .findByIsActiveTrue(pageable)
                .getContent()
                .stream()
                .map(this::toProductCardResponse)
                .toList();
    }

    public List<ProductCardResponse> getNewProducts(int limit) {
        return getNewProducts(limit, "desc");
    }

//  Lay san pham ban chay
    public List<ProductCardResponse> getBestSellingProduct(int limit) {
        Pageable pageable = PageRequest.of(0, limit, Sort.by("soldCount").descending());

        return productRepository
                .findByIsActiveTrue(pageable)
                .getContent()
                .stream()
                .map(this::toProductCardResponse)
                .toList();
    }

//Lay san pham co giam gia tren 30%
    public List<ProductCardResponse> getPromotionProducts(int limit) {
        Pageable pageable = PageRequest.of(0, limit, Sort.by("discountPercentage").descending());

        return productRepository.findPromotionProductsPaged(discountThreshold, pageable)
                .getContent()
                .stream()
                .map(this::toProductCardResponse)
                .toList();
    }

// Lay toan bo san pham dang hoat dong
    public List<ProductCardResponse> getAllProducts() {
        return productRepository.findByIsActiveTrue()
                .stream()
                .map(this::toProductCardResponse)
                .toList();
    }


    private ProductCardResponse toProductCardResponse(Product product) {
        return
                ProductCardResponse.builder()
                        .productId(product.getProductId())
                        .productName(product.getProductName())
                        .imageUrl(product.getImageUrl())
                        .basePrice(product.getBasePrice())
                        .salePrice(product.getSalePrice())
                        .discountPercentage(product.getDiscountPercentage())
                        .colors(productVariantRepository.findDistinctColorsByProductId(product.getProductId()))
                        .brandName(product.getBrand() != null ? product.getBrand().getBrandName() : null)
                        .brandLogoUrl(product.getBrand() != null ? product.getBrand().getLogoUrl() : null)
                        .categoryName(product.getCategory() != null ? product.getCategory().getCategoryName() : null)
                        .categoryImageUrl(product.getCategory() != null ? product.getCategory().getImageUrl() : null)
                        .build();

    }

    @Transactional(readOnly = true)
    public ProductDetailResponse getProductDetail(Integer productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + productId));

        List<ProductVariant> variants = productVariantRepository.findByProductProductIdAndIsActiveTrue(productId);

        return toProductDetailResponse(product, variants);
    }

    private ProductDetailResponse toProductDetailResponse(Product product, List<ProductVariant> variants) {
        List<ProductVariantResponse> variantResponses = variants.stream()
                .map(v -> ProductVariantResponse.builder()
                        .variantId(v.getVariantId())
                        .color(v.getColor())
                        .size(v.getSize())
                        .surfaceType(v.getSurfaceType())
                        .material(v.getMaterial())
                        .skuVariant(v.getSkuVariant())
                        .variantPrice(v.getVariantPrice())
                        .variantStock(v.getVariantStock())
                        .imageUrl(v.getImageUrl())
                        .build())
                .toList();

        List<String> galleryList = parseGalleryImages(product.getGalleryImages());

        return ProductDetailResponse.builder()
                .productId(product.getProductId())
                .sku(product.getSku())
                .productCode(product.getProductCode())
                .productName(product.getProductName())
                .slug(product.getSlug())
                .description(product.getDescription())
                .detailedDescription(product.getDetailedDescription())
                .brandName(product.getBrand() != null ? product.getBrand().getBrandName() : null)
                .categoryName(product.getCategory() != null ? product.getCategory().getCategoryName() : null)
                .basePrice(product.getBasePrice())
                .salePrice(product.getSalePrice())
                .discountPercentage(product.getDiscountPercentage())
                .isActive(product.getIsActive())
                .imageUrl(product.getImageUrl())
                .galleryImages(galleryList)
                .rating(product.getRating())
                .totalReviews(product.getTotalReviews())
                .stockQuantity(product.getStockQuantity())
                .soldCount(product.getSoldCount())
                .variants(variantResponses)
                .build();
    }

    private List<String> parseGalleryImages(String galleryJson) {
        if (galleryJson == null || galleryJson.isBlank()) {
            return List.of();
        }
        try {
            return new com.fasterxml.jackson.databind.ObjectMapper()
                    .readValue(galleryJson, new com.fasterxml.jackson.core.type.TypeReference<List<String>>() {});
        } catch (Exception e) {
            return List.of();
        }
    }
}

