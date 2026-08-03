package com.footballstore.backend.modules.order.controllers;

import com.footballstore.backend.modules.order.dtos.CreateOrderRequest;
import com.footballstore.backend.modules.order.dtos.MomoPaymentResponse;
import com.footballstore.backend.modules.order.dtos.ValidateCartRequest;
import com.footballstore.backend.modules.order.dtos.ValidateCartResponse;
import com.footballstore.backend.modules.order.models.Order;
import com.footballstore.backend.modules.order.services.MomoService;
import com.footballstore.backend.modules.order.services.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;
    private final MomoService momoService;

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

    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable Integer id) {
        try {
            return ResponseEntity.ok(orderService.getOrderById(id));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{id}/payment")
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

    @PatchMapping("/admin/{id}/confirm-payment")
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
}
