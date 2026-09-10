import { useEffect, useState } from 'react';
import {
  CheckCircle2,
  MessageSquare,
  RefreshCw,
  TrendingDown,
  TrendingUp,
  Users
} from 'lucide-react';
import adminApi from '../../../api/adminApi';
import './AdminBotDashboard.css';

const EMPTY_STATS = {
  totalSessions: 0,
  totalSessionsGrowth: '0%',
  totalMessages: 0,
  totalMessagesGrowth: '0%',
  todaySessions: 0,
  todaySessionsGrowth: '0%',
  chartData: []
};

export default function AdminBotDashboard() {
  const [timeRange, setTimeRange] = useState('week');
  const [stats, setStats] = useState(EMPTY_STATS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStats();
  }, [timeRange]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getBotStats(timeRange);
      setStats(data || EMPTY_STATS);
    } catch (e) {
      console.error('Loi khi tai thong ke Chatbot Admin:', e);
      setStats(EMPTY_STATS);
    } finally {
      setLoading(false);
    }
  };

  const chartData = stats.chartData || [];
  const maxChartVal = Math.max(...chartData.map((d) => d.count), 1);

  return (
    <div className="bot-admin-dashboard">
      <div className="bot-admin-dashboard__header">
        <div>
          <h2 className="bot-admin-dashboard__title">Tong Quan Chatbot</h2>
          <p className="bot-admin-dashboard__subtitle">
            Theo doi so phien chat, tin nhan khach hang va xu huong 7 ngay gan nhat.
          </p>
        </div>

        <button className="bot-admin-btn-refresh" onClick={fetchStats} title="Lam moi du lieu">
          <RefreshCw size={16} className={loading ? 'spin' : ''} />
          <span>Cap nhat</span>
        </button>
      </div>

      <div className="bot-admin-stats-grid">
        <div className="bot-admin-stat-card">
          <div className="bot-admin-stat-card__content">
            <div className="bot-admin-stat-card__label">TONG PHIEN</div>
            <div className="bot-admin-stat-card__val">{stats.totalSessions}</div>
            <div className="bot-admin-stat-card__growth positive">
              <span className="growth-badge">
                <TrendingUp size={13} /> {stats.totalSessionsGrowth}
              </span>
              <span className="growth-text">so voi ky truoc</span>
            </div>
          </div>
          <div className="bot-admin-stat-card__icon icon-blue">
            <MessageSquare size={24} />
          </div>
        </div>

        <div className="bot-admin-stat-card">
          <div className="bot-admin-stat-card__content">
            <div className="bot-admin-stat-card__label">TIN NHAN KHACH</div>
            <div className="bot-admin-stat-card__val">{stats.totalMessages}</div>
            <div className="bot-admin-stat-card__growth positive">
              <span className="growth-badge">
                <TrendingUp size={13} /> {stats.totalMessagesGrowth}
              </span>
              <span className="growth-text">so voi ky truoc</span>
            </div>
          </div>
          <div className="bot-admin-stat-card__icon icon-light-blue">
            <Users size={24} />
          </div>
        </div>

        <div className="bot-admin-stat-card">
          <div className="bot-admin-stat-card__content">
            <div className="bot-admin-stat-card__label">HOM NAY</div>
            <div className="bot-admin-stat-card__val">{stats.todaySessions}</div>
            <div className="bot-admin-stat-card__growth negative">
              <span className="growth-badge">
                <TrendingDown size={13} /> {stats.todaySessionsGrowth}
              </span>
              <span className="growth-text">so voi ky truoc</span>
            </div>
          </div>
          <div className="bot-admin-stat-card__icon icon-dark-blue">
            <CheckCircle2 size={24} />
          </div>
        </div>
      </div>

      <div className="bot-admin-chart-card">
        <div className="bot-admin-chart-card__header">
          <h3 className="bot-admin-chart-card__title">
            So phien chat theo ngay trong 7 ngay gan nhat
          </h3>

          <div className="bot-admin-chart-card__filters">
            {[
              { value: 'day', label: 'Ngay' },
              { value: 'week', label: 'Tuan' },
              { value: 'month', label: 'Thang' }
            ].map((range) => (
              <button
                key={range.value}
                className={`bot-admin-filter-btn ${timeRange === range.value ? 'active' : ''}`}
                onClick={() => setTimeRange(range.value)}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>

        <div className="bot-admin-chart-body">
          <div className="bot-admin-chart-yaxis">
            <span>{maxChartVal}</span>
            <span>{Math.ceil(maxChartVal * 0.66)}</span>
            <span>{Math.ceil(maxChartVal * 0.33)}</span>
            <span>0</span>
          </div>

          <div className="bot-admin-chart-bars">
            {chartData.map((item, idx) => {
              const heightPercent = item.count === 0
                ? 4
                : Math.min(100, Math.max(15, (item.count / maxChartVal) * 100));
              const isHighlight = idx === chartData.length - 1;

              return (
                <div key={item.label} className="bot-admin-chart-col">
                  <div className="bot-admin-bar-wrapper">
                    <div
                      className={`bot-admin-bar ${isHighlight ? 'highlight' : ''}`}
                      style={{ height: `${heightPercent}%` }}
                      title={`${item.label}: ${item.count} phien`}
                    />
                  </div>
                  <span className={`bot-admin-chart-label ${isHighlight ? 'active' : ''}`}>
                    {item.label}
                  </span>
                </div>
              );
            })}

            {chartData.length === 0 && (
              <div style={{ padding: '32px', color: '#94a3b8', width: '100%', textAlign: 'center' }}>
                Chua co du lieu phien chat de hien thi.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
