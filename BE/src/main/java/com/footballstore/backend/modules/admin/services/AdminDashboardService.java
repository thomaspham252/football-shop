package com.footballstore.backend.modules.admin.services;

import com.footballstore.backend.modules.admin.dtos.DashboardStatsDto;
import com.footballstore.backend.modules.auth.repositories.UserRepository;
import com.footballstore.backend.modules.order.models.Order;
import com.footballstore.backend.modules.order.models.OrderStatus;
import com.footballstore.backend.modules.order.models.PaymentStatus;
import com.footballstore.backend.modules.order.repositories.OrderRepository;
import com.footballstore.backend.modules.product.repositories.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminDashboardService {

    public static final int RECENT_ORDERS_LIMIT = 10;

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public DashboardStatsDto getDashboardStatistics() {
        BigDecimal totalRevenue = orderRepository.calculateTotalRevenue();
        if (totalRevenue == null) {
            totalRevenue = BigDecimal.ZERO;
        }

        long totalOrders = orderRepository.count();

        long pendingOrders = orderRepository.countByOrderStatusIgnoreCase(OrderStatus.PENDING.name());
        long processingOrders = orderRepository.countByOrderStatusIgnoreCase("PROCESSING");
        long shippedOrders = orderRepository.countByOrderStatusIgnoreCase(OrderStatus.SHIPPING.name());
        long completedOrders = orderRepository.countByOrderStatusIgnoreCase(OrderStatus.DELIVERED.name());
        long cancelledOrders = orderRepository.countByOrderStatusIgnoreCase(OrderStatus.CANCELLED.name());

        long totalProducts = productRepository.count();
        long totalUsers = userRepository.count();

        Map<String, Long> ordersByStatus = new HashMap<>();
        ordersByStatus.put(OrderStatus.PENDING.name(), pendingOrders);
        ordersByStatus.put("PROCESSING", processingOrders);
        ordersByStatus.put(OrderStatus.SHIPPING.name(), shippedOrders);
        ordersByStatus.put(OrderStatus.DELIVERED.name(), completedOrders);
        ordersByStatus.put(OrderStatus.CANCELLED.name(), cancelledOrders);

        Map<String, Long> paymentsByStatus = new HashMap<>();
        paymentsByStatus.put(PaymentStatus.PENDING.name(), orderRepository.countByPaymentStatusIgnoreCase(PaymentStatus.PENDING.name()));
        paymentsByStatus.put(PaymentStatus.PAID.name(), orderRepository.countByPaymentStatusIgnoreCase(PaymentStatus.PAID.name()));
        paymentsByStatus.put(PaymentStatus.FAILED.name(), orderRepository.countByPaymentStatusIgnoreCase(PaymentStatus.FAILED.name()));

        List<Order> recentOrders = orderRepository.findTop10ByOrderByCreatedAtDesc();

        List<Map<String, Object>> monthlyRevenue = calculateRecentMonthlyRevenue();

        return DashboardStatsDto.builder()
                .totalRevenue(totalRevenue)
                .totalOrders(totalOrders)
                .pendingOrders(pendingOrders)
                .processingOrders(processingOrders)
                .shippedOrders(shippedOrders)
                .completedOrders(completedOrders)
                .cancelledOrders(cancelledOrders)
                .totalProducts(totalProducts)
                .totalUsers(totalUsers)
                .ordersByStatus(ordersByStatus)
                .paymentsByStatus(paymentsByStatus)
                .recentOrders(recentOrders)
                .monthlyRevenue(monthlyRevenue)
                .build();
    }

    private List<Map<String, Object>> calculateRecentMonthlyRevenue() {
        List<Order> allOrders = orderRepository.findAll();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MM/yyyy");

        Map<String, BigDecimal> revenueMap = allOrders.stream()
                .filter(o -> o.getCreatedAt() != null)
                .filter(o -> !OrderStatus.CANCELLED.name().equalsIgnoreCase(o.getOrderStatus()))
                .filter(o -> PaymentStatus.PAID.name().equalsIgnoreCase(o.getPaymentStatus()) || OrderStatus.DELIVERED.name().equalsIgnoreCase(o.getOrderStatus()))
                .collect(Collectors.groupingBy(
                        o -> o.getCreatedAt().format(formatter),
                        Collectors.reducing(BigDecimal.ZERO, Order::getTotalAmount, BigDecimal::add)
                ));

        List<Map<String, Object>> result = new ArrayList<>();
        revenueMap.forEach((monthYear, total) -> {
            Map<String, Object> entry = new HashMap<>();
            entry.put("month", monthYear);
            entry.put("revenue", total);
            result.add(entry);
        });

        result.sort((a, b) -> ((String) a.get("month")).compareTo((String) b.get("month")));
        return result;
    }
}
