package com.footballstore.backend.modules.order.services;

import com.footballstore.backend.modules.order.dtos.CartItemDto;
import com.footballstore.backend.modules.order.dtos.CreateOrderRequest;
import com.footballstore.backend.modules.order.dtos.ValidateCartRequest;
import com.footballstore.backend.modules.order.dtos.ValidateCartResponse;
import com.footballstore.backend.modules.order.models.Coupon;
import com.footballstore.backend.modules.order.models.Order;
import com.footballstore.backend.modules.order.models.OrderItem;
import com.footballstore.backend.modules.order.models.OrderStatus;
import com.footballstore.backend.modules.order.models.PaymentStatus;
import com.footballstore.backend.modules.order.repositories.CouponRepository;
import com.footballstore.backend.modules.order.repositories.OrderItemRepository;
import com.footballstore.backend.modules.order.repositories.OrderRepository;
import com.footballstore.backend.modules.product.models.ProductVariant;
import com.footballstore.backend.modules.product.repositories.ProductVariantRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Random;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrderService {

    private static final BigDecimal FREE_SHIPPING_THRESHOLD = BigDecimal.valueOf(500000);
    private static final BigDecimal DEFAULT_SHIPPING_FEE = BigDecimal.valueOf(40000);
    private static final BigDecimal MAX_COD_THRESHOLD = BigDecimal.valueOf(5000000);

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final ProductVariantRepository productVariantRepository;
    private final CouponRepository couponRepository;
    private final CouponService couponService;
    private final EmailService emailService;

    @Transactional(readOnly = true)
    public ValidateCartResponse validateCart(ValidateCartRequest request) {
        List<String> errors = new ArrayList<>();
        BigDecimal subtotal = BigDecimal.ZERO;

        for (CartItemDto item : request.getItems()) {
            ProductVariant variant = productVariantRepository.findById(item.getVariantId()).orElse(null);
            if (variant == null) {
                errors.add("Phiên bản sản phẩm ID " + item.getVariantId() + " không tồn tại.");
                continue;
            }
            if (variant.getVariantStock() < item.getQuantity()) {
                errors.add("Sản phẩm " + variant.getProduct().getProductName() + " (Màu: " + variant.getColor() + ", Size: " + variant.getSize() + ") không đủ hàng trong kho (Còn lại: " + variant.getVariantStock() + ").");
            }
            BigDecimal itemPrice = variant.getVariantPrice() != null ? variant.getVariantPrice() : variant.getProduct().getSalePrice();
            if (itemPrice == null) {
                itemPrice = variant.getProduct().getBasePrice();
            }
            subtotal = subtotal.add(itemPrice.multiply(BigDecimal.valueOf(item.getQuantity())));
        }

        BigDecimal shippingFee = subtotal.compareTo(FREE_SHIPPING_THRESHOLD) >= 0 ? BigDecimal.ZERO : DEFAULT_SHIPPING_FEE;
        BigDecimal totalAmount = subtotal.add(shippingFee);

        return ValidateCartResponse.builder()
                .valid(errors.isEmpty())
                .errors(errors)
                .subtotal(subtotal)
                .shippingFee(shippingFee)
                .totalAmount(totalAmount)
                .build();
    }

    @Transactional
    public Order createOrder(CreateOrderRequest request) {
        BigDecimal subtotal = BigDecimal.ZERO;
        List<OrderItem> orderItems = new ArrayList<>();

        for (CartItemDto item : request.getItems()) {
            ProductVariant variant = productVariantRepository.findForUpdateByVariantId(item.getVariantId())
                    .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy phiên bản sản phẩm với ID: " + item.getVariantId()));

            if (variant.getVariantStock() < item.getQuantity()) {
                throw new IllegalArgumentException("Sản phẩm " + variant.getProduct().getProductName() + " (Màu: " + variant.getColor() + ", Size: " + variant.getSize() + ") không đủ số lượng trong kho.");
            }

            variant.setVariantStock(variant.getVariantStock() - item.getQuantity());
            variant.setSoldCount(variant.getSoldCount() + item.getQuantity());
            productVariantRepository.save(variant);

            BigDecimal itemPrice = variant.getVariantPrice() != null ? variant.getVariantPrice() : variant.getProduct().getSalePrice();
            if (itemPrice == null) {
                itemPrice = variant.getProduct().getBasePrice();
            }

            subtotal = subtotal.add(itemPrice.multiply(BigDecimal.valueOf(item.getQuantity())));

            OrderItem orderItem = OrderItem.builder()
                    .product(variant.getProduct())
                    .productVariant(variant)
                    .quantity(item.getQuantity())
                    .price(itemPrice)
                    .color(variant.getColor())
                    .size(variant.getSize())
                    .build();

            orderItems.add(orderItem);
        }

        BigDecimal shippingFee = subtotal.compareTo(FREE_SHIPPING_THRESHOLD) >= 0 ? BigDecimal.ZERO : DEFAULT_SHIPPING_FEE;
        BigDecimal discountAmount = BigDecimal.ZERO;

        if (request.getCouponCode() != null && !request.getCouponCode().trim().isEmpty()) {
            Coupon coupon = couponService.validateAndGetCoupon(request.getCouponCode(), subtotal);
            discountAmount = couponService.calculateDiscount(coupon, subtotal);
            coupon.setUsedCount(coupon.getUsedCount() + 1);
            couponRepository.save(coupon);
        }

        BigDecimal totalAmount = subtotal.add(shippingFee).subtract(discountAmount);
        if (totalAmount.compareTo(BigDecimal.ZERO) < 0) {
            totalAmount = BigDecimal.ZERO;
        }

        if ("COD".equalsIgnoreCase(request.getPaymentMethod()) && totalAmount.compareTo(MAX_COD_THRESHOLD) > 0) {
            throw new IllegalArgumentException("Đơn hàng trên 5.000.000đ không áp dụng hình thức COD. Vui lòng thanh toán trực tuyến.");
        }

        String orderCode = generateUniqueOrderCode();

        Order order = Order.builder()
                .orderCode(orderCode)
                .userId(request.getUserId())
                .email(request.getEmail())
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .phone(request.getPhone())
                .province(request.getProvince())
                .district(request.getDistrict())
                .ward(request.getWard())
                .street(request.getStreet())
                .paymentMethod(request.getPaymentMethod())
                .paymentStatus(PaymentStatus.PENDING.name())
                .orderStatus(OrderStatus.PENDING.name())
                .subtotal(subtotal)
                .shippingFee(shippingFee)
                .discountAmount(discountAmount)
                .totalAmount(totalAmount)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        Order savedOrder = orderRepository.save(order);

        for (OrderItem item : orderItems) {
            item.setOrder(savedOrder);
            orderItemRepository.save(item);
        }

        emailService.sendOrderConfirmationEmail(savedOrder.getEmail(), savedOrder.getOrderCode(), savedOrder.getTotalAmount().toString());

        return savedOrder;
    }

    @Transactional
    public Order confirmPayment(Integer orderId) {
        Order order = getOrderById(orderId);
        order.setPaymentStatus(PaymentStatus.PAID.name());
        order.setOrderStatus(OrderStatus.CONFIRMED.name());
        order.setUpdatedAt(LocalDateTime.now());
        return orderRepository.save(order);
    }

    @Scheduled(fixedDelay = 900000)
    @Transactional
    public void cancelUnpaidOrders() {
        LocalDateTime threshold = LocalDateTime.now().minusHours(24);

        List<Order> unpaidTransferOrders = orderRepository
                .findByPaymentStatusAndPaymentMethodAndCreatedAtBefore(PaymentStatus.PENDING.name(), "TRANSFER", threshold);

        List<Order> unpaidMomoOrders = orderRepository
                .findByPaymentStatusAndPaymentMethodAndCreatedAtBefore(PaymentStatus.PENDING.name(), "MOMO", threshold);

        List<Order> toCancel = new ArrayList<>();
        toCancel.addAll(unpaidTransferOrders);
        toCancel.addAll(unpaidMomoOrders);

        for (Order order : toCancel) {
            order.setOrderStatus(OrderStatus.CANCELLED.name());
            order.setUpdatedAt(LocalDateTime.now());
            orderRepository.save(order);

            List<OrderItem> items = orderItemRepository.findByOrderOrderId(order.getOrderId());
            for (OrderItem item : items) {
                ProductVariant variant = productVariantRepository.findById(item.getProductVariant().getVariantId()).orElse(null);
                if (variant != null) {
                    variant.setVariantStock(variant.getVariantStock() + item.getQuantity());
                    variant.setSoldCount(Math.max(0, variant.getSoldCount() - item.getQuantity()));
                    productVariantRepository.save(variant);
                }
            }
            log.info("Auto-cancelled unpaid order: {} and restored variant stock.", order.getOrderCode());
        }
    }

    @Transactional(readOnly = true)
    public Order getOrderById(Integer orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy đơn hàng với ID: " + orderId));
    }

    @Transactional(readOnly = true)
    public List<Order> getOrdersByEmail(String email) {
        return orderRepository.findByEmailOrderByCreatedAtDesc(email);
    }

    @Transactional
    public List<Order> getOrdersByUserId(String userId, String email) {
        if (userId == null || userId.trim().isEmpty()) {
            return Collections.emptyList();
        }
        if (email != null && !email.trim().isEmpty()) {
            List<Order> legacyOrders = orderRepository.findByEmailAndUserIdIsNull(email);
            if (!legacyOrders.isEmpty()) {
                for (Order legacy : legacyOrders) {
                    legacy.setUserId(userId);
                    orderRepository.save(legacy);
                }
            }
        }
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    @Transactional
    public Order cancelOrder(Integer orderId) {
        Order order = getOrderById(orderId);
        String status = (order.getOrderStatus() != null ? order.getOrderStatus() : "").toUpperCase();
        String payment = (order.getPaymentStatus() != null ? order.getPaymentStatus() : "").toUpperCase();

        if (OrderStatus.SHIPPING.name().equals(status) || OrderStatus.TRANSIT.name().equals(status) || OrderStatus.DELIVERED.name().equals(status)) {
            throw new IllegalArgumentException("Đơn hàng đang được vận chuyển hoặc đã giao thành công, không thể hủy!");
        }
        if (PaymentStatus.PAID.name().equals(payment)) {
            throw new IllegalArgumentException("Đơn hàng đã được thanh toán thành công, không thể hủy!");
        }

        order.setOrderStatus(OrderStatus.CANCELLED.name());
        order.setUpdatedAt(LocalDateTime.now());
        Order savedOrder = orderRepository.save(order);

        List<OrderItem> items = orderItemRepository.findByOrderOrderId(order.getOrderId());
        for (OrderItem item : items) {
            ProductVariant variant = productVariantRepository.findById(item.getProductVariant().getVariantId()).orElse(null);
            if (variant != null) {
                variant.setVariantStock(variant.getVariantStock() + item.getQuantity());
                variant.setSoldCount(Math.max(0, variant.getSoldCount() - item.getQuantity()));
                productVariantRepository.save(variant);
            }
        }
        return savedOrder;
    }

    private String generateUniqueOrderCode() {
        Random random = new Random();
        while (true) {
            String code = "US" + (100000 + random.nextInt(900000));
            if (orderRepository.findByOrderCode(code).isEmpty()) {
                return code;
            }
        }
    }
}
