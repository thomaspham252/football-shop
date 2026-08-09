package com.footballstore.backend.modules.order.repositories;

import com.footballstore.backend.modules.order.models.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer> {
    Optional<Order> findByOrderCode(String orderCode);
    List<Order> findByPaymentStatusAndPaymentMethodAndCreatedAtBefore(
            String paymentStatus, String paymentMethod, LocalDateTime dateTime);
    List<Order> findByEmailOrderByCreatedAtDesc(String email);
    List<Order> findByUserIdOrderByCreatedAtDesc(String userId);
    List<Order> findByEmailAndUserIdIsNull(String email);

    // Tim kiem va loc don hang cho Admin/Staff voi countQuery rieng biet va CAST kieu cho PostgreSQL
    @Query(
        value = "SELECT o FROM Order o WHERE " +
                "(CAST(:status AS string) IS NULL OR UPPER(o.orderStatus) = CAST(:status AS string)) AND " +
                "(CAST(:paymentStatus AS string) IS NULL OR UPPER(o.paymentStatus) = CAST(:paymentStatus AS string)) AND " +
                "(CAST(:keyword AS string) IS NULL OR " +
                " LOWER(o.orderCode) LIKE CAST(:keyword AS string) OR " +
                " LOWER(o.email) LIKE CAST(:keyword AS string) OR " +
                " LOWER(o.firstName) LIKE CAST(:keyword AS string) OR " +
                " LOWER(o.lastName) LIKE CAST(:keyword AS string) OR " +
                " LOWER(o.phone) LIKE CAST(:keyword AS string))",
        countQuery = "SELECT COUNT(o) FROM Order o WHERE " +
                "(CAST(:status AS string) IS NULL OR UPPER(o.orderStatus) = CAST(:status AS string)) AND " +
                "(CAST(:paymentStatus AS string) IS NULL OR UPPER(o.paymentStatus) = CAST(:paymentStatus AS string)) AND " +
                "(CAST(:keyword AS string) IS NULL OR " +
                " LOWER(o.orderCode) LIKE CAST(:keyword AS string) OR " +
                " LOWER(o.email) LIKE CAST(:keyword AS string) OR " +
                " LOWER(o.firstName) LIKE CAST(:keyword AS string) OR " +
                " LOWER(o.lastName) LIKE CAST(:keyword AS string) OR " +
                " LOWER(o.phone) LIKE CAST(:keyword AS string))"
    )
    Page<Order> searchAdminOrders(
            @Param("status") String status,
            @Param("paymentStatus") String paymentStatus,
            @Param("keyword") String keyword,
            Pageable pageable
    );

    // Tong doanh thu cac don hang da thanh toan hoac da giao hang thanh cong
    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o WHERE UPPER(o.paymentStatus) = 'PAID' OR UPPER(o.orderStatus) = 'DELIVERED'")
    BigDecimal calculateTotalRevenue();

    // Dem so don hang theo trang thai don hang
    long countByOrderStatusIgnoreCase(String orderStatus);

    // Dem so don hang theo trang thai thanh toan
    long countByPaymentStatusIgnoreCase(String paymentStatus);

    // Lay danh sach N don hang gan nhat
    List<Order> findTop10ByOrderByCreatedAtDesc();
}
