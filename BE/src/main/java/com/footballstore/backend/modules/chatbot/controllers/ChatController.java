package com.footballstore.backend.modules.chatbot.controllers;

import com.footballstore.backend.modules.auth.models.User;
import com.footballstore.backend.modules.auth.services.AuthService;
import com.footballstore.backend.modules.chatbot.models.ChatMessage;
import com.footballstore.backend.modules.chatbot.repositories.ChatMessageRepository;
import com.footballstore.backend.modules.chatbot.services.GeminiService;
import com.footballstore.backend.modules.chatbot.services.PromptBuilderService;
import com.footballstore.backend.modules.product.dtos.response.ProductCardResponse;
import com.footballstore.backend.modules.product.models.Product;
import com.footballstore.backend.modules.product.repositories.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ChatController {

    private final PromptBuilderService promptBuilderService;
    private final GeminiService geminiService;
    private final ChatMessageRepository chatMessageRepository;
    private final ProductRepository productRepository;
    private final AuthService authService;

    @GetMapping("/history")
    public ResponseEntity<?> getChatHistory(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        String userId = authService.extractUserIdFromToken(authHeader);
        if (userId == null) {
            return ResponseEntity.status(401).body(Map.of("message", "Vui lòng đăng nhập để xem lịch sử chat!"));
        }
        User user = authService.getUserById(userId);
        if (user == null) {
            return ResponseEntity.status(401).body(Map.of("message", "Vui lòng đăng nhập lại!"));
        }
        List<ChatMessage> messages = chatMessageRepository.findByUserIdOrderByCreatedAtAsc(user.getId());
        List<ChatHistoryMessageResponse> history = messages.stream()
                .map(this::toChatHistoryMessageResponse)
                .toList();
        return ResponseEntity.ok(history);
    }

    @PostMapping
    public ResponseEntity<?> chat(
            @RequestBody Map<String, String> request,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        
        String userId = authService.extractUserIdFromToken(authHeader);
        if (userId == null) {
            return ResponseEntity.status(401).body(Map.of("message", "Vui lòng đăng nhập để sử dụng Trợ lý tư vấn AI!"));
        }
        User user = authService.getUserById(userId);
        if (user == null) {
            return ResponseEntity.status(401).body(Map.of("message", "Tài khoản không hợp lệ. Vui lòng đăng nhập lại!"));
        }

        String sessionId = request.get("sessionId");
        if (sessionId == null || sessionId.trim().isEmpty()) {
            sessionId = UUID.randomUUID().toString();
        }

        String userMessage = request.get("message");
        if (userMessage == null || userMessage.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of(
                    "reply", "Vui lòng nhập nội dung tin nhắn!",
                    "sessionId", sessionId,
                    "products", List.of()
            ));
        }

        String cleanMessage = userMessage.trim();
        saveMessage(sessionId, user.getId(), "user", cleanMessage);

        String prompt = promptBuilderService.buildPrompt(sessionId, user.getId(), cleanMessage);
        String rawResponse = geminiService.callGemini(prompt);
        String reply = geminiService.extractReply(rawResponse);
        List<Integer> productIds = geminiService.extractProductIds(rawResponse);

        List<ProductCardResponse> products = loadProductCards(productIds);
        saveMessage(
                sessionId,
                user.getId(),
                "assistant",
                reply,
                serializeProductIds(products.stream().map(ProductCardResponse::getProductId).toList())
        );

        return ResponseEntity.ok(Map.of(
                "reply", reply,
                "sessionId", sessionId,
                "products", products
        ));
    }

    private void saveMessage(String sessionId, String userId, String role, String content) {
        ChatMessage m = ChatMessage.builder()
                .sessionId(sessionId)
                .userId(userId)
                .role(role)
                .content(content)
                .build();
        chatMessageRepository.save(m);
    }

    private void saveMessage(String sessionId, String userId, String role, String content, String productIds) {
        ChatMessage m = ChatMessage.builder()
                .sessionId(sessionId)
                .userId(userId)
                .role(role)
                .content(content)
                .productIds(productIds)
                .build();
        chatMessageRepository.save(m);
    }

    private ChatHistoryMessageResponse toChatHistoryMessageResponse(ChatMessage message) {
        List<ProductCardResponse> products = "assistant".equalsIgnoreCase(message.getRole())
                ? loadProductCards(parseProductIds(message.getProductIds()))
                : List.of();

        return new ChatHistoryMessageResponse(
                message.getId(),
                message.getRole(),
                message.getContent(),
                message.getCreatedAt(),
                products
        );
    }

    private List<ProductCardResponse> loadProductCards(List<Integer> productIds) {
        if (productIds == null || productIds.isEmpty()) {
            return List.of();
        }

        Map<Integer, Product> productsById = productRepository.findAllById(productIds).stream()
                .collect(java.util.stream.Collectors.toMap(Product::getProductId, product -> product));

        return productIds.stream()
                .map(productsById::get)
                .filter(java.util.Objects::nonNull)
                .map(this::toProductCardResponse)
                .toList();
    }

    private String serializeProductIds(List<Integer> productIds) {
        if (productIds == null || productIds.isEmpty()) {
            return null;
        }
        return productIds.stream()
                .map(String::valueOf)
                .collect(java.util.stream.Collectors.joining(","));
    }

    private List<Integer> parseProductIds(String productIds) {
        if (productIds == null || productIds.trim().isEmpty()) {
            return List.of();
        }
        return Arrays.stream(productIds.split(","))
                .map(String::trim)
                .filter(s -> s.matches("\\d+"))
                .map(Integer::parseInt)
                .distinct()
                .toList();
    }

    private ProductCardResponse toProductCardResponse(Product product) {
        return ProductCardResponse.builder()
                .productId(product.getProductId())
                .productName(product.getProductName())
                .imageUrl(product.getImageUrl())
                .basePrice(product.getBasePrice())
                .salePrice(product.getSalePrice())
                .discountPercentage(product.getDiscountPercentage())
                .brandName(product.getBrand() != null ? product.getBrand().getBrandName() : "ULTRASPORT")
                .brandLogoUrl(product.getBrand() != null ? product.getBrand().getLogoUrl() : null)
                .categoryName(product.getCategory() != null ? product.getCategory().getCategoryName() : "Đồ thể thao")
                .categoryImageUrl(product.getCategory() != null ? product.getCategory().getImageUrl() : null)
                .build();
    }

    private record ChatHistoryMessageResponse(
            Long id,
            String role,
            String content,
            LocalDateTime createdAt,
            List<ProductCardResponse> products
    ) {
    }
}
