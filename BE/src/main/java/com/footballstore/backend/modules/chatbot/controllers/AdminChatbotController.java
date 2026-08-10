package com.footballstore.backend.modules.chatbot.controllers;

import com.footballstore.backend.modules.chatbot.models.ChatMessage;
import com.footballstore.backend.modules.chatbot.services.AdminChatbotService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/chatbot")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
public class AdminChatbotController {

    private final AdminChatbotService adminChatbotService;

    @GetMapping("/stats")
    public ResponseEntity<AdminChatbotService.ChatbotStatsResponse> getStats(
            @RequestParam(defaultValue = "week") String timeRange) {
        return ResponseEntity.ok(adminChatbotService.getSystemOverviewStats(timeRange));
    }

    @GetMapping("/sessions")
    public ResponseEntity<List<AdminChatbotService.SessionSummaryResponse>> getSessions(
            @RequestParam(required = false) String filter,
            @RequestParam(required = false) String keyword) {
        return ResponseEntity.ok(adminChatbotService.getSessionList(filter, keyword));
    }

    @GetMapping("/sessions/{sessionId}/messages")
    public ResponseEntity<List<ChatMessage>> getSessionMessages(@PathVariable String sessionId) {
        return ResponseEntity.ok(adminChatbotService.getSessionMessages(sessionId));
    }

    @PostMapping("/sessions/{sessionId}/intervene")
    public ResponseEntity<Map<String, Object>> toggleIntervention(@PathVariable String sessionId) {
        boolean intervened = adminChatbotService.toggleIntervention(sessionId);
        return ResponseEntity.ok(Map.of(
                "sessionId", sessionId,
                "intervened", intervened,
                "message", intervened ? "Đã bật chế độ Nhân viên tiếp quản (Can thiệp)" : "Đã tắt chế độ Can thiệp"
        ));
    }

    @PostMapping("/sessions/{sessionId}/send")
    public ResponseEntity<ChatMessage> sendStaffReply(
            @PathVariable String sessionId,
            @RequestBody Map<String, String> body) {
        String message = body.get("message");
        if (message == null || message.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        ChatMessage sent = adminChatbotService.sendStaffReply(sessionId, message);
        return ResponseEntity.ok(sent);
    }
}
