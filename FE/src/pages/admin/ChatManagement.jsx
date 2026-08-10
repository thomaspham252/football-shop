import { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";

export default function ChatManagement() {
  const [tab, setTab]               = useState("stats"); // "stats" | "sessions"
  const [stats, setStats]           = useState(null);
  const [sessions, setSessions]     = useState([]);
  const [detail, setDetail]         = useState(null);    // tin nhắn của phiên đang xem
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading]       = useState(false);

  // Load thống kê
  useEffect(() => {
    fetchStats();
  }, []);

  // Load danh sách phiên
  useEffect(() => {
    if (tab === "sessions") {
      fetchSessions();
    }
  }, [tab]);

  const fetchStats = async () => {
    try {
      const res = await axiosInstance.get("/admin/chat/stats");
      setStats(res.data);
    } catch (e) {
      console.error("Lỗi tải thống kê chatbot:", e);
    }
  };

  const fetchSessions = async () => {
    try {
      const res = await axiosInstance.get("/admin/chat/sessions");
      setSessions(res.data || []);
      if (res.data && res.data.length > 0 && !selectedId) {
        openSession(res.data[0].sessionId);
      }
    } catch (e) {
      console.error("Lỗi tải danh sách phiên:", e);
    }
  };

  // Load chi tiết 1 phiên
  const openSession = async (sessionId) => {
    setSelectedId(sessionId);
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/admin/chat/sessions/${sessionId}`);
      setDetail(res.data);
    } catch (e) {
      console.error("Lỗi tải chi tiết phiên:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 24, fontFamily: "'Inter', system-ui, sans-serif", color: "#1e293b" }}>
      <h2 style={{ fontSize: 24, fontWeight: 800, color: "#0f172a", marginBottom: 20 }}>Quản lý Chatbot</h2>

      {/* Tab switcher */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        {["stats", "sessions"].map((t) => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: "10px 24px", borderRadius: 8, cursor: "pointer",
            background: tab === t ? "#1d4ed8" : "#f1f5f9",
            color: tab === t ? "#fff" : "#475569",
            border: "none", fontWeight: tab === t ? 700 : 600,
            fontSize: 14, transition: "all 0.2s ease"
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
              { label: "Tổng phiên chat",    value: stats.totalSessions,  color: "#1d4ed8" },
              { label: "Tin nhắn của khách", value: stats.totalMessages,  color: "#16a34a" },
              { label: "Phiên hôm nay",      value: stats.todaySessions,  color: "#d97706" },
            ].map((card) => (
              <div key={card.label} style={{
                flex: 1, background: "#fff", border: "1px solid #e2e8f0",
                borderRadius: 12, padding: 24, textAlign: "center",
                boxShadow: "0 4px 15px rgba(0,0,0,0.03)",
              }}>
                <div style={{ fontSize: 40, fontWeight: 800, color: card.color, lineHeight: 1.2 }}>
                  {card.value}
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#64748b", marginTop: 8 }}>
                  {card.label}
                </div>
              </div>
            ))}
          </div>

          {/* Biểu đồ cột đơn giản — 7 ngày gần nhất */}
          <div style={{ background: "#fff", border: "1px solid #e2e8f0",
                        borderRadius: 12, padding: 24, boxShadow: "0 4px 15px rgba(0,0,0,0.03)" }}>
            <h4 style={{ margin: "0 0 20px", fontSize: 16, fontWeight: 700, color: "#0f172a" }}>
              Số phiên chat theo ngày (7 ngày gần nhất)
            </h4>
            <div style={{ display: "flex", alignItems: "flex-end",
                          gap: 12, height: 160, paddingTop: 20 }}>
              {stats.dailyChart.map((d) => {
                const max   = Math.max(...stats.dailyChart.map((x) => x.count), 1);
                const pct   = (d.count / max) * 100;
                return (
                  <div key={d.date} style={{ flex: 1, textAlign: "center", display: "flex", flexDirection: "column", height: "100%", justifyContent: "flex-end" }}>
                    <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 6, color: "#1e293b" }}>
                      {d.count}
                    </div>
                    <div style={{
                      height: `${pct}%`, minHeight: 6,
                      background: "#1d4ed8", borderRadius: "4px 4px 0 0",
                      transition: "height 0.3s ease"
                    }} />
                    <div style={{ fontSize: 11, fontWeight: 600, color: "#64748b", marginTop: 8 }}>
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
        <div style={{ display: "flex", gap: 20, minHeight: 480 }}>

          {/* Danh sách phiên bên trái */}
          <div style={{ width: 340, flexShrink: 0, background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 12, padding: 16 }}>
            <h4 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 700, color: "#0f172a" }}>
              Danh sách phiên ({sessions.length})
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 520, overflowY: "auto" }}>
              {sessions.map((s) => (
                <div key={s.sessionId} onClick={() => openSession(s.sessionId)}
                  style={{
                    padding: "12px 14px", borderRadius: 8, cursor: "pointer",
                    background: selectedId === s.sessionId ? "#eff6ff" : "#f8fafc",
                    border: selectedId === s.sessionId
                      ? "1.5px solid #1d4ed8" : "1px solid #e2e8f0",
                    transition: "all 0.2s ease"
                  }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a",
                                overflow: "hidden", textOverflow: "ellipsis",
                                whiteSpace: "nowrap" }}>
                    {s.sessionId}
                  </div>
                  <div style={{ fontSize: 11, color: "#64748b", marginTop: 4, display: "flex", justifyContent: "space-between" }}>
                    <span>🕐 {s.startTime ? s.startTime.slice(0, 16).replace("T", " ") : "2026-03-20 09:14"}</span>
                    <span style={{ fontWeight: 600, color: "#1d4ed8" }}>{s.messageCount} tin nhắn</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chi tiết phiên bên phải */}
          <div style={{ flex: 1, background: "#f8fafc", border: "1px solid #e2e8f0",
                        borderRadius: 12, padding: 20, display: "flex", flexDirection: "column" }}>
            {!detail ? (
              <div style={{ color: "#94a3b8", textAlign: "center", marginTop: 120, fontSize: 14 }}>
                Chọn một phiên bên trái để xem nội dung hội thoại
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12, flex: 1, overflowY: "auto" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#475569", paddingBottom: 10, borderBottom: "1px solid #e2e8f0" }}>
                  Phiên làm việc: #{selectedId}
                </div>
                {detail.map((msg, i) => (
                  <div key={i} style={{
                    textAlign: msg.role === "user" ? "right" : "left",
                  }}>
                    <span style={{
                      display: "inline-block", maxWidth: "75%",
                      padding: "10px 14px", borderRadius: 12, fontSize: 13.5,
                      lineHeight: 1.5,
                      background: msg.role === "user" ? "#1d4ed8" : "#ffffff",
                      color: msg.role === "user" ? "#ffffff" : "#1e293b",
                      border: msg.role === "assistant" ? "1px solid #cbd5e1" : "none",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.03)"
                    }}>
                      {msg.content}
                    </span>
                    <div style={{ fontSize: 10.5, color: "#94a3b8", marginTop: 4, fontWeight: 600 }}>
                      {msg.role === "user" ? "👤 Khách hàng" : "🤖 Trợ lý ULTRASPORT"}
                      &nbsp;·&nbsp;
                      {msg.createdAt ? msg.createdAt.slice(11, 16) : "09:14"}
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
