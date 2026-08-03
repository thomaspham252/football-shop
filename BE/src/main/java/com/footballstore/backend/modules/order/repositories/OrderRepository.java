package com.footballstore.backend.modules.order.repositories;

import com.footballstore.backend.modules.order.models.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer> {
    Optional<Order> findByOrderCode(String orderCode);
    List<Order> findByPaymentStatusAndPaymentMethodAndCreatedAtBefore(
            String paymentStatus, String paymentMethod, LocalDateTime dateTime);
}
