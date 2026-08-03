package com.footballstore.backend.modules.order.services;

import com.footballstore.backend.modules.order.dtos.CartItemDto;
import com.footballstore.backend.modules.order.dtos.CreateOrderRequest;
import com.footballstore.backend.modules.order.dtos.ValidateCartRequest;
import com.footballstore.backend.modules.order.dtos.ValidateCartResponse;
import com.footballstore.backend.modules.order.models.Coupon;
import com.footballstore.backend.modules.order.models.Order;
import com.footballstore.backend.modules.order.models.OrderItem;
import com.footballstore.backend.modules.order.repositories.CouponRepository;
import com.footballstore.backend.modules.order.repositories.OrderItemRepository;
import com.footballstore.backend.modules.order.repositories.OrderRepository;
import com.footballstore.backend.modules.product.models.ProductVariant;
import com.footballstore.backend.modules.product.repositories.ProductVariantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final ProductVariantRepository productVariantRepository;
    private final CouponRepository couponRepository;
    private final CouponService couponService;
    private final EmailService emailService;

    public ValidateCartResponse validateCart(ValidateCartRequest request) {
        List<String> errors = new ArrayList<>();
        BigDecimal subtotal = BigDecimal.ZERO;

        for (CartItemDto item : request.getItems()) {
            ProductVariant variant = productVariantRepository.findById(item.getVariantId()).orElse(null);
            if (variant == null) {
                errors.add("Phiên bản sản phẩm ID " + item.getVariantId() + " không tồn tại.");
                continue;
            }
            if (variant.getVariantStock() < item.getQty()) {
                errors.add("Sản phẩm " + variant.getProduct().getProductName() + " (Màu: " + variant.getColor() + ", Size: " + variant.getSize() + ") không đủ hàng trong kho (Còn lại: " + variant.getVariantStock() + ").");
            }
            BigDecimal itemPrice = variant.getVariantPrice() != null ? variant.getVariantPrice() : variant.getProduct().getSalePrice();
            if (itemPrice == null) {
                itemPrice = variant.getProduct().getBasePrice();
            }
            subtotal = subtotal.add(itemPrice.multiply(BigDecimal.valueOf(item.getQty())));
        }

        BigDecimal shippingFee = subtotal.compareTo(BigDecimal.valueOf(500000)) >= 0 ? BigDecimal.ZERO : BigDecimal.valueOf(40000);
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

        // 1. Kiểm tra & Giảm tồn kho (Pessimistic Locking)
        for (CartItemDto item : request.getItems()) {
            ProductVariant variant = productVariantRepository.findForUpdateByVariantId(item.getVariantId())
                    .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy phiên bản sản phẩm với ID: " + item.getVariantId()));

            if (variant.getVariantStock() < item.getQty()) {
                throw new IllegalArgumentException("Sản phẩm " + variant.getProduct().getProductName() + " (Màu: " + variant.getColor() + ", Size: " + variant.getSize() + ") không đủ số lượng trong kho.");
            }

            // Giảm tồn kho
            variant.setVariantStock(variant.getVariantStock() - item.getQty());
            variant.setSoldCount(variant.getSoldCount() + item.getQty());
            productVariantRepository.save(variant);

            BigDecimal itemPrice = variant.getVariantPrice() != null ? variant.getVariantPrice() : variant.getProduct().getSalePrice();
            if (itemPrice == null) {
                itemPrice = variant.getProduct().getBasePrice();
            }

            subtotal = subtotal.add(itemPrice.multiply(BigDecimal.valueOf(item.getQty())));

            OrderItem orderItem = OrderItem.builder()
                    .product(variant.getProduct())
                    .productVariant(variant)
                    .quantity(item.getQty())
                    .price(itemPrice)
                    .color(variant.getColor())
                    .size(variant.getSize())
                    .build();

            orderItems.add(orderItem);
        }

        // 2. Tính toán phí ship & giảm giá
        BigDecimal shippingFee = subtotal.compareTo(BigDecimal.valueOf(500000)) >= 0 ? BigDecimal.ZERO : BigDecimal.valueOf(40000);
        BigDecimal discountAmount = BigDecimal.ZERO;

        if (request.getCouponCode() != null && !request.getCouponCode().trim().isEmpty()) {
            try {
                Coupon coupon = couponService.validateAndGetCoupon(request.getCouponCode(), subtotal);
                discountAmount = couponService.calculateDiscount(coupon, subtotal);
                coupon.setUsedCount(coupon.getUsedCount() + 1);
                couponRepository.save(coupon);
            } catch (Exception e) {
                // Nếu coupon không hợp lệ, ta bỏ qua hoặc ném lỗi tùy nghiệp vụ. Ở đây ta ném lỗi để khách hàng biết.
                throw new IllegalArgumentException(e.getMessage());
            }
        }

        BigDecimal totalAmount = subtotal.add(shippingFee).subtract(discountAmount);
        if (totalAmount.compareTo(BigDecimal.ZERO) < 0) {
            totalAmount = BigDecimal.ZERO;
        }

        // Kiểm tra chặn COD đơn hàng > 5 triệu
        if ("COD".equalsIgnoreCase(request.getPaymentMethod()) && totalAmount.compareTo(BigDecimal.valueOf(5000000)) > 0) {
            throw new IllegalArgumentException("Đơn hàng trên 5.000.000đ không áp dụng hình thức COD. Vui lòng thanh toán trực tuyến.");
        }

        // 3. Tạo orderCode duy nhất
        String orderCode = generateUniqueOrderCode();

        Order order = Order.builder()
                .orderCode(orderCode)
                .email(request.getEmail())
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .phone(request.getPhone())
                .province(request.getProvince())
                .district(request.getDistrict())
                .ward(request.getWard())
                .street(request.getStreet())
                .paymentMethod(request.getPaymentMethod())
                .paymentStatus("PENDING")
                .orderStatus("PENDING")
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

        // Gửi email xác nhận đơn hàng không đồng bộ (Asynchronous Background Job)
        emailService.sendOrderConfirmationEmail(savedOrder.getEmail(), savedOrder.getOrderCode(), savedOrder.getTotalAmount().toString());

        return savedOrder;
    }

    @Transactional
    public Order confirmPayment(Integer orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy đơn hàng với ID: " + orderId));
        order.setPaymentStatus("PAID");
        order.setOrderStatus("PROCESSING");
        order.setUpdatedAt(LocalDateTime.now());
        return orderRepository.save(order);
    }

    // Tự động hủy đơn hàng quá 24h chưa thanh toán (chạy mỗi 15 phút)
    @Scheduled(fixedDelay = 900000)
    @Transactional
    public void cancelUnpaidOrders() {
        LocalDateTime threshold = LocalDateTime.now().minusHours(24);
        
        // Hủy đơn Chuyển khoản chưa trả tiền
        List<Order> unpaidTransferOrders = orderRepository
                .findByPaymentStatusAndPaymentMethodAndCreatedAtBefore("PENDING", "TRANSFER", threshold);
        
        // Hủy đơn Momo chưa trả tiền
        List<Order> unpaidMomoOrders = orderRepository
                .findByPaymentStatusAndPaymentMethodAndCreatedAtBefore("PENDING", "MOMO", threshold);

        List<Order> toCancel = new ArrayList<>();
        toCancel.addAll(unpaidTransferOrders);
        toCancel.addAll(unpaidMomoOrders);

        for (Order order : toCancel) {
            order.setOrderStatus("CANCELLED");
            order.setUpdatedAt(LocalDateTime.now());
            orderRepository.save(order);

            // Hoàn lại tồn kho
            List<OrderItem> items = orderItemRepository.findByOrderOrderId(order.getOrderId());
            for (OrderItem item : items) {
                ProductVariant variant = productVariantRepository.findById(item.getProductVariant().getVariantId()).orElse(null);
                if (variant != null) {
                    variant.setVariantStock(variant.getVariantStock() + item.getQuantity());
                    variant.setSoldCount(Math.max(0, variant.getSoldCount() - item.getQuantity()));
                    productVariantRepository.save(variant);
                }
            }
            System.out.println("Auto-cancelled unpaid order: " + order.getOrderCode() + " and restored variant stock.");
        }
    }

    public Order getOrderById(Integer orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy đơn hàng với ID: " + orderId));
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
