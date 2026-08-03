package com.footballstore.backend.modules.order.repositories;

import com.footballstore.backend.modules.order.models.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Integer> {
    List<OrderItem> findByOrderOrderId(Integer orderId);
}
