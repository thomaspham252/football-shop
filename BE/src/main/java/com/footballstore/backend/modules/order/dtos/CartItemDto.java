package com.footballstore.backend.modules.order.dtos;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartItemDto {

    public static final int MAX_QUANTITY_PER_ITEM = 99;

    @NotNull(message = "Mã biến thể sản phẩm là bắt buộc")
    private Integer variantId;

    @NotNull(message = "Số lượng sản phẩm là bắt buộc")
    @Min(value = 1, message = "Số lượng tối thiểu phải từ 1 trở lên")
    @Max(value = MAX_QUANTITY_PER_ITEM, message = "Số lượng tối đa cho mỗi sản phẩm trong giỏ hàng là 99")
    private Integer quantity;
}
