package com.footballstore.backend.modules.order.dtos;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MomoPaymentResponse {
    private String partnerCode;
    private String orderId;
    private String requestId;
    private String payUrl;
    private int resultCode;
    private String message;
}
