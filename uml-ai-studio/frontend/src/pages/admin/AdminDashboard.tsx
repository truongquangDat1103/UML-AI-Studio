import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Users, Activity, Server, Database, RefreshCw, TrendingUp } from 'lucide-react'

const font = "'Inter', -apple-system, sans-serif"
const card = {
  backgroundColor: 'white', borderRadius: 20,
  border: '1px solid #E5E7EB', boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
}

const recentActivity = [
  { dot: '#6B4FDB', text: 'User tạo sơ đồ Use Case', time: '2 phút trước' },
  { dot: '#10B981', text: 'System backup hoàn thành', time: '1 giờ trước' },
  { dot: '#F59E0B', text: 'Quota reset hàng ngày', time: '6 giờ trước' },
  { dot: '#6B4FDB', text: 'User mới đăng ký', time: '8 giờ trước' },
  { dot: '#10B981', text: 'AI config cập nhật', time: '12 giờ trước' },
]

// Fake bar chart data
const chartData = [
  { day: 'T2', val: 42 }, { day: 'T3', val: 68 }, { day: 'T4', val: 55 },
  { day: 'T5', val: 91 }, { day: 'T6', val: 73 }, { day: 'T7', val: 38 }, { day: 'CN', val: 24 },
]
const maxVal = Math.max(...chartData.map(d => d.val))

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setStats({ totalUsers: 124, activeUsers: 45, diagramsCreated: 1205, successRate: 98, systemHealth: 100, dbStatus: 'Connected', uptime: '15d 4h' })
      setLoading(false)
    }, 600)
  }, [])

  const statCards = [
    { icon: <Users size={18} color="#6B4FDB" />, bg: '#EAE8F5', label: 'Người dùng', value: stats?.totalUsers, sub: `${stats?.activeUsers} active hôm nay`, subColor: '#6B7280' },
    { icon: <Activity size={18} color="#7C3AED" />, bg: '#F5F3FF', label: 'Lượt sinh AI', value: stats?.diagramsCreated, sub: `Tỷ lệ thành công ${stats?.successRate}%`, subColor: '#10B981' },
    { icon: <Server size={18} color="#10B981" />, bg: '#ECFDF5', label: 'System Health', value: `${stats?.systemHealth}%`, sub: `Uptime: ${stats?.uptime}`, subColor: '#6B7280' },
    { icon: <Database size={18} color="#3B82F6" />, bg: '#EFF6FF', label: 'Database', value: null, sub: null, connected: true },
  ]

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', fontFamily: font }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#111827', margin: '0 0 4px', letterSpacing: '-0.4px' }}>Tổng quan Hệ thống</h1>
          <p style={{ fontSize: 13, color: '#6B7280', margin: 0 }}>Trạng thái UML AI Studio theo thời gian thực</p>
        </div>
        <button onClick={() => { setLoading(true); setTimeout(() => setLoading(false), 600) }} style={{
          display: 'flex', alignItems: 'center', gap: 6, padding: '9px 16px',
          backgroundColor: 'white', border: '1.5px solid #E5E7EB', borderRadius: 12,
          fontSize: 13, fontWeight: 600, color: '#374151', cursor: 'pointer', fontFamily: font,
        }}>
          <RefreshCw size={14} /> Làm mới
        </button>
      </motion.div>

      {/* Stat cards */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 20 }}>
          {[1,2,3,4].map(i => <div key={i} style={{ height: 120, borderRadius: 20, backgroundColor: '#E5E7EB', animation: 'pulse 1.5s ease-in-out infinite' }} />)}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 20 }}>
          {statCards.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }}>
              <div style={{ ...card, padding: 20, transition: 'all 0.18s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 20px rgba(0,0,0,0.08)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 1px 4px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', backgroundColor: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {s.icon}
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>{s.label}</span>
                </div>
                {s.connected ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#3B82F6', animation: 'pulse 2s ease-in-out infinite' }} />
                    <span style={{ fontSize: 16, fontWeight: 700, color: '#3B82F6' }}>Connected</span>
                  </div>
                ) : (
                  <>
                    <p style={{ fontSize: 28, fontWeight: 800, color: '#111827', margin: '0 0 4px', letterSpacing: '-0.5px' }}>{s.value}</p>
                    <p style={{ fontSize: 12, color: s.subColor, margin: 0, fontWeight: 500 }}>{s.sub}</p>
                  </>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Chart + Activity */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
        {/* Bar chart */}
        <div style={{ ...card, padding: '24px 28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#111827', margin: 0 }}>Lượt sinh sơ đồ (7 ngày)</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, backgroundColor: '#EAE8F5', padding: '4px 12px', borderRadius: 9999 }}>
              <TrendingUp size={13} color="#6B4FDB" />
              <span style={{ fontSize: 12, fontWeight: 700, color: '#6B4FDB' }}>+18%</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 160 }}>
            {chartData.map((d, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, height: '100%', justifyContent: 'flex-end' }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#6B4FDB' }}>{d.val}</span>
                <motion.div
                  initial={{ height: 0 }} animate={{ height: `${(d.val / maxVal) * 120}px` }}
                  transition={{ delay: 0.1 + i * 0.06, duration: 0.5, ease: 'easeOut' }}
                  style={{ width: '100%', backgroundColor: '#6B4FDB', borderRadius: '6px 6px 4px 4px', minHeight: 4, opacity: 0.75 + (i * 0.03) }}
                />
                <span style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 500 }}>{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent activity */}
        <div style={{ ...card, padding: '24px 20px' }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#111827', margin: '0 0 20px' }}>Hoạt động gần đây</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {recentActivity.map((a, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 + i * 0.06 }}
                style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: a.dot, flexShrink: 0, marginTop: 4 }} />
                <div>
                  <p style={{ fontSize: 13, fontWeight: 500, color: '#374151', margin: '0 0 2px' }}>{a.text}</p>
                  <span style={{ fontSize: 11, color: '#9CA3AF' }}>{a.time}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
    </div>
  )
}
