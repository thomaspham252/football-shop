package com.footballstore.backend.modules.order.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.footballstore.backend.modules.order.dtos.MomoIPNRequest;
import com.footballstore.backend.modules.order.models.Order;
import com.footballstore.backend.modules.order.models.PaymentTransaction;
import com.footballstore.backend.modules.order.repositories.OrderRepository;
import com.footballstore.backend.modules.order.repositories.PaymentTransactionRepository;
import com.footballstore.backend.modules.order.services.MomoService;
import com.footballstore.backend.modules.order.services.OrderService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/webhooks")
@RequiredArgsConstructor
public class WebhookController {
    private static final Logger log = LoggerFactory.getLogger(WebhookController.class);

    private final MomoService momoService;
    private final OrderRepository orderRepository;
    private final PaymentTransactionRepository paymentTransactionRepository;
    private final OrderService orderService;

    @PostMapping("/momo")
    public ResponseEntity<?> receiveMomoIPN(@RequestBody MomoIPNRequest request) {
        log.info("Received Momo IPN callback request: {}", request);

        // 1. Ghi log transaction trước khi xử lý
        log.info("Auditing Momo webhook request transaction ID: {}", request.getTransId());

        // 2. Verify signature
        if (!momoService.verifySignature(request)) {
            log.warn("Invalid signature in Momo IPN callback!");
            return ResponseEntity.badRequest().body("Chữ ký không hợp lệ");
        }

        // 3. Bảo đảm tính Idempotent (check trùng lặp requestId)
        if (paymentTransactionRepository.findByRequestId(request.getRequestId()).isPresent()) {
            log.info("Momo IPN callback request ID {} already processed.", request.getRequestId());
            return ResponseEntity.ok().build(); // Trả về 200 OK ngay để tránh xử lý lặp lại
        }

        // Tìm đơn hàng tương ứng
        Order order = orderRepository.findByOrderCode(request.getOrderId()).orElse(null);
        if (order == null) {
            log.warn("Order Code {} not found in system!", request.getOrderId());
            return ResponseEntity.badRequest().body("Đơn hàng không tồn tại");
        }

        // Ghi transaction log
        try {
            ObjectMapper mapper = new ObjectMapper();
            String rawJson = mapper.writeValueAsString(request);

            PaymentTransaction transaction = PaymentTransaction.builder()
                    .order(order)
                    .partnerCode(request.getPartnerCode())
                    .requestId(request.getRequestId())
                    .amount(BigDecimal.valueOf(request.getAmount()))
                    .momoTransId(String.valueOf(request.getTransId()))
                    .resultCode(request.getResultCode())
                    .message(request.getMessage())
                    .rawPayload(rawJson)
                    .createdAt(LocalDateTime.now())
                    .build();

            paymentTransactionRepository.save(transaction);
        } catch (Exception e) {
            log.error("Failed to serialize or save PaymentTransaction log", e);
        }

        // Cập nhật trạng thái đơn hàng nếu giao dịch thành công (resultCode = 0)
        if (request.getResultCode() == 0) {
            orderService.confirmPayment(order.getOrderId());
            log.info("Order {} successfully paid via Momo. Trans ID: {}", order.getOrderCode(), request.getTransId());
        } else {
            log.warn("Momo payment failed for order {} with code: {}", order.getOrderCode(), request.getResultCode());
        }

        return ResponseEntity.ok().build();
    }
}
