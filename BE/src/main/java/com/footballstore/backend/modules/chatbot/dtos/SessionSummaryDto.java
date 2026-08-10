package com.footballstore.backend.modules.chatbot.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SessionSummaryDto {
    private String sessionId;
    private String startTime;
    private Long messageCount;
}
