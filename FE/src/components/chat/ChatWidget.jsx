import { useState, useRef, useEffect, Fragment } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  MessageCircle, 
  X, 
  Send, 
  Paperclip, 
  Bot, 
  Sparkles,
  ChevronRight,
  Lock,
  LogIn
} from 'lucide-react';
import axiosInstance from '../../api/axiosInstance';
import './ChatWidget.css';

export default function ChatWidget() {
  const navigate = useNavigate();
  const location = useLocation();

  // Không hiển thị Chat Widget trên các trang Admin
  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef(null);

  // Kiểm tra trạng thái đăng nhập của người dùng
  const token = localStorage.getItem('token');
  const isLoggedIn = !!token && token !== 'undefined' && token !== 'null';

  // Session ID cho cuộc hội thoại
  const sessionIdRef = useRef(
    localStorage.getItem("chat_session") ||
      (() => {
        const id = typeof crypto !== 'undefined' && crypto.randomUUID 
          ? crypto.randomUUID() 
          : 'session-' + Date.now() + '-' + Math.random().toString(36).substring(2, 9);
        localStorage.setItem("chat_session", id);
        return id;
      })()
  );

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: 'Chào mừng bạn đến với ULTRASPORT! Bạn cần tư vấn chọn mẫu giày, áo đấu hay sản phẩm thể thao nào ạ?',
      time: 'Vừa xong'
    }
  ]);

  // Tải lại lịch sử cuộc trò chuyện từ Backend DB khi đã đăng nhập
  useEffect(() => {
    if (isOpen && isLoggedIn) {
      fetchChatHistory();
    }
  }, [isOpen, isLoggedIn]);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  const fetchChatHistory = async () => {
    try {
      const response = await axiosInstance.get('/chat/history');
      const historyData = response.data;
      if (Array.isArray(historyData) && historyData.length > 0) {
        const loadedMsgs = historyData.map(m => ({
          id: m.id,
          sender: m.role === 'user' ? 'user' : 'bot',
          text: m.content,
          products: m.products || [],
          time: m.createdAt ? new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Vừa xong'
        }));
        setMessages(loadedMsgs);
      }
    } catch (err) {
      console.error("Lỗi khi tải lịch sử cuộc trò chuyện:", err);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (textToSend) => {
    if (!isLoggedIn) {
      alert("Vui lòng đăng nhập tài khoản để sử dụng Trợ lý tư vấn AI!");
      navigate('/dang-nhap');
      return;
    }

    const text = textToSend || inputText.trim();
    if (!text) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsTyping(true);

    try {
      const response = await axiosInstance.post('/chat', {
        sessionId: sessionIdRef.current,
        message: text
      });

      const data = response.data;
      const reply = data.reply || 'Cảm ơn bạn! Trợ lý ULTRASPORT sẵn sàng tư vấn bất kỳ thông tin sản phẩm nào bạn cần ạ.';
      const recommendedProducts = data.products || [];

      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'bot',
        text: reply,
        products: recommendedProducts,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } catch (err) {
      console.error("Lỗi khi kết nối Chatbot API:", err);
      const isUnauthorized = err.response?.status === 401 || err.message === "Yêu cầu đăng nhập lại";
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'bot',
        text: isUnauthorized 
          ? 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại để tiếp tục trò chuyện!' 
          : 'Xin lỗi, trợ lý tư vấn đang bận một chút. Bạn vui lòng gửi lại câu hỏi nha!',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const formatVND = (val) => {
    if (!val && val !== 0) return 'Liên hệ';
    if (typeof val === 'string' && (val.includes('₫') || val.includes('đ'))) return val;
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  };

  return (
    <>
      {/* 1. FLOATING LAUNCHER BUTTON */}
      {!isOpen && (
        <button 
          className="chat-widget-floating-btn"
          onClick={() => setIsOpen(true)}
          aria-label="Trợ lý tư vấn sản phẩm ULTRASPORT"
          title="Trợ lý tư vấn sản phẩm"
        >
          <MessageCircle size={28} />
          <span className="chat-widget-pulse" />
        </button>
      )}

      {/* 2. CHAT WINDOW POPUP */}
      {isOpen && (
        <div className="chat-widget-window">
          {/* Header */}
          <div className="chat-widget-header">
            <div className="chat-widget-header__info">
              <div className="chat-widget-header__avatar">
                <Sparkles size={20} color="#f6a427" />
              </div>
              <div>
                <h3 className="chat-widget-header__title">Trợ lý tư vấn sản phẩm</h3>
                <div className="chat-widget-header__status">
                  <span className="chat-widget-header__status-dot" />
                  Tư vấn sản phẩm 24/7
                </div>
              </div>
            </div>

            <button 
              className="chat-widget-header__close-btn"
              onClick={() => setIsOpen(false)}
              aria-label="Đóng cửa sổ chat"
            >
              <X size={20} />
            </button>
          </div>

          {/* Chat Messages Body */}
          <div className="chat-widget-body">
            {!isLoggedIn ? (
              /* KHÓA CHAT KHI CHƯA ĐĂNG NHẬP */
              <div className="chat-widget-auth-lock">
                <div className="chat-widget-auth-lock__icon">
                  <Lock size={26} />
                </div>
                <h4 className="chat-widget-auth-lock__title">Yêu cầu đăng nhập</h4>
                <p className="chat-widget-auth-lock__text">
                  Vui lòng đăng nhập tài khoản ULTRASPORT để tư vấn trực tiếp và lưu lịch sử cuộc trò chuyện của bạn.
                </p>
                <button 
                  className="chat-widget-auth-lock__btn"
                  onClick={() => {
                    setIsOpen(false);
                    navigate('/dang-nhap');
                  }}
                >
                  <LogIn size={18} />
                  <span>Đăng nhập ngay</span>
                </button>
              </div>
            ) : (
              /* HIỂN THỊ HỘI THOẠI KHI ĐÃ ĐĂNG NHẬP */
              <>
                {messages.map((msg) => (
                  <Fragment key={msg.id}>
                    <div className={`chat-widget-msg ${msg.sender === 'user' ? 'chat-widget-msg--user' : 'chat-widget-msg--bot'}`}>
                      {msg.sender === 'bot' && (
                        <div className="chat-widget-msg__avatar">
                          <Bot size={16} />
                        </div>
                      )}
                      <div className="chat-widget-msg__bubble">
                        {msg.text}
                      </div>
                    </div>

                    {/* THẺ SẢN PHẨM TRỰC QUAN KHI CHATBOT GỢI Ý */}
                    {msg.sender === 'bot' && msg.products && msg.products.length > 0 && (
                      <div className="chat-widget-product-list">
                        {msg.products.map((p) => (
                          <div 
                            key={p.productId} 
                            className="chat-widget-product-card"
                            onClick={() => {
                              navigate(`/san-pham/${p.slug || p.productId}`);
                              setIsOpen(false);
                            }}
                            title={`Xem chi tiết sản phẩm ${p.productName}`}
                          >
                            <img 
                              src={p.imageUrl || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&auto=format&fit=crop&q=80'} 
                              alt={p.productName} 
                              className="chat-widget-product-card__img" 
                            />
                            <div className="chat-widget-product-card__info">
                              <div className="chat-widget-product-card__name">{p.productName}</div>
                              <div className="chat-widget-product-card__meta">{p.brandName || 'ULTRASPORT'}</div>
                              <div className="chat-widget-product-card__price">{formatVND(p.salePrice || p.basePrice)}</div>
                            </div>
                            <div className="chat-widget-product-card__btn">
                              Xem <ChevronRight size={13} />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </Fragment>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="chat-widget-msg chat-widget-msg--bot">
                    <div className="chat-widget-msg__avatar">
                      <Bot size={16} />
                    </div>
                    <div className="chat-widget-typing">
                      <span className="chat-widget-typing__dot" />
                      <span className="chat-widget-typing__dot" />
                      <span className="chat-widget-typing__dot" />
                    </div>
                  </div>
                )}
              </>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input Bar */}
          <form 
            className="chat-widget-footer"
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
          >
            <button 
              type="button" 
              className="chat-widget-footer__attach-btn"
              title="Đính kèm tệp"
              disabled={!isLoggedIn}
              onClick={() => alert("Tính năng đính kèm hình ảnh đang được cập nhật!")}
            >
              <Paperclip size={20} />
            </button>

            <div className="chat-widget-footer__input-wrapper">
              <input
                type="text"
                className="chat-widget-footer__input"
                placeholder={isLoggedIn ? "Hỏi tư vấn sản phẩm (Giày Nike, size 41...)" : "Vui lòng đăng nhập để gửi câu hỏi..."}
                value={inputText}
                disabled={!isLoggedIn}
                onChange={(e) => setInputText(e.target.value)}
              />
            </div>

            <button 
              type="submit" 
              className="chat-widget-footer__send-btn"
              disabled={!isLoggedIn || !inputText.trim()}
              title="Gửi câu hỏi"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
