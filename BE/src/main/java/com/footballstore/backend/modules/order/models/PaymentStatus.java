package com.footballstore.backend.modules.order.models;

import lombok.Getter;

@Getter
public enum PaymentStatus {
    UNPAID("Chưa thanh toán"),
    PENDING("Chờ thanh toán"),
    PAID("Đã thanh toán"),
    FAILED("Thanh toán thất bại"),
    REFUNDED("Đã hoàn tiền");

    private final String description;

    PaymentStatus(String description) {
        this.description = description;
    }
}
