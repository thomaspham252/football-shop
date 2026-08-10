package com.footballstore.backend.modules.order.models;

import lombok.Getter;

@Getter
public enum OrderStatus {
    PENDING("Chờ xử lý"),
    CONFIRMED("Đã xác nhận"),
    SHIPPING("Đang giao hàng"),
    TRANSIT("Đang vận chuyển"),
    DELIVERED("Giao hàng thành công"),
    COMPLETED("Hoàn thành"),
    CANCELLED("Đã hủy");

    private final String description;

    OrderStatus(String description) {
        this.description = description;
    }
}
