package com.footballstore.backend.modules.chatbot.services;

import com.footballstore.backend.modules.chatbot.models.ChatMessage;
import com.footballstore.backend.modules.chatbot.repositories.ChatMessageRepository;
import com.footballstore.backend.modules.product.models.Product;
import com.footballstore.backend.modules.product.models.ProductVariant;
import com.footballstore.backend.modules.product.repositories.ProductRepository;
import com.footballstore.backend.modules.product.repositories.ProductVariantRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.text.NumberFormat;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class PromptBuilderService {

    private static final int MAX_PRODUCTS_IN_PROMPT = 20;

    private final ProductRepository productRepository;
    private final ProductVariantRepository productVariantRepository;
    private final ChatMessageRepository chatMessageRepository;

    private static final String SYSTEM_PROMPT = """
        Bạn là chuyên viên tư vấn bán hàng của cửa hàng phụ kiện bóng đá ULTRASPORT.
        Nhiệm vụ của bạn:
        1. Đọc danh sách sản phẩm bên dưới (mỗi sản phẩm có ID, Tên, Giá, Thương hiệu, Danh mục, Loại sân/đinh, Size, Màu sắc, Mô tả).
        2. Dựa trên yêu cầu của khách hàng (loại sân thi đấu, size chân, tầm giá, thương hiệu, vị trí thi đấu hoặc sở thích), hãy tư vấn tận tâm, ngắn gọn và chọn từ 1 đến 3 sản phẩm PHÙ HỢP NHẤT.
        3. Viết câu trả lời tư vấn bằng tiếng Việt thân thiện, chuyên nghiệp trong 2 đến 4 câu.
        4. BẮT BUỘC Ở DÒNG CUỐI CÙNG: Bạn PHẢI ghi chính xác mã ID của những sản phẩm bạn đã tư vấn/gợi ý theo đúng định dạng sau:
           PRODUCTS:[id1,id2,id3]
           (Ví dụ: PRODUCTS:[1,2] hoặc PRODUCTS:[7])
           Nếu trong danh sách không có sản phẩm nào phù hợp hoặc câu hỏi ngoài phạm vi bóng đá/thể thao, ghi: PRODUCTS:[]

        Quy tắc bắt buộc:
        - Chỉ chọn sản phẩm có trong danh sách bên dưới, tuyệt đối không tự bịa ID.
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
        sb.append("=== DANH SÁCH SẢN PHẨM CÓ SẴN TẠI SHOP ===\n");
        for (Product p : products) {
            String brandName = p.getBrand() != null ? p.getBrand().getBrandName() : "ULTRASPORT";
            String categoryName = p.getCategory() != null ? p.getCategory().getCategoryName() : "Đồ thể thao";

            List<ProductVariant> activeVariants = productVariantRepository.findByProductProductIdAndIsActiveTrue(p.getProductId());

            BigDecimal minSalePrice = BigDecimal.ZERO;
            String sizes = "";
            String surfaceTypes = "";
            String colors = "";

            if (!activeVariants.isEmpty()) {
                minSalePrice = p.getPriceSell() != null ? p.getPriceSell() : BigDecimal.ZERO;

                sizes = activeVariants.stream()
                        .map(ProductVariant::getSize)
                        .filter(Objects::nonNull)
                        .distinct()
                        .collect(Collectors.joining(", "));

                surfaceTypes = activeVariants.stream()
                        .map(ProductVariant::getSurfaceType)
                        .filter(Objects::nonNull)
                        .distinct()
                        .collect(Collectors.joining(", "));

                colors = activeVariants.stream()
                        .map(ProductVariant::getColor)
                        .filter(Objects::nonNull)
                        .distinct()
                        .collect(Collectors.joining(", "));
            }

            sb.append("ID:").append(p.getProductId())
              .append(" | Tên: ").append(nullToEmpty(p.getProductName()))
              .append(" | Giá: ").append(formatPrice(minSalePrice)).append(" VNĐ")
              .append(" | Thương hiệu: ").append(brandName)
              .append(" | Danh mục: ").append(categoryName);

            if (!surfaceTypes.isBlank()) {
                sb.append(" | Loại sân/đinh: ").append(surfaceTypes);
            }
            if (!sizes.isBlank()) {
                sb.append(" | Size: ").append(sizes);
            }
            if (!colors.isBlank()) {
                sb.append(" | Màu: ").append(colors);
            }
            if (p.getDescription() != null && !p.getDescription().isBlank()) {
                sb.append(" | Mô tả: ").append(nullToEmpty(p.getDescription()));
            }
            sb.append("\n");
        }
        sb.append("=========================================\n\n");

        List<ChatMessage> history = null;
        if (sessionId != null && !sessionId.trim().isEmpty()) {
            history = new ArrayList<>(chatMessageRepository.findTop5BySessionIdOrderByCreatedAtDesc(sessionId));
        } else if (userId != null && !userId.trim().isEmpty()) {
            history = new ArrayList<>(chatMessageRepository.findTop10ByUserIdOrderByCreatedAtDesc(userId));
        }

        if (history != null && !history.isEmpty()) {
            if ("user".equalsIgnoreCase(history.get(0).getRole()) && userMessage.trim().equalsIgnoreCase(history.get(0).getContent().trim())) {
                history.remove(0);
            }
            Collections.reverse(history);
            if (!history.isEmpty()) {
                sb.append("Lịch sử hội thoại trước đó:\n");
                for (ChatMessage m : history) {
                    if (m.getContent() == null || m.getContent().contains("Không thể kết nối") || m.getContent().contains("Chưa cấu hình") || m.getContent().contains("bận một chút")) {
                        continue;
                    }
                    String roleLabel = "user".equalsIgnoreCase(m.getRole()) ? "Khách hàng" : "Trợ lý ULTRASPORT";
                    sb.append(roleLabel).append(": ").append(m.getContent()).append("\n");
                }
                sb.append("\n");
            }
        }

        sb.append("Khách hàng: ").append(userMessage);
        return sb.toString();
    }

    private List<Product> loadCandidateProducts(String userMessage) {
        List<Product> allActiveProducts = productRepository.findByIsActiveTrueOrderBySoldCountDesc(PageRequest.of(0, 30)).getContent();
        if (userMessage == null || userMessage.trim().isEmpty()) {
            return allActiveProducts;
        }

        String searchKw = extractSearchKeyword(userMessage);
        String categoryKw = detectCategoryKeyword(userMessage);

        List<Product> prioritized = new ArrayList<>();
        Set<Integer> addedIds = new HashSet<>();

        if (searchKw != null && !searchKw.isBlank()) {
            List<Product> matched = productRepository.searchProductsForChatbot(searchKw, PageRequest.of(0, MAX_PRODUCTS_IN_PROMPT));
            for (Product p : matched) {
                if (addedIds.add(p.getProductId())) {
                    prioritized.add(p);
                }
            }
        }

        if (categoryKw != null && !categoryKw.isBlank()) {
            List<Product> matched = productRepository.findActiveByCategoryKeyword(categoryKw, PageRequest.of(0, MAX_PRODUCTS_IN_PROMPT));
            for (Product p : matched) {
                if (addedIds.add(p.getProductId())) {
                    prioritized.add(p);
                }
            }
        }

        for (Product p : allActiveProducts) {
            if (addedIds.add(p.getProductId())) {
                prioritized.add(p);
            }
        }

        return prioritized;
    }

    private String extractSearchKeyword(String message) {
        if (message == null) return null;
        String msg = message.toLowerCase(Locale.ROOT);

        String[] brandsAndLines = {
            "nike", "adidas", "puma", "mizuno", "joma", "umbro", "asics",
            "phantom", "predator", "future", "telstar", "strike", "morelia",
            "mercurial", "vapor", "superfly", "freak", "speedflow", "king"
        };
        for (String kw : brandsAndLines) {
            if (msg.contains(kw)) {
                return kw;
            }
        }
        return null;
    }

    private String detectCategoryKeyword(String message) {
        if (message == null) return null;
        String msg = message.toLowerCase(Locale.ROOT);

        if (containsAny(msg, "bảo vệ chân", "bao ve chan", "cố chân", "co chan", "băng chân", "bang chan", "băng cố chân", "băng keo", "bó chân")) {
            return "Băng cố chân";
        }
        if (containsAny(msg, "găng", "gang", "thủ môn", "thu mon", "bắt bóng")) {
            return "Găng tay";
        }
        if (containsAny(msg, "tất", "tat", "vớ", "vo", "chống trượt", "chong truot")) {
            return "Tất bóng đá";
        }
        if (containsAny(msg, "quả bóng", "qua bong", "trái bóng", "trai bong", "mua bóng", "mua bong")) {
            return "Quả bóng";
        }
        if (containsAny(msg, "giày", "giay", "boot", "đinh", "dinh", "sân cỏ", "san co", "sân tự nhiên", "sân nhân tạo", "fg", "ag", "tf", "ic")) {
            return "Giày bóng đá";
        }
        if (containsAny(msg, "áo", "ao", "quần", "quan", "đội tuyển", "doi tuyen", "clb", "jersey", "nam định", "vietnam", "bayern")) {
            return "Quần áo";
        }
        if (containsAny(msg, "phụ kiện", "phu kien")) {
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
        if (price == null || price.compareTo(BigDecimal.ZERO) <= 0) return "Liên hệ";
        return NumberFormat.getNumberInstance(Locale.of("vi", "VN")).format(price);
    }

    private String nullToEmpty(String value) {
        return value == null ? "" : value.replaceAll("\\s+", " ").trim();
    }
}
