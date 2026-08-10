package com.footballstore.backend.modules.chatbot.repositories;

import com.footballstore.backend.modules.chatbot.models.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    List<ChatMessage> findTop5BySessionIdOrderByCreatedAtDesc(String sessionId);
    List<ChatMessage> findTop10ByUserIdOrderByCreatedAtDesc(String userId);
    List<ChatMessage> findByUserIdOrderByCreatedAtAsc(String userId);
    List<ChatMessage> findBySessionIdOrderByCreatedAtAsc(String sessionId);

    Long countByRole(String role);

    @Query("SELECT COUNT(DISTINCT c.sessionId) FROM ChatMessage c WHERE c.sessionId IS NOT NULL")
    Long countTotalSessions();

    @Query("""
        SELECT COUNT(DISTINCT c.sessionId) FROM ChatMessage c
        WHERE c.sessionId IS NOT NULL
          AND c.createdAt >= :start
          AND c.createdAt < :end
    """)
    Long countSessionsBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("""
        SELECT FUNCTION('date', c.createdAt), COUNT(DISTINCT c.sessionId)
        FROM ChatMessage c
        WHERE c.sessionId IS NOT NULL
          AND c.createdAt >= :since
        GROUP BY FUNCTION('date', c.createdAt)
        ORDER BY FUNCTION('date', c.createdAt) ASC
    """)
    List<Object[]> countSessionsByDay(@Param("since") LocalDateTime since);

    @Query("""
        SELECT c.sessionId, MIN(c.createdAt), MAX(c.createdAt), COUNT(c.id)
        FROM ChatMessage c
        WHERE c.sessionId IS NOT NULL
        GROUP BY c.sessionId
        ORDER BY MAX(c.createdAt) DESC
    """)
    List<Object[]> findAllSessionSummaries();
}
