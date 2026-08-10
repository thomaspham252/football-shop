import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Filter, 
  FileText, 
  Wrench, 
  Paperclip, 
  Send, 
  Bot, 
  User, 
  CheckCircle, 
  AlertCircle,
  Sparkles
} from 'lucide-react';
import adminApi from '../../../api/adminApi';
import './AdminBotChatHistory.css';

export default function AdminBotChatHistory() {
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [filter, setFilter] = useState('all'); // 'all', 'resolved', 'need_support'
  const [searchKw, setSearchKw] = useState('');
  const [inputMessage, setInputMessage] = useState('');
  const [isIntervened, setIsIntervened] = useState(false);
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchSessions();
  }, [filter, searchKw]);

  useEffect(() => {
    if (activeSessionId) {
      fetchMessages(activeSessionId);
    }
  }, [activeSessionId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchSessions = async () => {
    try {
      const data = await adminApi.getBotSessions({ filter, keyword: searchKw });
      if (data) {
        setSessions(data);
        if (data.length > 0 && !data.some(s => s.sessionId === activeSessionId)) {
          setActiveSessionId(data[0].sessionId);
        } else if (data.length === 0) {
          setActiveSessionId(null);
          setMessages([]);
        }
      }
    } catch (e) {
      console.error("Lỗi khi lấy danh sách phiên trò chuyện:", e);
    }
  };

  const fetchMessages = async (sid) => {
    if (!sid) {
      setMessages([]);
      return;
    }

    setLoading(true);
    try {
      const data = await adminApi.getBotSessionMessages(sid);
      if (data) {
        setMessages(data);
      }
    } catch (e) {
      console.error("Lỗi khi tải lịch sử tin nhắn phiên:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleIntervention = async () => {
    if (!activeSessionId) return;

    try {
      const data = await adminApi.toggleBotIntervention(activeSessionId);
      if (data) {
        setIsIntervened(data.intervened);
        alert(data.message);
        fetchSessions();
      }
    } catch (e) {
      console.error("Lỗi khi bật Can thiệp:", e);
    }
  };

  const handleSendStaffReply = async (e) => {
    e.preventDefault();
    if (!activeSessionId || !inputMessage.trim()) return;

    try {
      const data = await adminApi.sendBotStaffReply(activeSessionId, inputMessage);
      if (data) {
        setInputMessage('');
        fetchMessages(activeSessionId);
        fetchSessions();
      }
    } catch (e) {
      console.error("Lỗi khi gửi phản hồi nhân viên:", e);
    }
  };

  const handleExportLog = () => {
    if (!activeSessionId || messages.length === 0) return;

    const logContent = messages.map(m => `[${m.createdAt || 'TIME'}] ${m.role.toUpperCase()}: ${m.content}`).join('\n');
    const blob = new Blob([logContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `chat-log-${activeSessionId}.txt`;
    link.click();
  };

  const activeSessionObj = sessions.find(s => s.sessionId === activeSessionId) || {
    sessionId: activeSessionId || 'Chua chon phien',
    userName: activeSessionId || 'Chua chon phien',
    userAvatar: activeSessionId ? activeSessionId.substring(0, 1).toUpperCase() : 'C',
    intervened: isIntervened
  };

  return (
    <div className="bot-admin-chathistory">
      {/* ── LEFT PANEL: SESSIONS LIST & FILTERS ── */}
      <div className="bot-admin-sessions-panel">
        <h2 className="bot-admin-sessions-panel__title">Lịch sử Trò chuyện</h2>

        {/* Search Input */}
        <div className="bot-admin-search-wrapper">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            className="bot-admin-search-input"
            placeholder="Tìm kiếm phiên trò chuyện..."
            value={searchKw}
            onChange={(e) => setSearchKw(e.target.value)}
          />
        </div>



        {/* Sessions List */}
        <div className="bot-admin-sessions-list">
          {sessions.map((s) => {
            const isActive = s.sessionId === activeSessionId;
            return (
              <div
                key={s.sessionId}
                className={`bot-admin-session-card ${isActive ? 'active' : ''}`}
                onClick={() => {
                  setActiveSessionId(s.sessionId);
                  setIsIntervened(s.intervened);
                }}
              >
                <div className="bot-admin-session-card__header">
                  <span className="bot-admin-session-card__name">{s.sessionId}</span>
                  <span className="bot-admin-session-card__time">{s.formattedTime}</span>
                </div>
                <div className="bot-admin-session-card__sub">
                  {s.messageCount} tin nhắn
                </div>
                <div className="bot-admin-session-card__footer">
                  <span className="bot-admin-tag">{s.tag}</span>
                  {s.intervened && (
                    <span className="bot-admin-status-badge intervened">
                      Đã can thiệp
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── RIGHT PANEL: DETAILED CONVERSATION TIMELINE ── */}
      <div className="bot-admin-chat-detail">
        {/* Header */}
        <div className="bot-admin-chat-detail__header">
          <div className="bot-admin-chat-detail__user">
            <div className="bot-admin-avatar">
              {activeSessionObj.userAvatar}
            </div>
            <div>
              <h3 className="bot-admin-chat-detail__name">{activeSessionObj.sessionId}</h3>
              <div className="bot-admin-chat-detail__status">
                <span className="dot online" />
                Session ID: #{activeSessionObj.sessionId}
              </div>
            </div>
          </div>
        </div>

        {/* Timeline Body */}
        <div className="bot-admin-chat-detail__body">
          <div className="bot-admin-date-separator">
            <span>2026-03-20</span>
          </div>

          {messages.map((m, idx) => {
            const isUser = m.role === 'user';
            const isStaff = m.content && m.content.startsWith('[Nhân viên hỗ trợ]');

            return (
              <div key={m.id || idx} className={`bot-admin-msg-row ${isUser ? 'user' : 'bot'}`}>
                {!isUser && (
                  <div className="bot-admin-msg-avatar">
                    <Bot size={16} />
                  </div>
                )}
                <div className="bot-admin-msg-content">
                  <div className={`bot-admin-msg-bubble ${isUser ? 'user-bubble' : isStaff ? 'staff-bubble' : 'bot-bubble'}`}>
                    {m.content}
                  </div>
                  <div className="bot-admin-msg-time">
                    {!isUser && (isStaff ? 'Nhân viên • ' : 'Bot • ')}
                    {m.createdAt ? new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '09:14 AM'}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form className="bot-admin-chat-detail__footer" onSubmit={handleSendStaffReply}>
          <button type="button" className="bot-admin-footer-icon" title="Đính kèm tệp">
            <Paperclip size={20} />
          </button>

          <input
            type="text"
            className="bot-admin-footer-input"
            placeholder="Phiên trò chuyện đã hoàn thành. Xem nhật ký hội thoại bên trên..."
            value={inputMessage}
            disabled={true}
            onChange={(e) => setInputMessage(e.target.value)}
          />

          <button 
            type="submit" 
            className="bot-admin-footer-send"
            disabled={!isIntervened || !inputMessage.trim()}
            title="Gửi tin nhắn nhân viên"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
