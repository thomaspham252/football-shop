package com.footballstore.backend.modules.order.services;

import com.footballstore.backend.modules.order.models.Coupon;
import com.footballstore.backend.modules.order.repositories.CouponRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

@Service
@RequiredArgsConstructor
public class CouponService {
    private final CouponRepository couponRepository;
    private final Map<String, List<Long>> rateLimitMap = new ConcurrentHashMap<>();

    public boolean isRateLimited(String ipAddress) {
        long now = System.currentTimeMillis();
        rateLimitMap.putIfAbsent(ipAddress, new CopyOnWriteArrayList<>());
        List<Long> timestamps = rateLimitMap.get(ipAddress);
        timestamps.removeIf(t -> now - t > 60000); // 1 minute window
        if (timestamps.size() >= 5) {
            return true;
        }
        timestamps.add(now);
        return false;
    }

    public Coupon validateAndGetCoupon(String code, BigDecimal subtotal) {
        Coupon coupon = couponRepository.findByCode(code.trim().toUpperCase())
                .orElseThrow(() -> new IllegalArgumentException("Mã giảm giá không tồn tại."));

        if (!coupon.getIsActive()) {
            throw new IllegalArgumentException("Mã giảm giá này hiện không còn hoạt động.");
        }

        if (coupon.getExpiryDate() != null && coupon.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Mã giảm giá đã hết hạn sử dụng.");
        }

        if (coupon.getUsageLimit() != null && coupon.getUsedCount() >= coupon.getUsageLimit()) {
            throw new IllegalArgumentException("Mã giảm giá đã hết số lần sử dụng.");
        }

        return coupon;
    }

    public BigDecimal calculateDiscount(Coupon coupon, BigDecimal subtotal) {
        BigDecimal discount = BigDecimal.ZERO;
        if (coupon.getDiscountPercentage() != null) {
            BigDecimal percentage = BigDecimal.valueOf(coupon.getDiscountPercentage())
                    .divide(BigDecimal.valueOf(100));
            discount = subtotal.multiply(percentage);
        }
        if (coupon.getMaxDiscountAmount() != null && discount.compareTo(coupon.getMaxDiscountAmount()) > 0) {
            discount = coupon.getMaxDiscountAmount();
        }
        return discount;
    }
}
