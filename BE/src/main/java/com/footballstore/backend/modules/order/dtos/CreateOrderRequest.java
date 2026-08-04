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
    @NotEmpty(message = "Cart items cannot be empty")
    @Valid
    private List<CartItemDto> items;

    private String userId;

    @Email(message = "Invalid email address")
    @NotEmpty(message = "Email is required")
    private String email;

    private String firstName;
    private String lastName;

    @NotEmpty(message = "Phone number is required")
    private String phone;

    private String province;
    private String district;
    private String ward;
    private String street;

    @NotNull(message = "Payment method is required")
    private String paymentMethod; // COD, TRANSFER, MOMO

    private String couponCode;
}
