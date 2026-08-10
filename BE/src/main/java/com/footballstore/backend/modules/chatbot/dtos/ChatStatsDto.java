package com.footballstore.backend.modules.chatbot.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatStatsDto {
    private Long totalSessions;
    private Long totalMessages;
    private Long todaySessions;
    private List<DailyCountDto> dailyChart;
}
