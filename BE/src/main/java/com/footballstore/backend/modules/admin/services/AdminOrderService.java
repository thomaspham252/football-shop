package com.footballstore.backend.modules.admin.services;

import com.footballstore.backend.modules.admin.dtos.UpdateOrderStatusRequest;
import com.footballstore.backend.modules.order.models.Order;
import com.footballstore.backend.modules.order.models.OrderItem;
import com.footballstore.backend.modules.order.repositories.OrderItemRepository;
import com.footballstore.backend.modules.order.repositories.OrderRepository;
import com.footballstore.backend.modules.product.models.ProductVariant;
import com.footballstore.backend.modules.product.repositories.ProductVariantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminOrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final ProductVariantRepository productVariantRepository;

    @Transactional(readOnly = true)
    public Page<Order> searchOrders(String status, String paymentStatus, String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));

        String cleanStatus = (status != null && !status.trim().isEmpty() && !"ALL".equalsIgnoreCase(status)) 
                ? status.trim().toUpperCase() : null;

        String cleanPaymentStatus = (paymentStatus != null && !paymentStatus.trim().isEmpty() && !"ALL".equalsIgnoreCase(paymentStatus)) 
                ? paymentStatus.trim().toUpperCase() : null;

        String cleanKeyword = (keyword != null && !keyword.trim().isEmpty()) 
                ? "%" + keyword.trim().toLowerCase() + "%" : null;

        // Nếu không áp dụng bộ lọc nào (xem tất cả) -> Dùng hàm findAll chuẩn của Spring Data JPA (Đảm bảo 100% không lỗi)
        if (cleanStatus == null && cleanPaymentStatus == null && cleanKeyword == null) {
            return orderRepository.findAll(pageable);
        }

        return orderRepository.searchAdminOrders(cleanStatus, cleanPaymentStatus, cleanKeyword, pageable);
    }

    @Transactional(readOnly = true)
    public Order getOrderById(Integer orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy đơn hàng với mã ID: " + orderId));
    }

    @Transactional
    public Order updateOrderStatus(Integer orderId, UpdateOrderStatusRequest request) {
        Order order = getOrderById(orderId);
        String oldStatus = order.getOrderStatus();
        String newStatus = request.getOrderStatus().toUpperCase();

        order.setOrderStatus(newStatus);
        
        if (request.getPaymentStatus() != null && !request.getPaymentStatus().trim().isEmpty()) {
            order.setPaymentStatus(request.getPaymentStatus().toUpperCase());
        } else if ("DELIVERED".equalsIgnoreCase(newStatus)) {
            order.setPaymentStatus("PAID");
        }

        if ("CANCELLED".equalsIgnoreCase(newStatus) && !"CANCELLED".equalsIgnoreCase(oldStatus)) {
            restoreStockForCancelledOrder(order);
        }

        order.setUpdatedAt(LocalDateTime.now());
        return orderRepository.save(order);
    }

    @Transactional
    public Order updatePaymentStatus(Integer orderId, String paymentStatus) {
        Order order = getOrderById(orderId);
        order.setPaymentStatus(paymentStatus.toUpperCase());
        order.setUpdatedAt(LocalDateTime.now());
        return orderRepository.save(order);
    }

    @Transactional
    public Order cancelOrder(Integer orderId, String reason) {
        Order order = getOrderById(orderId);
        if ("CANCELLED".equalsIgnoreCase(order.getOrderStatus())) {
            throw new IllegalArgumentException("Đơn hàng này đã ở trạng thái ĐÃ HỦY trước đó!");
        }

        order.setOrderStatus("CANCELLED");
        order.setUpdatedAt(LocalDateTime.now());

        restoreStockForCancelledOrder(order);

        return orderRepository.save(order);
    }

    private void restoreStockForCancelledOrder(Order order) {
        List<OrderItem> items = orderItemRepository.findByOrderOrderId(order.getOrderId());
        for (OrderItem item : items) {
            if (item.getProductVariant() != null) {
                ProductVariant variant = productVariantRepository.findById(item.getProductVariant().getVariantId()).orElse(null);
                if (variant != null) {
                    variant.setVariantStock(variant.getVariantStock() + item.getQuantity());
                    variant.setSoldCount(Math.max(0, variant.getSoldCount() - item.getQuantity()));
                    productVariantRepository.save(variant);
                }
            }
        }
    }
}
