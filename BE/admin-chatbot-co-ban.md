# Admin Quản Lý Chatbot — Mức Cơ Bản

## Tổng quan chức năng Admin cần có

```
Trang Admin Chatbot gồm 2 tab:
├── 1. Thống kê tổng quan   → số liệu nhanh (cards + biểu đồ đơn giản)
└── 2. Lịch sử hội thoại    → xem từng phiên chat của khách hàng
```

Không cần thêm gì phức tạp hơn — 2 phần này đã đủ để trình bày trong báo cáo
và demo cho hội đồng thấy Admin "nắm được" chatbot đang hoạt động thế nào.

---

## Phần 1 — Database (không cần tạo thêm bảng)

Toàn bộ dữ liệu cần thiết đã có sẵn trong bảng `ChatMessages`:

```sql
-- Bảng đã có từ trước
CREATE TABLE ChatMessages (
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    session_id VARCHAR(100) NOT NULL,
    role       VARCHAR(10)  NOT NULL,   -- 'user' | 'assistant'
    content    TEXT         NOT NULL,
    created_at DATETIME     DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_session (session_id, created_at)
);
```

Chỉ cần viết thêm các câu query thống kê từ bảng này là đủ.

---

## Phần 2 — Backend (Spring Boot)

### 2.1. Các query thống kê cần thiết

```java
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {

    // Lấy 5 tin nhắn gần nhất của 1 session (đã có)
    List<ChatMessage> findTop5BySessionIdOrderByCreatedAtDesc(String sessionId);

    // Đếm tổng số phiên chat (dùng DISTINCT session_id)
    @Query("SELECT COUNT(DISTINCT c.sessionId) FROM ChatMessage c")
    Long countTotalSessions();

    // Đếm tổng số tin nhắn của khách (role = 'user')
    Long countByRole(String role);

    // Đếm số phiên chat hôm nay
    @Query("""
        SELECT COUNT(DISTINCT c.sessionId) FROM ChatMessage c
        WHERE DATE(c.createdAt) = CURRENT_DATE
        """)
    Long countSessionsToday();

    // Lấy danh sách tất cả session_id (mỗi session 1 dòng, kèm thời gian bắt đầu)
    @Query("""
        SELECT c.sessionId, MIN(c.createdAt) as startTime, COUNT(c.id) as messageCount
        FROM ChatMessage c
        GROUP BY c.sessionId
        ORDER BY startTime DESC
        """)
    List<Object[]> findAllSessionSummaries();

    // Lấy toàn bộ tin nhắn của 1 phiên
    List<ChatMessage> findBySessionIdOrderByCreatedAtAsc(String sessionId);

    // Đếm số phiên theo ngày (7 ngày gần nhất) — dùng cho biểu đồ
    @Query("""
        SELECT DATE(c.createdAt) as date, COUNT(DISTINCT c.sessionId) as count
        FROM ChatMessage c
        WHERE c.createdAt >= :since
        GROUP BY DATE(c.createdAt)
        ORDER BY date ASC
        """)
    List<Object[]> countSessionsByDay(@Param("since") LocalDateTime since);
}
```

### 2.2. DTO trả về cho Admin

```java
// Thống kê tổng quan
public class ChatStatsDto {
    private Long totalSessions;     // tổng số phiên chat
    private Long totalMessages;     // tổng số tin nhắn của khách
    private Long todaySessions;     // số phiên hôm nay
    private List<DailyCountDto> dailyChart; // dữ liệu biểu đồ 7 ngày
    // getters/setters
}

public class DailyCountDto {
    private String date;   // "2025-03-20"
    private Long   count;  // số phiên ngày đó
    // getters/setters
}

// Tóm tắt 1 phiên chat trong danh sách
public class SessionSummaryDto {
    private String sessionId;
    private String startTime;       // thời gian bắt đầu
    private Long   messageCount;    // số tin nhắn trong phiên
    // getters/setters
}

// Chi tiết 1 tin nhắn trong phiên
public class ChatMessageDto {
    private String role;        // "user" | "assistant"
    private String content;
    private String createdAt;
    // getters/setters
}
```

