package com.footballstore.backend.modules.admin.controllers;

import com.footballstore.backend.modules.admin.dtos.DashboardStatsDto;
import com.footballstore.backend.modules.admin.services.AdminDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/dashboard")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
public class AdminDashboardController {

    private final AdminDashboardService adminDashboardService;

    /**
     * API Lấy toàn bộ số liệu thống kê cho Admin Dashboard
     * Bao gồm: Doanh thu, Tổng số đơn hàng, Đơn hàng theo trạng thái, Khách hàng, Sản phẩm & Biểu đồ doanh thu.
     */
    @GetMapping
    public ResponseEntity<DashboardStatsDto> getDashboardStats() {
        DashboardStatsDto stats = adminDashboardService.getDashboardStatistics();
        return ResponseEntity.ok(stats);
    }
}
