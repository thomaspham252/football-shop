package com.footballstore.backend.modules.admin.dtos;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UpdateOrderStatusRequest {
    @NotBlank(message = "Trạng thái đơn hàng không được để trống")
    private String orderStatus;
    
    private String paymentStatus;
    private String note;
}
