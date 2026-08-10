package com.footballstore.backend.modules.chatbot.controllers;

import com.footballstore.backend.modules.chatbot.dtos.ChatMessageDto;
import com.footballstore.backend.modules.chatbot.dtos.ChatStatsDto;
import com.footballstore.backend.modules.chatbot.dtos.DailyCountDto;
import com.footballstore.backend.modules.chatbot.dtos.SessionSummaryDto;
import com.footballstore.backend.modules.chatbot.repositories.ChatMessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/chat")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AdminChatController {

    private final ChatMessageRepository chatMessageRepository;

    // GET /api/admin/chat/stats
    @GetMapping("/stats")
    public ChatStatsDto getStats() {
        Long totalSessions = chatMessageRepository.countTotalSessions();
        Long totalMessages = chatMessageRepository.countByRole("user");

        LocalDate today = LocalDate.now();
        LocalDateTime startOfDay = today.atStartOfDay();
        LocalDateTime endOfDay = today.plusDays(1).atStartOfDay();
        Long todaySessions = chatMessageRepository.countSessionsBetween(startOfDay, endOfDay);

        // Biểu đồ 7 ngày gần nhất
        LocalDateTime since = today.minusDays(6).atStartOfDay();
        List<Object[]> rows = chatMessageRepository.countSessionsByDay(since);

        Map<String, Long> dateCountMap = rows.stream().collect(Collectors.toMap(
                row -> row[0].toString(),
                row -> ((Number) row[1]).longValue(),
                (v1, v2) -> v1
        ));

        List<DailyCountDto> chart = new ArrayList<>();
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        for (int i = 6; i >= 0; i--) {
            String dateStr = today.minusDays(i).format(fmt);
            Long count = dateCountMap.getOrDefault(dateStr, 0L);
            chart.add(new DailyCountDto(dateStr, count));
        }

        return ChatStatsDto.builder()
                .totalSessions(totalSessions != null ? totalSessions : 0L)
                .totalMessages(totalMessages != null ? totalMessages : 0L)
                .todaySessions(todaySessions != null ? todaySessions : 0L)
                .dailyChart(chart)
                .build();
    }

    // GET /api/admin/chat/sessions
    @GetMapping("/sessions")
    public List<SessionSummaryDto> getSessions() {
        return chatMessageRepository.findAllSessionSummaries()
                .stream()
                .map(row -> {
                    SessionSummaryDto s = new SessionSummaryDto();
                    s.setSessionId(row[0].toString());
                    s.setStartTime(row[1] != null ? row[1].toString() : "");
                    s.setMessageCount(row[3] != null ? ((Number) row[3]).longValue() : 0L);
                    return s;
                })
                .collect(Collectors.toList());
    }

    // GET /api/admin/chat/sessions/{sessionId}
    @GetMapping("/sessions/{sessionId}")
    public List<ChatMessageDto> getSessionDetail(@PathVariable String sessionId) {
        return chatMessageRepository
                .findBySessionIdOrderByCreatedAtAsc(sessionId)
                .stream()
                .map(m -> {
                    ChatMessageDto dto = new ChatMessageDto();
                    dto.setRole(m.getRole());
                    dto.setContent(m.getContent());
                    dto.setCreatedAt(m.getCreatedAt() != null ? m.getCreatedAt().toString() : "");
                    return dto;
                })
                .collect(Collectors.toList());
    }
}
