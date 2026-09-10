package com.footballstore.backend.modules.order.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.footballstore.backend.modules.order.dtos.SepayWebhookRequest;
import com.footballstore.backend.modules.order.models.Order;
import com.footballstore.backend.modules.order.models.PaymentTransaction;
import com.footballstore.backend.modules.order.repositories.OrderRepository;
import com.footballstore.backend.modules.order.repositories.PaymentTransactionRepository;
import com.footballstore.backend.modules.order.services.OrderService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@RestController
@RequestMapping("/api/webhooks")
@RequiredArgsConstructor
public class WebhookController {
    private static final Logger log = LoggerFactory.getLogger(WebhookController.class);

    private final OrderRepository orderRepository;
    private final PaymentTransactionRepository paymentTransactionRepository;
    private final OrderService orderService;

    @org.springframework.beans.factory.annotation.Value("${sepay.api-key:linhpro2004}")
    private String sepayApiKey;

    @PostMapping("/sepay")
    public ResponseEntity<?> receiveSepayWebhook(
            @RequestHeader(value = "Authorization", required = false) String authorization,
            @RequestBody SepayWebhookRequest request) {
        
        log.info("Received SePay webhook request: {}", request);

        // 0. Authenticate Webhook
        if (authorization == null || !authorization.contains(sepayApiKey)) {
            log.warn("Unauthorized webhook request. Authorization header: {}", authorization);
            return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));
        }

        // 1. Kiểm tra loại giao dịch: chỉ xử lý tiền vào (in)
        if (!"in".equalsIgnoreCase(request.getTransferType())) {
            log.info("Ignoring transferType = out. ID: {}", request.getId());
            return ResponseEntity.ok().build();
        }

        // 2. Kiểm tra Idempotent (chống trùng lặp theo ID giao dịch của SePay)
        String requestId = "SEPAY_" + request.getId();
        if (paymentTransactionRepository.findByRequestId(requestId).isPresent()) {
            log.info("SePay request ID {} already processed.", requestId);
            return ResponseEntity.ok().build();
        }

        // 3. Trích xuất mã đơn hàng từ nội dung chuyển khoản
        // Order codes follow the pattern USXXXXXX where X is a digit
        String orderCode = extractOrderCode(request.getContent());
        if (orderCode == null && request.getCode() != null) {
            orderCode = request.getCode();
        }

        if (orderCode == null) {
            log.warn("Could not extract order code from content: {}", request.getContent());
            return ResponseEntity.ok(Map.of("message", "No matching order code found"));
        }

        // 4. Tìm đơn hàng
        Order order = orderRepository.findByOrderCode(orderCode).orElse(null);
        if (order == null) {
            log.warn("Order Code {} not found in system!", orderCode);
            return ResponseEntity.ok(Map.of("message", "Order not found")); // Trả về 200 để SePay không retry lại mãi
        }

        // 5. Ghi nhận giao dịch vào CSDL
        try {
            ObjectMapper mapper = new ObjectMapper();
            String rawJson = mapper.writeValueAsString(request);

            PaymentTransaction transaction = PaymentTransaction.builder()
                    .order(order)
                    .partnerCode("SEPAY")
                    .requestId(requestId)
                    .amount(request.getTransferAmount())
                    .momoTransId(request.getReferenceCode()) // Lưu reference code vào cột tương tự
                    .resultCode(0)
                    .message(request.getGateway() + " - " + request.getAccountNumber())
                    .rawPayload(rawJson)
                    .createdAt(LocalDateTime.now())
                    .build();

            paymentTransactionRepository.save(transaction);
        } catch (Exception e) {
            log.error("Failed to serialize or save PaymentTransaction log", e);
        }

        // 6. Kiểm tra số tiền và cập nhật trạng thái đơn hàng
        BigDecimal amountPaid = request.getTransferAmount();
        BigDecimal expectedAmount = order.getTotalAmount();
        
        // Chấp nhận thanh toán nếu số tiền >= tổng đơn hàng (có thể kiểm tra độ lệch nếu cần)
        if (amountPaid.compareTo(expectedAmount) >= 0) {
            orderService.confirmPayment(order.getOrderId());
            log.info("Order {} successfully paid via SePay bank transfer. Ref: {}", order.getOrderCode(), request.getReferenceCode());
        } else {
            log.warn("Order {} received partial payment: {} / {}", order.getOrderCode(), amountPaid, expectedAmount);
            // Bạn có thể xử lý trạng thái thanh toán 1 phần tại đây nếu hệ thống hỗ trợ
        }

        return ResponseEntity.ok(Map.of("success", true, "message", "Webhook processed"));
    }

    private String extractOrderCode(String content) {
        if (content == null) return null;
        // Tìm pattern US theo sau là 6 chữ số
        Pattern pattern = Pattern.compile("(US\\d{6})", Pattern.CASE_INSENSITIVE);
        Matcher matcher = pattern.matcher(content);
        if (matcher.find()) {
            return matcher.group(1).toUpperCase();
        }
        return null;
    }
}
