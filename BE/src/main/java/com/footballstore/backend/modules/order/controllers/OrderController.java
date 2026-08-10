package com.footballstore.backend.modules.order.controllers;

import com.footballstore.backend.modules.auth.models.User;
import com.footballstore.backend.modules.auth.services.AuthService;
import com.footballstore.backend.modules.order.dtos.CreateOrderRequest;
import com.footballstore.backend.modules.order.dtos.MomoPaymentResponse;
import com.footballstore.backend.modules.order.dtos.ValidateCartRequest;
import com.footballstore.backend.modules.order.dtos.ValidateCartResponse;
import com.footballstore.backend.modules.order.models.Order;
import com.footballstore.backend.modules.order.services.MomoService;
import com.footballstore.backend.modules.order.services.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;
    private final MomoService momoService;
    private final AuthService authService;

    @PostMapping("/cart/validate")
    public ResponseEntity<ValidateCartResponse> validateCart(@Valid @RequestBody ValidateCartRequest request) {
        return ResponseEntity.ok(orderService.validateCart(request));
    }

    @PostMapping
    public ResponseEntity<?> createOrder(@Valid @RequestBody CreateOrderRequest request) {
        try {
            Order order = orderService.createOrder(request);
            return ResponseEntity.ok(order);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/my-orders")
    public ResponseEntity<?> getMyOrders(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        String userId = authService.extractUserIdFromToken(authHeader);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Yêu cầu cung cấp mã xác thực!"));
        }
        try {
            User user = authService.getUserById(userId);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Không tìm thấy người dùng!"));
            }
            List<Order> orders = orderService.getOrdersByUserId(user.getId(), user.getEmail());
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Mã xác thực không hợp lệ!"));
        }
    }

    @GetMapping("/{id:\\d+}")
    public ResponseEntity<Order> getOrderById(@PathVariable Integer id) {
        try {
            return ResponseEntity.ok(orderService.getOrderById(id));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{id:\\d+}/payment")
    public ResponseEntity<?> initiatePayment(@PathVariable Integer id) {
        try {
            Order order = orderService.getOrderById(id);
            if ("MOMO".equalsIgnoreCase(order.getPaymentMethod())) {
                MomoPaymentResponse momoResponse = momoService.createPayment(
                        order.getOrderCode(),
                        order.getTotalAmount().longValue(),
                        "Thanh toan don hang " + order.getOrderCode() + " tai ULTRASPORT"
                );
                return ResponseEntity.ok(momoResponse);
            } else if ("TRANSFER".equalsIgnoreCase(order.getPaymentMethod())) {
                Map<String, Object> bankInfo = new HashMap<>();
                bankInfo.put("paymentMethod", "TRANSFER");
                bankInfo.put("bankName", "MB Bank (Ngân hàng Quân Đội)");
                bankInfo.put("accountNumber", "0999888777666");
                bankInfo.put("accountHolder", "CONG TY TNHH ULTRASPORT");
                bankInfo.put("amount", order.getTotalAmount());
                bankInfo.put("orderCode", order.getOrderCode());
                return ResponseEntity.ok(bankInfo);
            } else {
                return ResponseEntity.ok(Map.of(
                        "paymentMethod", "COD",
                        "message", "Thanh toán khi nhận hàng. Không cần cổng thanh toán."
                ));
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PatchMapping("/admin/{id:\\d+}/confirm-payment")
    public ResponseEntity<?> confirmPayment(@PathVariable Integer id) {
        try {
            Order order = orderService.confirmPayment(id);
            return ResponseEntity.ok(order);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/{id:\\d+}/cancel")
    public ResponseEntity<?> cancelOrder(@PathVariable Integer id) {
        try {
            Order order = orderService.cancelOrder(id);
            return ResponseEntity.ok(order);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
