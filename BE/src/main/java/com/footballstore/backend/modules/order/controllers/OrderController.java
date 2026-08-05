package com.footballstore.backend.modules.order.controllers;

import com.footballstore.backend.modules.order.dtos.CreateOrderRequest;
import com.footballstore.backend.modules.order.dtos.MomoPaymentResponse;
import com.footballstore.backend.modules.order.dtos.ValidateCartRequest;
import com.footballstore.backend.modules.order.dtos.ValidateCartResponse;
import com.footballstore.backend.modules.order.models.Order;
import com.footballstore.backend.modules.order.services.MomoService;
import com.footballstore.backend.modules.order.services.OrderService;
import com.footballstore.backend.modules.auth.services.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.List;

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
            Map<String, String> response = new HashMap<>();
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/my-orders")
    public ResponseEntity<?> getMyOrders(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        String userId = authService.extractUserIdFromToken(authHeader);
        if (userId == null) {
            return ResponseEntity.status(401).body(Map.of("message", "Yêu cầu cung cấp mã xác thực!"));
        }
        try {
            com.footballstore.backend.modules.auth.models.User user = authService.getUserById(userId);
            if (user == null) {
                return ResponseEntity.status(404).body(Map.of("message", "Không tìm thấy người dùng!"));
            }
            List<Order> orders = orderService.getOrdersByUserId(user.getId(), user.getEmail());
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of("message", "Mã xác thực không hợp lệ!"));
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
                Map<String, String> response = new HashMap<>();
                response.put("paymentMethod", "COD");
                response.put("message", "Thanh toán khi nhận hàng. Không cần cổng thanh toán.");
                return ResponseEntity.ok(response);
            }
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PatchMapping("/admin/{id:\\d+}/confirm-payment")
    public ResponseEntity<?> confirmPayment(@PathVariable Integer id) {
        try {
            Order order = orderService.confirmPayment(id);
            return ResponseEntity.ok(order);
        } catch (IllegalArgumentException e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/{id:\\d+}/cancel")
    public ResponseEntity<?> cancelOrder(@PathVariable Integer id) {
        try {
            Order order = orderService.cancelOrder(id);
            return ResponseEntity.ok(order);
        } catch (IllegalArgumentException e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}