### 2.3. AdminChatController.java

```java
@RestController
@RequestMapping("/api/admin/chat")
// Thêm @PreAuthorize("hasRole('ADMIN')") nếu project đã có JWT + phân quyền
public class AdminChatController {

    @Autowired private ChatMessageRepository chatMessageRepository;

    // GET /api/admin/chat/stats
    // Trả về thống kê tổng quan + dữ liệu biểu đồ 7 ngày
    @GetMapping("/stats")
    public ChatStatsDto getStats() {
        ChatStatsDto stats = new ChatStatsDto();
        stats.setTotalSessions(chatMessageRepository.countTotalSessions());
        stats.setTotalMessages(chatMessageRepository.countByRole("user"));
        stats.setTodaySessions(chatMessageRepository.countSessionsToday());

        // Biểu đồ 7 ngày gần nhất
        LocalDateTime since = LocalDateTime.now().minusDays(6).toLocalDate().atStartOfDay();
        List<Object[]> rows = chatMessageRepository.countSessionsByDay(since);
        List<DailyCountDto> chart = rows.stream().map(row -> {
            DailyCountDto d = new DailyCountDto();
            d.setDate(row[0].toString());
            d.setCount(((Number) row[1]).longValue());
            return d;
        }).collect(Collectors.toList());
        stats.setDailyChart(chart);

        return stats;
    }

    // GET /api/admin/chat/sessions
    // Trả về danh sách tất cả phiên chat (mỗi phiên 1 dòng)
    @GetMapping("/sessions")
    public List<SessionSummaryDto> getSessions() {
        return chatMessageRepository.findAllSessionSummaries()
            .stream()
            .map(row -> {
                SessionSummaryDto s = new SessionSummaryDto();
                s.setSessionId(row[0].toString());
                s.setStartTime(row[1].toString());
                s.setMessageCount(((Number) row[2]).longValue());
                return s;
            })
            .collect(Collectors.toList());
    }

    // GET /api/admin/chat/sessions/{sessionId}
    // Trả về toàn bộ tin nhắn của 1 phiên cụ thể
    @GetMapping("/sessions/{sessionId}")
    public List<ChatMessageDto> getSessionDetail(@PathVariable String sessionId) {
        return chatMessageRepository
            .findBySessionIdOrderByCreatedAtAsc(sessionId)
            .stream()
            .map(m -> {
                ChatMessageDto dto = new ChatMessageDto();
                dto.setRole(m.getRole());
                dto.setContent(m.getContent());
                dto.setCreatedAt(m.getCreatedAt().toString());
                return dto;
            })
            .collect(Collectors.toList());
    }
}
```

---

## Phần 3 — Frontend React (Trang Admin)

### 3.1. Cấu trúc component

```
src/
└── pages/
    └── admin/
        └── ChatManagement.jsx   ← 1 file duy nhất, chia 2 tab bên trong
```

### 3.2. ChatManagement.jsx — đầy đủ

