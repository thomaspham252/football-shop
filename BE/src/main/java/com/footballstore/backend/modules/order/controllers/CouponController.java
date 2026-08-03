package com.footballstore.backend.modules.order.controllers;

import com.footballstore.backend.modules.order.dtos.ApplyCouponRequest;
import com.footballstore.backend.modules.order.dtos.ApplyCouponResponse;
import com.footballstore.backend.modules.order.models.Coupon;
import com.footballstore.backend.modules.order.services.CouponService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/coupons")
@RequiredArgsConstructor
public class CouponController {
    private final CouponService couponService;

    @PostMapping("/apply")
    public ResponseEntity<ApplyCouponResponse> applyCoupon(
            @Valid @RequestBody ApplyCouponRequest request,
            HttpServletRequest httpServletRequest) {

        String clientIp = httpServletRequest.getHeader("X-Forwarded-For");
        if (clientIp == null || clientIp.isEmpty()) {
            clientIp = httpServletRequest.getRemoteAddr();
        }

        // Rate Limit check
        if (couponService.isRateLimited(clientIp)) {
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                    .body(ApplyCouponResponse.builder()
                            .valid(false)
                            .message("Quá nhiều yêu cầu thử mã giảm giá. Vui lòng thử lại sau 1 phút.")
                            .build());
        }

        try {
            Coupon coupon = couponService.validateAndGetCoupon(request.getCode(), request.getSubtotal());
            BigDecimal discount = couponService.calculateDiscount(coupon, request.getSubtotal());

            return ResponseEntity.ok(ApplyCouponResponse.builder()
                    .valid(true)
                    .code(coupon.getCode())
                    .discountAmount(discount)
                    .message("Áp dụng mã giảm giá thành công!")
                    .build());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.ok(ApplyCouponResponse.builder()
                    .valid(false)
                    .message(e.getMessage())
                    .build());
        }
    }
}
