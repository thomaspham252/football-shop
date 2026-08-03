package com.footballstore.backend.modules.order.dtos;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApplyCouponRequest {
    @NotEmpty(message = "Coupon code is required")
    private String code;

    @NotNull(message = "Subtotal is required")
    private BigDecimal subtotal;
}
