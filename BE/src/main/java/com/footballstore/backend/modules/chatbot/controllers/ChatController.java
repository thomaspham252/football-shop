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
import com.footballstore.backend.modules.product.services.ProductService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ChatController {

    private final PromptBuilderService promptBuilderService;
    private final GeminiService geminiService;
    private final ChatMessageRepository chatMessageRepository;
    private final ProductRepository productRepository;
    private final ProductService productService;
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
        try {
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
        } catch (Exception e) {
            log.error("Lỗi khi xử lý hội thoại Chatbot AI: {}", e.getMessage(), e);
            return ResponseEntity.ok(Map.of(
                    "reply", "Xin lỗi bạn, hệ thống đang bận xử lý dữ liệu. Bạn vui lòng gửi lại câu hỏi nha!",
                    "sessionId", request.getOrDefault("sessionId", UUID.randomUUID().toString()),
                    "products", List.of()
            ));
        }
    }

    private void saveMessage(String sessionId, String userId, String role, String content) {
        try {
            ChatMessage m = ChatMessage.builder()
                    .sessionId(sessionId)
                    .userId(userId)
                    .role(role)
                    .content(content)
                    .build();
            chatMessageRepository.save(m);
        } catch (Exception e) {
            log.warn("Không thể lưu tin nhắn vào CSDL: {}", e.getMessage());
        }
    }

    private void saveMessage(String sessionId, String userId, String role, String content, String productIds) {
        try {
            ChatMessage m = ChatMessage.builder()
                    .sessionId(sessionId)
                    .userId(userId)
                    .role(role)
                    .content(content)
                    .productIds(productIds)
                    .build();
            chatMessageRepository.save(m);
        } catch (Exception e) {
            log.warn("Không thể lưu tin nhắn kèm product_ids vào CSDL: {}", e.getMessage());
        }
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

        try {
            List<Integer> distinctIds = productIds.stream().distinct().toList();
            Map<Integer, Product> productsById = productRepository.findAllById(distinctIds).stream()
                    .collect(java.util.stream.Collectors.toMap(Product::getProductId, product -> product, (existing, replacement) -> existing));

            return distinctIds.stream()
                    .map(productsById::get)
                    .filter(java.util.Objects::nonNull)
                    .map(this::toProductCardResponse)
                    .toList();
        } catch (Exception e) {
            log.warn("Lỗi khi load ProductCardResponse: {}", e.getMessage());
            return List.of();
        }
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
        return productService.toProductCardResponse(product);
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
