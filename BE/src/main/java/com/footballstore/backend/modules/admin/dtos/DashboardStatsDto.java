package com.footballstore.backend.modules.admin.dtos;

import com.footballstore.backend.modules.order.models.Order;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardStatsDto {
    private BigDecimal totalRevenue;
    private long totalOrders;
    private long pendingOrders;
    private long processingOrders;
    private long shippedOrders;
    private long completedOrders;
    private long cancelledOrders;
    private long totalProducts;
    private long totalUsers;
    
    private Map<String, Long> ordersByStatus;
    private Map<String, Long> paymentsByStatus;
    private List<Order> recentOrders;
    private List<Map<String, Object>> monthlyRevenue;
}
