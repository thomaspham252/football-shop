package com.footballstore.backend.modules.order.services;

import com.footballstore.backend.modules.order.dtos.CartItemDto;
import com.footballstore.backend.modules.order.dtos.ValidateCartRequest;
import com.footballstore.backend.modules.order.dtos.ValidateCartResponse;
import com.footballstore.backend.modules.order.services.OrderService;
import com.footballstore.backend.modules.product.models.Product;
import com.footballstore.backend.modules.product.models.ProductVariant;
import com.footballstore.backend.modules.product.repositories.ProductVariantRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

class OrderServiceTest {
    @Mock
    private ProductVariantRepository productVariantRepository;

    @InjectMocks
    private OrderService orderService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testValidateCart_UnderFreeShippingThreshold() {
        Product product = Product.builder()
                .productName("Test Shoe")
                .priceSell(BigDecimal.valueOf(200000))
                .build();
        ProductVariant variant = ProductVariant.builder()
                .variantId(1)
                .product(product)
                .variantStock(10)
                .color("Red")
                .size("40")
                .build();

        when(productVariantRepository.findById(1)).thenReturn(Optional.of(variant));

        ValidateCartRequest request = ValidateCartRequest.builder()
                .items(Arrays.asList(new CartItemDto(1, 2)))
                .build();

        ValidateCartResponse response = orderService.validateCart(request);

        assertTrue(response.isValid());
        assertEquals(0, response.getErrors().size());
        assertEquals(0, response.getSubtotal().compareTo(BigDecimal.valueOf(400000)));
        assertEquals(0, response.getShippingFee().compareTo(BigDecimal.valueOf(40000)));
        assertEquals(0, response.getTotalAmount().compareTo(BigDecimal.valueOf(440000)));
    }

    @Test
    void testValidateCart_AtFreeShippingThreshold() {
        Product product = Product.builder()
                .productName("Test Shoe")
                .priceSell(BigDecimal.valueOf(250000))
                .build();
        ProductVariant variant = ProductVariant.builder()
                .variantId(1)
                .product(product)
                .variantStock(10)
                .color("Blue")
                .size("41")
                .build();

        when(productVariantRepository.findById(1)).thenReturn(Optional.of(variant));

        ValidateCartRequest request = ValidateCartRequest.builder()
                .items(Arrays.asList(new CartItemDto(1, 2)))
                .build();

        ValidateCartResponse response = orderService.validateCart(request);

        assertTrue(response.isValid());
        assertEquals(0, response.getErrors().size());
        assertEquals(0, response.getSubtotal().compareTo(BigDecimal.valueOf(500000)));
        assertEquals(0, response.getShippingFee().compareTo(BigDecimal.ZERO));
        assertEquals(0, response.getTotalAmount().compareTo(BigDecimal.valueOf(500000)));
    }

    @Test
    void testValidateCart_OverFreeShippingThreshold() {
        Product product = Product.builder()
                .productName("Test Shoe")
                .priceSell(BigDecimal.valueOf(300000))
                .build();
        ProductVariant variant = ProductVariant.builder()
                .variantId(1)
                .product(product)
                .variantStock(10)
                .color("Green")
                .size("42")
                .build();

        when(productVariantRepository.findById(1)).thenReturn(Optional.of(variant));

        ValidateCartRequest request = ValidateCartRequest.builder()
                .items(Arrays.asList(new CartItemDto(1, 2)))
                .build();

        ValidateCartResponse response = orderService.validateCart(request);

        assertTrue(response.isValid());
        assertEquals(0, response.getErrors().size());
        assertEquals(0, response.getSubtotal().compareTo(BigDecimal.valueOf(600000)));
        assertEquals(0, response.getShippingFee().compareTo(BigDecimal.ZERO));
        assertEquals(0, response.getTotalAmount().compareTo(BigDecimal.valueOf(600000)));
    }
}
