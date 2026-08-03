package com.footballstore.backend.modules.order.dtos;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ValidateCartRequest {
    @NotEmpty(message = "Cart items cannot be empty")
    @Valid
    private List<CartItemDto> items;
}
