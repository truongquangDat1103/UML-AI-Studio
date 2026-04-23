import { motion } from 'framer-motion'
import { BarChart2, TrendingUp, Users, FileCode2 } from 'lucide-react'

const font = "'Inter', -apple-system, sans-serif"
const card = { backgroundColor: 'white', borderRadius: 20, border: '1px solid #E5E7EB', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }

const statData = [
  { label: 'Tổng người dùng', value: '124', change: '+12%', up: true, icon: <Users size={18} color="#6B4FDB" />, bg: '#EAE8F5' },
  { label: 'Sơ đồ đã tạo', value: '1,205', change: '+8%', up: true, icon: <FileCode2 size={18} color="#7C3AED" />, bg: '#F5F3FF' },
  { label: 'Lượt dùng AI / ngày', value: '87', change: '+5%', up: true, icon: <TrendingUp size={18} color="#10B981" />, bg: '#ECFDF5' },
  { label: 'Tỷ lệ thành công', value: '98%', change: 'Ổn định', up: true, icon: <BarChart2 size={18} color="#3B82F6" />, bg: '#EFF6FF' },
]

const typeDistribution = [
  { type: 'Use Case', count: 612, pct: 51, color: '#6B4FDB' },
  { type: 'Class Diagram', count: 389, pct: 32, color: '#7C3AED' },
  { type: 'Sequence', count: 134, pct: 11, color: '#3B82F6' },
  { type: 'Khác', count: 70, pct: 6, color: '#9CA3AF' },
]

const weeklyData = [120, 85, 143, 99, 178, 95, 64]
const weekDays = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']
const maxWeekly = Math.max(...weeklyData)

export default function StatsPage() {
  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', fontFamily: font }}>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#111827', margin: '0 0 4px', letterSpacing: '-0.4px' }}>Thống kê</h1>
        <p style={{ fontSize: 13, color: '#6B7280', margin: 0 }}>Dữ liệu tổng hợp hoạt động hệ thống</p>
      </motion.div>

      {/* Top stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 20 }}>
        {statData.map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }}>
            <div style={{ ...card, padding: 20, transition: 'all 0.18s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 20px rgba(0,0,0,0.08)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 1px 4px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', backgroundColor: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {s.icon}
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#6B7280' }}>{s.label}</span>
              </div>
              <p style={{ fontSize: 28, fontWeight: 800, color: '#111827', margin: '0 0 4px', letterSpacing: '-0.5px' }}>{s.value}</p>
              <span style={{ fontSize: 11, fontWeight: 700, color: s.up ? '#10B981' : '#EF4444' }}>{s.change} so với tuần trước</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 16 }}>
        {/* Weekly bar */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <div style={{ ...card, padding: '24px 28px' }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#111827', margin: '0 0 24px' }}>Lưu lượng tạo sơ đồ theo tuần</h3>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, height: 180 }}>
              {weeklyData.map((v, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, height: '100%', justifyContent: 'flex-end' }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#6B4FDB' }}>{v}</span>
                  <motion.div
                    initial={{ height: 0 }} animate={{ height: `${(v / maxWeekly) * 140}px` }}
                    transition={{ delay: 0.3 + i * 0.06, duration: 0.5, ease: 'easeOut' }}
                    style={{ width: '100%', background: 'linear-gradient(180deg, #8B6FE8 0%, #6B4FDB 100%)', borderRadius: '6px 6px 4px 4px', minHeight: 4 }}
                  />
                  <span style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 500 }}>{weekDays[i]}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Type distribution */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <div style={{ ...card, padding: '24px 24px' }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#111827', margin: '0 0 20px' }}>Phân bổ loại sơ đồ</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {typeDistribution.map((t, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>{t.type}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: t.color }}>{t.pct}% ({t.count})</span>
                  </div>
                  <div style={{ width: '100%', height: 8, backgroundColor: '#E5E7EB', borderRadius: 9999, overflow: 'hidden' }}>
                    <motion.div
                      initial={{ width: 0 }} animate={{ width: `${t.pct}%` }}
                      transition={{ delay: 0.35 + i * 0.08, duration: 0.6, ease: 'easeOut' }}
                      style={{ height: '100%', backgroundColor: t.color, borderRadius: 9999 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
