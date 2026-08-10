package com.footballstore.backend.modules.order.dtos;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateOrderRequest {
    @NotEmpty(message = "Danh sách sản phẩm trong giỏ hàng không được để trống")
    @Valid
    private List<CartItemDto> items;

    private String userId;

    @Email(message = "Địa chỉ email không đúng định dạng")
    @NotEmpty(message = "Địa chỉ email là bắt buộc")
    private String email;

    private String firstName;
    private String lastName;

    @NotEmpty(message = "Số điện thoại là bắt buộc")
    private String phone;

    private String province;
    private String district;
    private String ward;
    private String street;

    @NotNull(message = "Phương thức thanh toán là bắt buộc")
    private String paymentMethod; // COD, TRANSFER, MOMO

    private String couponCode;
}
