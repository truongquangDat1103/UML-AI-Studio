import { useState } from 'react'
import { motion } from 'framer-motion'
import { Zap, Users, RefreshCw, Save, TrendingUp } from 'lucide-react'
import toast from 'react-hot-toast'

const font = "'Inter', -apple-system, sans-serif"
const card = { backgroundColor: 'white', borderRadius: 20, border: '1px solid #E5E7EB', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }

const userQuotas = [
  { name: 'Admin', email: 'admin@umlstudio.ai', role: 'ADMIN', used: 45, limit: 0, unlimited: true },
  { name: 'Nguyễn Văn A', email: 'nguyenvana@gmail.com', role: 'USER', used: 12, limit: 20 },
  { name: 'Trần Thị B', email: 'tranthib@example.com', role: 'USER', used: 3, limit: 20 },
  { name: 'Phạm Thị D', email: 'phamthid@example.com', role: 'USER', used: 19, limit: 20 },
]

export default function QuotaPage() {
  const [defaultQuota, setDefaultQuota] = useState('20')
  const [resetHour, setResetHour] = useState('00')

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', fontFamily: font }}>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#111827', margin: '0 0 4px', letterSpacing: '-0.4px' }}>Quản lý Quota</h1>
        <p style={{ fontSize: 13, color: '#6B7280', margin: 0 }}>Cấu hình giới hạn lượt tạo sơ đồ hàng ngày</p>
      </motion.div>

      {/* Global settings */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} style={{ marginBottom: 16 }}>
        <div style={{ ...card, padding: '24px 28px' }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#111827', margin: '0 0 20px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Zap size={17} color="#6B4FDB" /> Cấu hình toàn cục
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 16, alignItems: 'flex-end' }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Quota mặc định / ngày</label>
              <input type="number" value={defaultQuota} onChange={e => setDefaultQuota(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', backgroundColor: '#F9FAFB', border: '1.5px solid #E5E7EB', borderRadius: 12, fontSize: 14, fontWeight: 700, color: '#111827', outline: 'none', fontFamily: font, boxSizing: 'border-box' }}
                onFocus={e => { e.target.style.borderColor = '#6B4FDB'; e.target.style.boxShadow = '0 0 0 3px rgba(107,79,219,0.1)' }}
                onBlur={e => { e.target.style.borderColor = '#E5E7EB'; e.target.style.boxShadow = 'none' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Giờ reset quota</label>
              <select value={resetHour} onChange={e => setResetHour(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', backgroundColor: '#F9FAFB', border: '1.5px solid #E5E7EB', borderRadius: 12, fontSize: 14, color: '#111827', outline: 'none', fontFamily: font, cursor: 'pointer' }}>
                {['00', '06', '12', '18'].map(h => <option key={h} value={h}>{h}:00 (GMT+7)</option>)}
              </select>
            </div>
            <button onClick={() => toast.success('Đã lưu cài đặt quota!')} style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '11px 20px',
              backgroundColor: '#6B4FDB', color: 'white', border: 'none', borderRadius: 12,
              fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: font,
              boxShadow: '0 4px 12px rgba(107,79,219,0.25)', whiteSpace: 'nowrap',
            }}>
              <Save size={14} /> Lưu
            </button>
          </div>
        </div>
      </motion.div>

      {/* Per-user quota */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }}>
        <div style={{ ...card, overflow: 'hidden' }}>
          <div style={{ padding: '16px 24px', borderBottom: '1px solid #E5E7EB', backgroundColor: '#F9FAFB', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Users size={15} color="#6B4FDB" />
            <span style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>Quota từng người dùng</span>
          </div>
          <div style={{ padding: '8px 0' }}>
            {userQuotas.map((u, i) => {
              const pct = u.unlimited ? 100 : (u.used / u.limit) * 100
              const barColor = pct >= 90 ? '#EF4444' : pct >= 70 ? '#F59E0B' : '#6B4FDB'
              return (
                <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.06 }}>
                  <div style={{ padding: '14px 24px', display: 'flex', alignItems: 'center', gap: 16, borderBottom: i < userQuotas.length - 1 ? '1px solid #F3F4F6' : 'none', transition: 'background-color 0.1s' }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = '#FAFAFA'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'}
                  >
                    <div style={{ width: 36, height: 36, borderRadius: '50%', backgroundColor: u.role === 'ADMIN' ? '#6B4FDB' : '#E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'center', color: u.role === 'ADMIN' ? 'white' : '#6B7280', fontWeight: 700, fontSize: 14, flexShrink: 0 }}>
                      {u.name.charAt(0)}
                    </div>
                    <div style={{ minWidth: 180 }}>
                      <p style={{ fontSize: 13, fontWeight: 700, color: '#111827', margin: '0 0 2px' }}>{u.name}</p>
                      <p style={{ fontSize: 11, color: '#9CA3AF', margin: 0 }}>{u.email}</p>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                        <span style={{ fontSize: 11, color: '#6B7280', fontWeight: 500 }}>Đã dùng hôm nay</span>
                        <span style={{ fontSize: 12, fontWeight: 700, color: barColor }}>{u.used} / {u.unlimited ? '∞' : u.limit}</span>
                      </div>
                      <div style={{ width: '100%', height: 7, backgroundColor: '#E5E7EB', borderRadius: 9999, overflow: 'hidden' }}>
                        <motion.div
                          initial={{ width: 0 }} animate={{ width: `${u.unlimited ? 40 : pct}%` }}
                          transition={{ delay: 0.3 + i * 0.08, duration: 0.5 }}
                          style={{ height: '100%', backgroundColor: barColor, borderRadius: 9999 }}
                        />
                      </div>
                    </div>
                    <button onClick={() => toast.success(`Reset quota cho ${u.name}`)} style={{
                      display: 'flex', alignItems: 'center', gap: 5, padding: '7px 14px',
                      backgroundColor: '#EAE8F5', color: '#6B4FDB', border: 'none', borderRadius: 9999,
                      fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: font, flexShrink: 0,
                    }}>
                      <RefreshCw size={11} /> Reset
                    </button>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
