package com.footballstore.backend.modules.chatbot.services;

import com.footballstore.backend.modules.chatbot.models.ChatMessage;
import com.footballstore.backend.modules.chatbot.repositories.ChatMessageRepository;
import com.footballstore.backend.modules.product.models.Product;
import com.footballstore.backend.modules.product.repositories.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.text.NumberFormat;
import java.util.Collections;
import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class PromptBuilderService {

    private static final int MAX_PRODUCTS_IN_PROMPT = 20;

    private final ProductRepository productRepository;
    private final ChatMessageRepository chatMessageRepository;

    private static final String SYSTEM_PROMPT = """
        Bạn là trợ lý tư vấn bán hàng của cửa hàng phụ kiện bóng đá ULTRASPORT.
        Nhiệm vụ của bạn:
        1. Đọc danh sách sản phẩm bên dưới, mỗi sản phẩm đều có ID rõ ràng.
        2. Dựa trên yêu cầu khách hàng, chọn tối đa 3 sản phẩm phù hợp nhất theo giá tiền, loại sân, thương hiệu, màu sắc, danh mục và mục đích sử dụng.
        3. Viết câu trả lời tư vấn bằng tiếng Việt, thân thiện, ngắn gọn trong 3-5 câu.
        4. Ở dòng cuối cùng của phản hồi, ghi đúng định dạng sau và không thêm nội dung nào khác sau dòng này:
           PRODUCTS:[id1,id2,id3]
           Nếu không có sản phẩm phù hợp, ghi: PRODUCTS:[]

        Quy tắc bắt buộc:
        - Chỉ chọn sản phẩm có trong danh sách bên dưới, không được bịa ID.
        - Không nhắc hoặc giải thích dòng PRODUCTS trong câu trả lời cho khách hàng.
        - Nếu câu hỏi ngoài phạm vi sản phẩm thể thao/bóng đá của ULTRASPORT, từ chối lịch sự và ghi PRODUCTS:[].
        """;

    @Transactional(readOnly = true)
    public String buildPrompt(String sessionId, String userMessage) {
        return buildPrompt(sessionId, null, userMessage);
    }

    @Transactional(readOnly = true)
    public String buildPrompt(String sessionId, String userId, String userMessage) {
        StringBuilder sb = new StringBuilder();
        sb.append(SYSTEM_PROMPT).append("\n\n");

        List<Product> products = loadCandidateProducts(userMessage);
        sb.append("=== DANH SACH SAN PHAM ===\n");
        for (Product p : products) {
            String brandName = p.getBrand() != null ? p.getBrand().getBrandName() : "ULTRASPORT";
            String categoryName = p.getCategory() != null ? p.getCategory().getCategoryName() : "Do the thao";
            BigDecimal price = p.getSalePrice() != null ? p.getSalePrice() : p.getBasePrice();

            sb.append("ID:").append(p.getProductId())
              .append(" | Ten: ").append(nullToEmpty(p.getProductName()))
              .append(" | Gia: ").append(formatPrice(price)).append(" VND")
              .append(" | Thuong hieu: ").append(brandName)
              .append(" | Danh muc: ").append(categoryName)
              .append(" | Mo ta: ").append(nullToEmpty(p.getDescription()))
              .append("\n");
        }
        sb.append("==========================\n\n");

        List<ChatMessage> history = null;
        if (userId != null && !userId.trim().isEmpty()) {
            history = chatMessageRepository.findTop10ByUserIdOrderByCreatedAtDesc(userId);
        } else if (sessionId != null && !sessionId.trim().isEmpty()) {
            history = chatMessageRepository.findTop5BySessionIdOrderByCreatedAtDesc(sessionId);
        }

        if (history != null && !history.isEmpty()) {
            Collections.reverse(history);
            sb.append("Lich su hoi thoai gan nhat:\n");
            for (ChatMessage m : history) {
                String roleLabel = "user".equalsIgnoreCase(m.getRole()) ? "Khach hang" : "Tro ly ULTRASPORT";
                sb.append(roleLabel).append(": ").append(m.getContent()).append("\n");
            }
            sb.append("\n");
        }

        sb.append("Khach hang: ").append(userMessage);
        return sb.toString();
    }

    private List<Product> loadCandidateProducts(String userMessage) {
        String categoryName = detectCategory(userMessage);
        if (categoryName != null) {
            List<Product> products = productRepository.findActiveByCategoryName(
                    categoryName,
                    PageRequest.of(0, MAX_PRODUCTS_IN_PROMPT)
            );
            if (!products.isEmpty()) {
                return products;
            }
        }

        return productRepository.findByIsActiveTrueOrderBySoldCountDesc(
                PageRequest.of(0, MAX_PRODUCTS_IN_PROMPT)
        ).getContent();
    }

    private String detectCategory(String message) {
        if (message == null) return null;
        String msg = message.toLowerCase(Locale.ROOT);

        if (containsAny(msg, "giày", "giay", "boot", "ag", "fg", "sân", "san")) {
            return "Giày đá bóng";
        }
        if (containsAny(msg, "áo", "ao", "quần áo", "quan ao", "đội tuyển", "doi tuyen")) {
            return "Áo đấu";
        }
        if (containsAny(msg, "bóng", "bong", "quả bóng", "qua bong")) {
            return "Bóng";
        }
        if (containsAny(msg, "găng", "gang", "tất", "tat", "băng", "bang", "phụ kiện", "phu kien")) {
            return "Phụ kiện";
        }
        return null;
    }

    private boolean containsAny(String text, String... keywords) {
        for (String keyword : keywords) {
            if (text.contains(keyword)) {
                return true;
            }
        }
        return false;
    }

    private String formatPrice(BigDecimal price) {
        if (price == null) return "Lien he";
        return NumberFormat.getNumberInstance(new Locale("vi", "VN")).format(price);
    }

    private String nullToEmpty(String value) {
        return value == null ? "" : value.replaceAll("\\s+", " ").trim();
    }
}