```jsx
import { useState, useEffect } from "react";

const API = "http://localhost:8080/api/admin/chat";

export default function ChatManagement() {
  const [tab, setTab]           = useState("stats");        // "stats" | "sessions"
  const [stats, setStats]       = useState(null);
  const [sessions, setSessions] = useState([]);
  const [detail, setDetail]     = useState(null);           // tin nhắn của phiên đang xem
  const [selectedId, setSelectedId] = useState(null);

  // Load thống kê
  useEffect(() => {
    fetch(`${API}/stats`)
      .then((r) => r.json())
      .then(setStats);
  }, []);

  // Load danh sách phiên
  useEffect(() => {
    if (tab === "sessions") {
      fetch(`${API}/sessions`)
        .then((r) => r.json())
        .then(setSessions);
    }
  }, [tab]);

  // Load chi tiết 1 phiên
  const openSession = (sessionId) => {
    setSelectedId(sessionId);
    fetch(`${API}/sessions/${sessionId}`)
      .then((r) => r.json())
      .then(setDetail);
  };

  return (
    <div style={{ padding: 24, fontFamily: "sans-serif" }}>
      <h2>Quản lý Chatbot</h2>

      {/* Tab switcher */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        {["stats", "sessions"].map((t) => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: "8px 20px", borderRadius: 6, cursor: "pointer",
            background: tab === t ? "#1a73e8" : "#f1f1f1",
            color: tab === t ? "#fff" : "#333",
            border: "none", fontWeight: tab === t ? 600 : 400,
          }}>
            {t === "stats" ? "📊 Thống kê" : "💬 Lịch sử hội thoại"}
          </button>
        ))}
      </div>

      {/* TAB 1: Thống kê */}
      {tab === "stats" && stats && (
        <div>
          {/* 3 card số liệu */}
          <div style={{ display: "flex", gap: 16, marginBottom: 32 }}>
            {[
              { label: "Tổng phiên chat",    value: stats.totalSessions,  color: "#1a73e8" },
              { label: "Tin nhắn của khách", value: stats.totalMessages,  color: "#34a853" },
              { label: "Phiên hôm nay",      value: stats.todaySessions,  color: "#fbbc04" },
            ].map((card) => (
              <div key={card.label} style={{
                flex: 1, background: "#fff", border: "1px solid #eee",
                borderRadius: 10, padding: 20, textAlign: "center",
                boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
              }}>
                <div style={{ fontSize: 36, fontWeight: 700, color: card.color }}>
                  {card.value}
                </div>
                <div style={{ fontSize: 13, color: "#666", marginTop: 4 }}>
                  {card.label}
                </div>
              </div>
            ))}
          </div>

          {/* Biểu đồ cột đơn giản — 7 ngày gần nhất */}
          <div style={{ background: "#fff", border: "1px solid #eee",
                        borderRadius: 10, padding: 20 }}>
            <h4 style={{ margin: "0 0 16px" }}>Số phiên chat theo ngày (7 ngày gần nhất)</h4>
            <div style={{ display: "flex", alignItems: "flex-end",
                          gap: 8, height: 120 }}>
              {stats.dailyChart.map((d) => {
                const max   = Math.max(...stats.dailyChart.map((x) => x.count), 1);
                const pct   = (d.count / max) * 100;
                return (
                  <div key={d.date} style={{ flex: 1, textAlign: "center" }}>
                    <div style={{ fontSize: 11, marginBottom: 4, color: "#333" }}>
                      {d.count}
                    </div>
                    <div style={{
                      height: `${pct}%`, minHeight: 4,
                      background: "#1a73e8", borderRadius: "3px 3px 0 0",
                    }} />
                    <div style={{ fontSize: 10, color: "#888", marginTop: 4 }}>
                      {d.date.slice(5)} {/* Hiện MM-DD */}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Lịch sử hội thoại */}
      {tab === "sessions" && (
        <div style={{ display: "flex", gap: 16 }}>

          {/* Danh sách phiên bên trái */}
          <div style={{ width: 320, flexShrink: 0 }}>
            <h4 style={{ margin: "0 0 12px" }}>Danh sách phiên ({sessions.length})</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {sessions.map((s) => (
                <div key={s.sessionId} onClick={() => openSession(s.sessionId)}
                  style={{
                    padding: "10px 14px", borderRadius: 8, cursor: "pointer",
                    background: selectedId === s.sessionId ? "#e8f0fe" : "#f9f9f9",
                    border: selectedId === s.sessionId
                      ? "1px solid #1a73e8" : "1px solid #eee",
                  }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#333",
                                overflow: "hidden", textOverflow: "ellipsis",
                                whiteSpace: "nowrap" }}>
                    {s.sessionId}
                  </div>
                  <div style={{ fontSize: 11, color: "#888", marginTop: 3 }}>
                    🕐 {s.startTime.slice(0, 16).replace("T", " ")}
                    &nbsp;·&nbsp; {s.messageCount} tin nhắn
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chi tiết phiên bên phải */}
          <div style={{ flex: 1, background: "#f9f9f9",
                        borderRadius: 10, padding: 16, minHeight: 400 }}>
            {!detail ? (
              <div style={{ color: "#aaa", textAlign: "center", marginTop: 80 }}>
                Chọn một phiên bên trái để xem nội dung hội thoại
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {detail.map((msg, i) => (
                  <div key={i} style={{
                    textAlign: msg.role === "user" ? "right" : "left",
                  }}>
                    <span style={{
                      display: "inline-block", maxWidth: "75%",
                      padding: "8px 12px", borderRadius: 10, fontSize: 13,
                      background: msg.role === "user" ? "#1a73e8" : "#fff",
                      color: msg.role === "user" ? "#fff" : "#333",
                      border: msg.role === "assistant" ? "1px solid #eee" : "none",
                    }}>
                      {msg.content}
                    </span>
                    <div style={{ fontSize: 10, color: "#aaa", marginTop: 2 }}>
                      {msg.role === "user" ? "👤 Khách" : "🤖 Bot"}
                      &nbsp;·&nbsp;
                      {msg.createdAt.slice(11, 16)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
```

