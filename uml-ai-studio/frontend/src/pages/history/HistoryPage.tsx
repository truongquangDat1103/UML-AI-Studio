import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Clock, Trash2, Eye, Calendar } from 'lucide-react'
import { projectsAPI } from '@/services/apiService'
import toast from 'react-hot-toast'

export default function HistoryPage() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    projectsAPI.list({ sort: 'newest', limit: '50' })
      .then(r => { setItems(r.data || []); setLoading(false) })
      .catch(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Xóa "${title}"?`)) return
    await projectsAPI.delete(id)
    toast.success('Đã xóa')
    load()
  }

  // Group by date
  const grouped: Record<string, any[]> = {}
  items.forEach(item => {
    const d = new Date(item.updatedAt)
    const key = d.toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    if (!grouped[key]) grouped[key] = []
    grouped[key].push(item)
  })

  return (
    <div style={{ maxWidth: 760, margin: '0 auto', fontFamily: "'Inter', sans-serif" }}>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#111827', margin: '0 0 4px', letterSpacing: '-0.4px' }}>Lịch sử</h1>
        <p style={{ fontSize: 13, color: '#6B7280', margin: 0 }}>Tất cả sơ đồ đã tạo theo thời gian</p>
      </motion.div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[1,2,3,4,5].map(i => <div key={i} style={{ height: 64, borderRadius: 16, backgroundColor: '#E5E7EB', animation: 'pulse 1.5s ease-in-out infinite' }} />)}
        </div>
      ) : items.length === 0 ? (
        <div style={{
          backgroundColor: 'white', borderRadius: 20, border: '1px solid #E5E7EB',
          padding: '80px 40px', textAlign: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
        }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', backgroundColor: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <Clock size={26} color="#9CA3AF" />
          </div>
          <p style={{ fontSize: 15, fontWeight: 700, color: '#374151', margin: '0 0 6px' }}>Chưa có lịch sử nào</p>
          <p style={{ fontSize: 13, color: '#9CA3AF', margin: 0 }}>Hãy tạo sơ đồ đầu tiên của bạn!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          {Object.entries(grouped).map(([date, dayItems], gi) => (
            <motion.div key={date} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: gi * 0.06 }}>
              {/* Date label */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <Calendar size={12} color="#9CA3AF" />
                <span style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  {date}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {dayItems.map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: gi * 0.06 + i * 0.04 }}
                    style={{ position: 'relative' }}
                    className="history-row"
                  >
                    <div style={{
                      backgroundColor: 'white', borderRadius: 16,
                      border: '1px solid #E5E7EB', padding: '14px 20px',
                      display: 'flex', alignItems: 'center', gap: 14,
                      boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                      transition: 'all 0.15s',
                    }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#D4D0F5'; (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 12px rgba(107,79,219,0.08)' }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#E5E7EB'; (e.currentTarget as HTMLElement).style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)' }}
                    >
                      {/* Dot */}
                      <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#6B4FDB', flexShrink: 0, opacity: 0.7 }} />

                      {/* Info */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 13, fontWeight: 700, color: '#111827', margin: '0 0 4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {item.title}
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ backgroundColor: '#EAE8F5', color: '#6B4FDB', fontSize: 10, fontWeight: 700, padding: '1px 7px', borderRadius: 9999 }}>
                            {item.diagramType}
                          </span>
                          <span style={{ fontSize: 11, color: '#9CA3AF' }}>
                            {new Date(item.updatedAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div style={{ display: 'flex', gap: 6, opacity: 0, transition: 'opacity 0.15s' }} className="history-actions">
                        <Link to={`/editor/${item.id}`} style={{
                          width: 30, height: 30, borderRadius: '50%',
                          backgroundColor: '#EAE8F5', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: '#6B4FDB', textDecoration: 'none',
                        }}>
                          <Eye size={14} />
                        </Link>
                        <button onClick={() => handleDelete(item.id, item.title)} style={{
                          width: 30, height: 30, borderRadius: '50%',
                          backgroundColor: '#FEF2F2', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: '#EF4444', cursor: 'pointer',
                        }}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <style>{`
        .history-row:hover .history-actions { opacity: 1 !important; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
      `}</style>
    </div>
  )
}
