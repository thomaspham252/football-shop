package com.footballstore.backend.modules.order.dtos;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApplyCouponResponse {
    private boolean valid;
    private String code;
    private BigDecimal discountAmount;
    private String message;
}
