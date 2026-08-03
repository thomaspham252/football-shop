package com.footballstore.backend.modules.order.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    @Async
    public void sendOrderConfirmationEmail(String toEmail, String orderCode, String totalAmount) {
        log.info("Khởi tạo tiến trình gửi email xác nhận đến: {} | Mã đơn: {} | Tổng tiền: {}", toEmail, orderCode, totalAmount);
        try {
            // Giả lập độ trễ gửi email
            Thread.sleep(1500);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        log.info("✓ Email xác nhận đơn hàng {} đã được gửi thành công đến: {}", orderCode, toEmail);
    }
}