### 3.3. Thêm vào route Admin

```jsx
// Trong file cấu hình router (App.jsx hoặc AdminRoutes.jsx)
import ChatManagement from "./pages/admin/ChatManagement";

<Route path="/admin/chatbot" element={<ChatManagement />} />
```

```jsx
// Trong sidebar Admin, thêm link
<NavLink to="/admin/chatbot">💬 Quản lý Chatbot</NavLink>
```

---

## Phần 4 — Giao diện sẽ trông như thế này

```
┌─────────────────────────────────────────────────────────┐
│  Quản lý Chatbot                                        │
│  [📊 Thống kê]  [💬 Lịch sử hội thoại]                │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐   │
│  │     142      │ │     389      │ │      8       │   │
│  │ Tổng phiên   │ │  Tin nhắn    │ │  Hôm nay     │   │
│  └──────────────┘ └──────────────┘ └──────────────┘   │
│                                                         │
│  Số phiên theo ngày (7 ngày gần nhất)                  │
│  ┌────────────────────────────────────────────────┐    │
│  │  ██                    ██                      │    │
│  │  ██  ██          ██    ██    ██                │    │
│  │  ██  ██    ██    ██    ██    ██    ██          │    │
│  │ 03-14 03-15 03-16 03-17 03-18 03-19 03-20     │    │
│  └────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘

Tab "Lịch sử hội thoại":
┌──────────────────┬──────────────────────────────────────┐
│ session-abc-123  │  👤 Khách: giày đá sân AG tầm 500k  │
│ 2025-03-20 09:14 │  🤖 Bot: Dạ, ULTRASPORT gợi ý...    │
│ 4 tin nhắn       │  👤 Khách: còn màu đen không ạ?      │
├──────────────────│  🤖 Bot: Dạ có ạ, Nike Phantom...   │
│ session-def-456  │                                      │
│ 2025-03-20 10:32 │                                      │
│ 2 tin nhắn       │                                      │
└──────────────────┴──────────────────────────────────────┘
```

---

## Checklist hoàn thiện

- [ ] Thêm route `/admin/chatbot` vào router
- [ ] Thêm link trong sidebar Admin
- [ ] Bảo vệ API `/api/admin/chat/**` bằng JWT (nếu project đã có auth)
- [ ] Test tab Thống kê: 3 card hiển thị đúng số liệu
- [ ] Test biểu đồ 7 ngày có dữ liệu (cần đã có vài phiên chat thật)
- [ ] Test tab Lịch sử: click vào phiên xem được nội dung hội thoại đúng thứ tự
