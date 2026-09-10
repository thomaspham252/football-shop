package com.footballstore.backend.modules.auth.models;

/**
 * Enum đại diện cho các Vai trò (Role) trong hệ thống e-commerce.
 * - ADMIN: Toàn quyền quản trị hệ thống.
 * - STAFF: Quản lý sản phẩm, tồn kho, xử lý và duyệt đơn hàng.
 * - CUSTOMER: Khách hàng mua sắm, xem giỏ hàng, lịch sử đơn hàng cá nhân.
 */
public enum Role {
    ROLE_ADMIN,
    ROLE_STAFF,
    ROLE_CUSTOMER,
}
