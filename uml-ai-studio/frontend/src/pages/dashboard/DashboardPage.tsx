import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { PenTool, FolderOpen, Zap, Lightbulb, ArrowRight, Sparkles } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { projectsAPI, templatesAPI } from '@/services/apiService'

const TIPS = [
  '💡 Dùng Ctrl+Enter để gửi nhanh yêu cầu trong Editor',
  '💡 Thêm chi tiết về các actor giúp Use Case chính xác hơn',
  '💡 Mô tả quan hệ giữa các class để AI sinh Class Diagram tốt hơn',
  '💡 Bạn có thể tinh chỉnh sơ đồ bằng cách yêu cầu AI chỉnh sửa',
]

const card = (style = {}) => ({
  backgroundColor: 'white',
  borderRadius: 20,
  border: '1px solid #E5E7EB',
  boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
  transition: 'all 0.18s ease',
  ...style,
})

export default function DashboardPage() {
  const { user } = useAuthStore()
  const [recentProjects, setRecentProjects] = useState<any[]>([])
  const [templates, setTemplates] = useState<any[]>([])
  const tip = TIPS[Math.floor(Date.now() / 86400000) % TIPS.length]

  useEffect(() => {
    projectsAPI.list({ limit: '4', sort: 'newest' }).then(r => setRecentProjects(r.data || [])).catch(() => {})
    templatesAPI.list().then(r => setTemplates((r.data || []).slice(0, 3))).catch(() => {})
  }, [])

  const quotaUsed = (user as any)?.quotaUsed || 0
  const dailyQuota = (user as any)?.dailyQuota || 20
  const quotaPct = Math.min(100, (quotaUsed / dailyQuota) * 100)

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', fontFamily: "'Inter', sans-serif" }}>

      {/* Welcome */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#111827', letterSpacing: '-0.5px', margin: '0 0 4px' }}>
          Xin chào, {user?.name?.split(' ').slice(-1)[0]}! 👋
        </h1>
        <p style={{ color: '#6B7280', fontSize: 14, margin: '0 0 24px' }}>Hôm nay bạn muốn tạo sơ đồ gì?</p>
      </motion.div>

      {/* Top 3 cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 16 }}>

        {/* Quota */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <div style={{ ...card(), padding: 20, height: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', backgroundColor: '#FEF9C3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Zap size={16} color="#D97706" />
              </div>
              <span style={{ fontWeight: 700, color: '#111827', fontSize: 13 }}>Quota hôm nay</span>
            </div>
            <div style={{ width: '100%', height: 8, backgroundColor: '#E5E7EB', borderRadius: 9999, overflow: 'hidden', marginBottom: 8 }}>
              <div style={{
                height: '100%', borderRadius: 9999,
                width: `${quotaPct}%`,
                background: quotaPct > 80 ? '#EF4444' : '#6B4FDB',
                transition: 'width 0.6s ease',
              }} />
            </div>
            <p style={{ fontSize: 12, color: '#9CA3AF', textAlign: 'right', margin: 0 }}>
              <b style={{ color: '#111827' }}>{quotaUsed}</b> / {dailyQuota} lượt
            </p>
          </div>
        </motion.div>

        {/* Quick: Use Case */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Link to="/editor" style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
            <div style={{ ...card({ cursor: 'pointer' }), padding: 20, height: '100%', display: 'flex', alignItems: 'center', gap: 14 }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 20px rgba(107,79,219,0.12)'
                ;(e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'
                ;(e.currentTarget as HTMLElement).style.borderColor = '#D4D0F5'
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.boxShadow = '0 1px 4px rgba(0,0,0,0.05)'
                ;(e.currentTarget as HTMLElement).style.transform = 'translateY(0)'
                ;(e.currentTarget as HTMLElement).style.borderColor = '#E5E7EB'
              }}
            >
              <div style={{ width: 44, height: 44, borderRadius: '50%', backgroundColor: '#EAE8F5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <PenTool size={20} color="#6B4FDB" />
              </div>
              <div>
                <p style={{ fontWeight: 700, color: '#111827', fontSize: 13, margin: '0 0 2px' }}>Tạo Use Case</p>
                <p style={{ fontSize: 12, color: '#6B7280', margin: 0 }}>Phân tích yêu cầu hệ thống</p>
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Quick: Class */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Link to="/editor" style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
            <div style={{ ...card({ cursor: 'pointer' }), padding: 20, height: '100%', display: 'flex', alignItems: 'center', gap: 14 }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 20px rgba(107,79,219,0.12)'
                ;(e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'
                ;(e.currentTarget as HTMLElement).style.borderColor = '#D4D0F5'
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.boxShadow = '0 1px 4px rgba(0,0,0,0.05)'
                ;(e.currentTarget as HTMLElement).style.transform = 'translateY(0)'
                ;(e.currentTarget as HTMLElement).style.borderColor = '#E5E7EB'
              }}
            >
              <div style={{ width: 44, height: 44, borderRadius: '50%', backgroundColor: '#F5F3FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <FolderOpen size={20} color="#7C3AED" />
              </div>
              <div>
                <p style={{ fontWeight: 700, color: '#111827', fontSize: 13, margin: '0 0 2px' }}>Tạo Class Diagram</p>
                <p style={{ fontSize: 12, color: '#6B7280', margin: 0 }}>Thiết kế cấu trúc classes</p>
              </div>
            </div>
          </Link>
        </motion.div>
      </div>

      {/* Tip */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <div style={{
          ...card(), padding: '14px 20px', marginBottom: 24,
          display: 'flex', alignItems: 'center', gap: 12,
          backgroundColor: '#FFFBEB', border: '1px solid #FDE68A',
        }}>
          <Lightbulb size={18} color="#D97706" style={{ flexShrink: 0 }} />
          <p style={{ fontSize: 13, color: '#92400E', fontWeight: 500, margin: 0 }}>{tip}</p>
        </div>
      </motion.div>

      {/* Recent Projects */}
      {recentProjects.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <h2 style={{ fontSize: 15, fontWeight: 800, color: '#111827', margin: 0 }}>Dự án gần đây</h2>
            <Link to="/projects" style={{ fontSize: 13, color: '#6B4FDB', textDecoration: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
              Xem tất cả <ArrowRight size={13} />
            </Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 }}>
            {recentProjects.map((p, i) => (
              <motion.div key={p.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 + i * 0.05 }}>
                <Link to={`/editor/${p.id}`} style={{ textDecoration: 'none', display: 'block' }}>
                  <div style={{ ...card({ cursor: 'pointer' }), padding: 16 }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 20px rgba(107,79,219,0.1)'; (e.currentTarget as HTMLElement).style.borderColor = '#D4D0F5' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 1px 4px rgba(0,0,0,0.05)'; (e.currentTarget as HTMLElement).style.borderColor = '#E5E7EB' }}
                  >
                    <span style={{ display: 'inline-block', backgroundColor: '#EAE8F5', color: '#6B4FDB', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 9999, marginBottom: 10 }}>
                      {p.diagramType}
                    </span>
                    <p style={{ fontSize: 13, fontWeight: 700, color: '#111827', margin: '0 0 6px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</p>
                    <p style={{ fontSize: 11, color: '#9CA3AF', margin: 0 }}>{new Date(p.updatedAt).toLocaleDateString('vi-VN')}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Templates */}
      {templates.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <h2 style={{ fontSize: 15, fontWeight: 800, color: '#111827', margin: 0 }}>Template nổi bật</h2>
            <Link to="/templates" style={{ fontSize: 13, color: '#6B4FDB', textDecoration: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
              Xem tất cả <ArrowRight size={13} />
            </Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
            {templates.map((t, i) => (
              <motion.div key={t.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.05 }}>
                <Link to="/editor" style={{ textDecoration: 'none', display: 'block' }}>
                  <div style={{ ...card({ cursor: 'pointer' }), padding: 16 }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 20px rgba(107,79,219,0.1)' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 1px 4px rgba(0,0,0,0.05)' }}
                  >
                    <span style={{ display: 'inline-block', backgroundColor: '#F5F3FF', color: '#7C3AED', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 9999, marginBottom: 10 }}>
                      {t.diagramType}
                    </span>
                    <p style={{ fontSize: 13, fontWeight: 700, color: '#111827', margin: '0 0 6px' }}>{t.title}</p>
                    <p style={{ fontSize: 12, color: '#6B7280', margin: 0, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{t.description}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Empty state */}
      {recentProjects.length === 0 && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <div style={{ ...card(), padding: '60px 40px', textAlign: 'center' }}>
            <div style={{ width: 64, height: 64, borderRadius: 20, backgroundColor: '#EAE8F5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <Sparkles size={30} color="#6B4FDB" />
            </div>
            <h3 style={{ fontSize: 17, fontWeight: 800, color: '#111827', margin: '0 0 8px' }}>Bắt đầu tạo sơ đồ đầu tiên</h3>
            <p style={{ fontSize: 14, color: '#6B7280', margin: '0 0 28px' }}>Sử dụng AI để tạo sơ đồ UML chuyên nghiệp từ mô tả của bạn</p>
            <Link to="/editor" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              backgroundColor: '#6B4FDB', color: 'white',
              fontWeight: 700, fontSize: 14,
              padding: '12px 28px', borderRadius: 9999,
              textDecoration: 'none',
              boxShadow: '0 4px 14px rgba(107,79,219,0.3)',
            }}>
              Tạo sơ đồ ngay <ArrowRight size={16} />
            </Link>
          </div>
        </motion.div>
      )}
    </div>
  )
}
