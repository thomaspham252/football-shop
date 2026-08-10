package com.footballstore.backend.modules.product.services;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.footballstore.backend.modules.product.dtos.response.ProductCardResponse;
import com.footballstore.backend.modules.product.dtos.response.ProductDetailResponse;
import com.footballstore.backend.modules.product.dtos.response.ProductVariantResponse;
import com.footballstore.backend.modules.product.models.Product;
import com.footballstore.backend.modules.product.models.ProductVariant;
import com.footballstore.backend.modules.product.repositories.ProductRepository;
import com.footballstore.backend.modules.product.repositories.ProductVariantRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProductService {

    public static final int DEFAULT_PAGE_SIZE = 12;
    public static final int DEFAULT_LIMIT = 4;

    private final ProductRepository productRepository;
    private final ProductVariantRepository productVariantRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${app.promotion.discount-threshold:30}")
    private Integer discountThreshold;

    @Transactional(readOnly = true)
    public List<ProductCardResponse> getNewProducts(int limit, String sortDir) {
        int effectiveLimit = limit > 0 ? limit : DEFAULT_LIMIT;
        Sort sort = "asc".equalsIgnoreCase(sortDir)
                ? Sort.by("createdAt").ascending()
                : Sort.by("createdAt").descending();
        Pageable pageable = PageRequest.of(0, effectiveLimit, sort);

        return productRepository
                .findByIsActiveTrue(pageable)
                .getContent()
                .stream()
                .map(this::toProductCardResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ProductCardResponse> getNewProducts(int limit) {
        return getNewProducts(limit, "desc");
    }

    @Transactional(readOnly = true)
    public List<ProductCardResponse> getBestSellingProduct(int limit) {
        int effectiveLimit = limit > 0 ? limit : DEFAULT_LIMIT;
        Pageable pageable = PageRequest.of(0, effectiveLimit, Sort.by("soldCount").descending());

        return productRepository
                .findByIsActiveTrue(pageable)
                .getContent()
                .stream()
                .map(this::toProductCardResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ProductCardResponse> getPromotionProducts(int limit) {
        int effectiveLimit = limit > 0 ? limit : DEFAULT_LIMIT;
        Pageable pageable = PageRequest.of(0, effectiveLimit, Sort.by("discountPercentage").descending());

        return productRepository.findPromotionProductsPaged(discountThreshold, pageable)
                .getContent()
                .stream()
                .map(this::toProductCardResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ProductCardResponse> getAllProducts() {
        return productRepository.findByIsActiveTrue()
                .stream()
                .map(this::toProductCardResponse)
                .toList();
    }

    private ProductCardResponse toProductCardResponse(Product product) {
        return ProductCardResponse.builder()
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
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy sản phẩm với mã: " + productId));

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
            return objectMapper.readValue(galleryJson, new TypeReference<List<String>>() {});
        } catch (Exception e) {
            log.warn("Lỗi khi giải mã galleryImages JSON: {}", e.getMessage());
            return List.of();
        }
    }
}
