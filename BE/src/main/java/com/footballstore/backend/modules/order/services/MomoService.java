package com.footballstore.backend.modules.order.services;

import com.footballstore.backend.modules.order.dtos.MomoIPNRequest;
import com.footballstore.backend.modules.order.dtos.MomoPaymentResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

@Service
public class MomoService {
    @Value("${momo.partner-code:MOMOBKUN20180529}")
    private String partnerCode;

    @Value("${momo.access-key:klm05Bh5mEs15crK}")
    private String accessKey;

    @Value("${momo.secret-key:at1Rw5Bt1y450dgObHA15Qo1U1s05n5w}")
    private String secretKey;

    @Value("${momo.api-endpoint:https://test-payment.momo.vn/v2/gateway/api/create}")
    private String apiEndpoint;

    @Value("${momo.redirect-url:http://localhost:5173/dat-hang-thanh-cong}")
    private String redirectUrl;

    @Value("${momo.ipn-url:http://localhost:8080/api/webhooks/momo}")
    private String ipnUrl;

    public MomoPaymentResponse createPayment(String orderId, Long amount, String orderInfo) {
        String requestId = orderId + "_" + System.currentTimeMillis();
        String extraData = "";
        String requestType = "captureWallet";

        // Signature raw data
        String rawHash = "accessKey=" + accessKey +
                "&amount=" + amount +
                "&extraData=" + extraData +
                "&ipnUrl=" + ipnUrl +
                "&orderId=" + orderId +
                "&orderInfo=" + orderInfo +
                "&partnerCode=" + partnerCode +
                "&redirectUrl=" + redirectUrl +
                "&requestId=" + requestId +
                "&requestType=" + requestType;

        String signature = hmacSHA256(rawHash, secretKey);

        Map<String, Object> payload = new HashMap<>();
        payload.put("partnerCode", partnerCode);
        payload.put("partnerName", "ULTRASPORT");
        payload.put("storeId", "ULTRASPORT_STORE");
        payload.put("requestId", requestId);
        payload.put("amount", amount);
        payload.put("orderId", orderId);
        payload.put("orderInfo", orderInfo);
        payload.put("redirectUrl", redirectUrl);
        payload.put("ipnUrl", ipnUrl);
        payload.put("lang", "vi");
        payload.put("extraData", extraData);
        payload.put("requestType", requestType);
        payload.put("signature", signature);

        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(payload, headers);

        try {
            return restTemplate.postForObject(apiEndpoint, entity, MomoPaymentResponse.class);
        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi kết nối đến cổng thanh toán MoMo: " + e.getMessage(), e);
        }
    }

    public boolean verifySignature(MomoIPNRequest ipnRequest) {
        String rawHash = "accessKey=" + accessKey +
                "&amount=" + ipnRequest.getAmount() +
                "&extraData=" + (ipnRequest.getExtraData() != null ? ipnRequest.getExtraData() : "") +
                "&message=" + ipnRequest.getMessage() +
                "&orderId=" + ipnRequest.getOrderId() +
                "&orderInfo=" + ipnRequest.getOrderInfo() +
                "&partnerCode=" + ipnRequest.getPartnerCode() +
                "&requestId=" + ipnRequest.getRequestId() +
                "&responseTime=" + ipnRequest.getResponseTime() +
                "&resultCode=" + ipnRequest.getResultCode() +
                "&transId=" + ipnRequest.getTransId();

        String calculatedSignature = hmacSHA256(rawHash, secretKey);
        return calculatedSignature.equalsIgnoreCase(ipnRequest.getSignature());
    }

    private String hmacSHA256(String data, String key) {
        try {
            Mac sha256_HMAC = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKeySpec = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            sha256_HMAC.init(secretKeySpec);
            byte[] rawHmac = sha256_HMAC.doFinal(data.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();
            for (byte b : rawHmac) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (Exception e) {
            throw new RuntimeException("Thất bại khi tính chữ ký HMAC-SHA256", e);
        }
    }
}
