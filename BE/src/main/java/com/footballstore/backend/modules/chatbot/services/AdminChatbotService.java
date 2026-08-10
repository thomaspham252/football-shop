package com.footballstore.backend.modules.chatbot.services;

import com.footballstore.backend.modules.auth.models.User;
import com.footballstore.backend.modules.auth.repositories.UserRepository;
import com.footballstore.backend.modules.chatbot.models.ChatMessage;
import com.footballstore.backend.modules.chatbot.repositories.ChatMessageRepository;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminChatbotService {

    private final ChatMessageRepository chatMessageRepository;
    private final UserRepository userRepository;

    private final Set<String> intervenedSessions = Collections.synchronizedSet(new HashSet<>());
    private final Map<String, String> sessionStatusMap = Collections.synchronizedMap(new HashMap<>());

    @Data
    @Builder
    public static class ChatbotStatsResponse {
        private long totalSessions;
        private String totalSessionsGrowth;
        private long totalMessages;
        private String totalMessagesGrowth;
        private long todaySessions;
        private String todaySessionsGrowth;
        private List<ChartDataPoint> chartData;
    }

    @Data
    @Builder
    public static class ChartDataPoint {
        private String label;
        private long count;
    }

    @Data
    @Builder
    public static class SessionSummaryResponse {
        private String sessionId;
        private String userId;
        private String userName;
        private String userAvatar;
        private long messageCount;
        private LocalDateTime startTime;
        private LocalDateTime latestTimestamp;
        private String formattedTime;
        private String latestMessageText;
        private String status;
        private String tag;
        private boolean intervened;
    }

    @Transactional(readOnly = true)
    public ChatbotStatsResponse getSystemOverviewStats(String timeRange) {
        LocalDate today = LocalDate.now();
        LocalDateTime todayStart = today.atStartOfDay();
        LocalDateTime tomorrowStart = today.plusDays(1).atStartOfDay();

        long totalSessions = defaultZero(chatMessageRepository.countTotalSessions());
        long totalMessages = defaultZero(chatMessageRepository.countByRole("user"));
        long todaySessions = defaultZero(chatMessageRepository.countSessionsBetween(todayStart, tomorrowStart));

        return ChatbotStatsResponse.builder()
                .totalSessions(totalSessions)
                .totalSessionsGrowth("0%")
                .totalMessages(totalMessages)
                .totalMessagesGrowth("0%")
                .todaySessions(todaySessions)
                .todaySessionsGrowth("0%")
                .chartData(buildSevenDayChart(today))
                .build();
    }

    @Transactional(readOnly = true)
    public List<SessionSummaryResponse> getSessionList(String filter, String keyword) {
        List<SessionSummaryResponse> summaries = chatMessageRepository.findAllSessionSummaries().stream()
                .map(this::toSessionSummary)
                .toList();

        if (keyword != null && !keyword.trim().isEmpty()) {
            String kw = keyword.toLowerCase(Locale.ROOT).trim();
            summaries = summaries.stream()
                    .filter(s ->
                            contains(s.getSessionId(), kw) ||
                            contains(s.getUserName(), kw) ||
                            contains(s.getLatestMessageText(), kw))
                    .toList();
        }

        if (filter != null && !filter.trim().isEmpty() && !"all".equalsIgnoreCase(filter)) {
            summaries = summaries.stream()
                    .filter(s -> {
                        if ("resolved".equalsIgnoreCase(filter)) {
                            return "RESOLVED".equalsIgnoreCase(s.getStatus());
                        }
                        if ("need_support".equalsIgnoreCase(filter)) {
                            return "NEED_SUPPORT".equalsIgnoreCase(s.getStatus());
                        }
                        return true;
                    })
                    .toList();
        }

        return summaries;
    }

    @Transactional(readOnly = true)
    public List<ChatMessage> getSessionMessages(String sessionId) {
        return chatMessageRepository.findBySessionIdOrderByCreatedAtAsc(sessionId);
    }

    @Transactional
    public boolean toggleIntervention(String sessionId) {
        if (intervenedSessions.contains(sessionId)) {
            intervenedSessions.remove(sessionId);
            sessionStatusMap.put(sessionId, "RESOLVED");
            return false;
        }

        intervenedSessions.add(sessionId);
        sessionStatusMap.put(sessionId, "NEED_SUPPORT");
        return true;
    }

    @Transactional
    public ChatMessage sendStaffReply(String sessionId, String staffMessage) {
        ChatMessage m = ChatMessage.builder()
                .sessionId(sessionId)
                .role("assistant")
                .content("[Nhân viên hỗ trợ]: " + staffMessage.trim())
                .createdAt(LocalDateTime.now())
                .build();
        return chatMessageRepository.save(m);
    }

    private List<ChartDataPoint> buildSevenDayChart(LocalDate today) {
        LocalDate sinceDate = today.minusDays(6);
        Map<String, Long> countsByDate = chatMessageRepository.countSessionsByDay(sinceDate.atStartOfDay()).stream()
                .collect(Collectors.toMap(
                        row -> row[0].toString(),
                        row -> ((Number) row[1]).longValue()
                ));

        DateTimeFormatter dbKeyFormatter = DateTimeFormatter.ISO_LOCAL_DATE;
        DateTimeFormatter labelFormatter = DateTimeFormatter.ofPattern("MM-dd");

        return java.util.stream.IntStream.rangeClosed(0, 6)
                .mapToObj(i -> sinceDate.plusDays(i))
                .map(date -> ChartDataPoint.builder()
                        .label(date.format(labelFormatter))
                        .count(countsByDate.getOrDefault(date.format(dbKeyFormatter), 0L))
                        .build())
                .toList();
    }

    private SessionSummaryResponse toSessionSummary(Object[] row) {
        String sessionId = Objects.toString(row[0], "");
        LocalDateTime startTime = (LocalDateTime) row[1];
        LocalDateTime latestTime = (LocalDateTime) row[2];
        long messageCount = ((Number) row[3]).longValue();
        List<ChatMessage> messages = chatMessageRepository.findBySessionIdOrderByCreatedAtAsc(sessionId);

        ChatMessage latestMessage = messages.isEmpty() ? null : messages.get(messages.size() - 1);
        String userId = messages.stream()
                .map(ChatMessage::getUserId)
                .filter(Objects::nonNull)
                .findFirst()
                .orElse(null);

        String userName = resolveUserName(userId, sessionId);
        String latestText = latestMessage != null ? latestMessage.getContent() : "";
        boolean intervened = intervenedSessions.contains(sessionId);

        return SessionSummaryResponse.builder()
                .sessionId(sessionId)
                .userId(userId)
                .userName(userName)
                .userAvatar(firstLetter(userName))
                .messageCount(messageCount)
                .startTime(startTime)
                .latestTimestamp(latestTime)
                .formattedTime(latestTime != null ? latestTime.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")) : "")
                .latestMessageText(latestText)
                .status(sessionStatusMap.getOrDefault(sessionId, inferStatus(latestMessage, intervened)))
                .tag(inferTag(latestText))
                .intervened(intervened)
                .build();
    }

    private String resolveUserName(String userId, String fallback) {
        if (userId == null || userId.isBlank()) {
            return fallback;
        }

        Optional<User> user = userRepository.findById(userId);
        if (user.isEmpty()) {
            return fallback;
        }

        User u = user.get();
        if (u.getFullName() != null && !u.getFullName().isBlank()) {
            return u.getFullName();
        }
        return u.getEmail() != null ? u.getEmail() : fallback;
    }

    private String inferStatus(ChatMessage latestMessage, boolean intervened) {
        if (intervened) {
            return "NEED_SUPPORT";
        }
        if (latestMessage != null && "assistant".equalsIgnoreCase(latestMessage.getRole())) {
            return "RESOLVED";
        }
        return "NEED_SUPPORT";
    }

    private String inferTag(String text) {
        String lower = text == null ? "" : text.toLowerCase(Locale.ROOT);
        if (lower.contains("hỗ trợ") || lower.contains("lỗi") || lower.contains("đăng nhập")) {
            return "Hỗ trợ";
        }
        return "Tư vấn sản phẩm";
    }

    private boolean contains(String value, String keyword) {
        return value != null && value.toLowerCase(Locale.ROOT).contains(keyword);
    }

    private long defaultZero(Long value) {
        return value == null ? 0 : value;
    }

    private String firstLetter(String value) {
        if (value == null || value.isBlank()) {
            return "U";
        }
        return value.substring(0, 1).toUpperCase(Locale.ROOT);
    }
}
