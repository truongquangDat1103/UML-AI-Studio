import { useState } from 'react'
import { motion } from 'framer-motion'
import { Database, Download, Upload, Clock, CheckCircle, AlertCircle, HardDrive } from 'lucide-react'
import toast from 'react-hot-toast'

const font = "'Inter', -apple-system, sans-serif"
const card = { backgroundColor: 'white', borderRadius: 20, border: '1px solid #E5E7EB', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }

const backupHistory = [
  { id: 1, name: 'backup_20260416_140000.zip', size: '12.4 MB', date: '16/04/2026 14:00', status: 'SUCCESS' },
  { id: 2, name: 'backup_20260415_140000.zip', size: '11.9 MB', date: '15/04/2026 14:00', status: 'SUCCESS' },
  { id: 3, name: 'backup_20260414_140000.zip', size: '11.6 MB', date: '14/04/2026 14:00', status: 'SUCCESS' },
  { id: 4, name: 'backup_20260413_140000.zip', size: '11.2 MB', date: '13/04/2026 14:00', status: 'FAILED' },
]

export default function BackupPage() {
  const [loading, setLoading] = useState(false)

  const handleBackup = () => {
    setLoading(true)
    setTimeout(() => { setLoading(false); toast.success('Backup hoàn thành!') }, 2000)
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', fontFamily: font }}>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#111827', margin: '0 0 4px', letterSpacing: '-0.4px' }}>Sao lưu & Phục hồi</h1>
        <p style={{ fontSize: 13, color: '#6B7280', margin: 0 }}>Quản lý backup dữ liệu hệ thống</p>
      </motion.div>

      {/* Quick actions */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 20 }}>
        {[
          { icon: <Download size={20} color="#6B4FDB" />, bg: '#EAE8F5', label: 'Backup ngay', sub: 'Tạo bản sao lưu thủ công', action: handleBackup, loading },
          { icon: <Upload size={20} color="#10B981" />, bg: '#ECFDF5', label: 'Khôi phục', sub: 'Upload file backup để phục hồi', action: () => toast.success('Đang phát triển'), loading: false },
          { icon: <HardDrive size={20} color="#3B82F6" />, bg: '#EFF6FF', label: 'Dung lượng', sub: '47.2 MB / 500 MB đã dùng', action: () => {}, loading: false },
        ].map((item, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }}>
            <button onClick={item.action} disabled={item.loading} style={{
              ...card, padding: '22px 20px', width: '100%', textAlign: 'left', border: '1px solid #E5E7EB',
              cursor: item.loading ? 'wait' : 'pointer', transition: 'all 0.18s', background: 'white',
              display: 'block', fontFamily: font,
            }}
              onMouseEnter={e => { if (!item.loading) { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 20px rgba(0,0,0,0.08)' } }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 1px 4px rgba(0,0,0,0.05)' }}
            >
              <div style={{ width: 44, height: 44, borderRadius: '50%', backgroundColor: item.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                {item.loading ? <div style={{ width: 18, height: 18, borderRadius: '50%', border: '2.5px solid #E5E7EB', borderTopColor: '#6B4FDB', animation: 'spin 0.7s linear infinite' }} /> : item.icon}
              </div>
              <p style={{ fontSize: 14, fontWeight: 700, color: '#111827', margin: '0 0 4px' }}>{item.label}</p>
              <p style={{ fontSize: 12, color: '#6B7280', margin: 0 }}>{item.sub}</p>
            </button>
          </motion.div>
        ))}
      </div>

      {/* Schedule */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={{ marginBottom: 16 }}>
        <div style={{ ...card, padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: '#FEF9C3', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Clock size={18} color="#D97706" />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: '#111827', margin: '0 0 2px' }}>Tự động backup hàng ngày</p>
            <p style={{ fontSize: 12, color: '#9CA3AF', margin: 0 }}>Chạy lúc 14:00 mỗi ngày • Giữ 7 bản gần nhất</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', backgroundColor: '#ECFDF5', borderRadius: 9999 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#10B981' }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: '#10B981' }}>Đang hoạt động</span>
          </div>
        </div>
      </motion.div>

      {/* History */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }}>
        <div style={{ ...card, overflow: 'hidden' }}>
          <div style={{ padding: '14px 24px', borderBottom: '1px solid #E5E7EB', backgroundColor: '#F9FAFB' }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>Lịch sử backup</span>
          </div>
          {backupHistory.map((b, i) => (
            <motion.div key={b.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 + i * 0.06 }}>
              <div style={{ padding: '14px 24px', display: 'flex', alignItems: 'center', gap: 14, borderBottom: i < backupHistory.length - 1 ? '1px solid #F3F4F6' : 'none', transition: 'background-color 0.1s' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = '#FAFAFA'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'}
              >
                {b.status === 'SUCCESS'
                  ? <CheckCircle size={18} color="#10B981" style={{ flexShrink: 0 }} />
                  : <AlertCircle size={18} color="#EF4444" style={{ flexShrink: 0 }} />
                }
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: '#111827', margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.name}</p>
                  <p style={{ fontSize: 11, color: '#9CA3AF', margin: 0 }}>{b.date} • {b.size}</p>
                </div>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 10px', borderRadius: 9999, fontSize: 10, fontWeight: 700, backgroundColor: b.status === 'SUCCESS' ? '#ECFDF5' : '#FEF2F2', color: b.status === 'SUCCESS' ? '#10B981' : '#EF4444' }}>
                  {b.status}
                </span>
                <button onClick={() => toast.success('Đang tải xuống: ' + b.name)} style={{ padding: '7px 14px', backgroundColor: '#EAE8F5', color: '#6B4FDB', border: 'none', borderRadius: 9999, fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: font, display: 'flex', alignItems: 'center', gap: 5 }}>
                  <Download size={11} /> Tải
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
