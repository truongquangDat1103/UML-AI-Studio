import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Sparkles, ArrowRight } from 'lucide-react'
import { templatesAPI } from '@/services/apiService'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const TYPE_COLORS: Record<string, { bg: string; color: string }> = {
  USECASE:   { bg: '#EAE8F5', color: '#6B4FDB' },
  CLASS:     { bg: '#F5F3FF', color: '#7C3AED' },
  SEQUENCE:  { bg: '#EFF6FF', color: '#2563EB' },
  ER:        { bg: '#F0FDFA', color: '#0D9488' },
  FLOWCHART: { bg: '#F0FDF4', color: '#16A34A' },
}

const card = {
  backgroundColor: 'white', borderRadius: 20,
  border: '1px solid #E5E7EB', boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
  transition: 'all 0.18s ease',
}

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('ALL')
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    templatesAPI.list()
      .then(r => { setTemplates(r.data || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const filtered = templates.filter(t =>
    (filter === 'ALL' || t.diagramType === filter) &&
    (!search || t.title.toLowerCase().includes(search.toLowerCase()))
  )

  const handleUse = (t: any) => {
    toast.success('Đã tải template!')
    navigate('/editor', { state: { template: t } })
  }

  const filterTypes = ['ALL', 'USECASE', 'CLASS', 'SEQUENCE', 'ER', 'FLOWCHART']

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', fontFamily: "'Inter', sans-serif" }}>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#111827', margin: '0 0 4px', letterSpacing: '-0.4px' }}>Templates</h1>
        <p style={{ fontSize: 13, color: '#6B7280', margin: 0 }}>Bắt đầu nhanh hơn với các mẫu sơ đồ có sẵn</p>
      </motion.div>

      {/* Filters */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
        style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <Search size={15} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Tìm kiếm template..."
            style={{
              width: '100%', padding: '10px 14px 10px 38px',
              backgroundColor: 'white', border: '1.5px solid #E5E7EB',
              borderRadius: 12, fontSize: 13, color: '#111827', outline: 'none',
              boxSizing: 'border-box', fontFamily: "'Inter', sans-serif",
            }}
            onFocus={e => { e.target.style.borderColor = '#6B4FDB'; e.target.style.boxShadow = '0 0 0 3px rgba(107,79,219,0.1)' }}
            onBlur={e => { e.target.style.borderColor = '#E5E7EB'; e.target.style.boxShadow = 'none' }}
          />
        </div>
        {/* Filter pills */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {filterTypes.map(type => (
            <button key={type} onClick={() => setFilter(type)} style={{
              padding: '8px 16px', borderRadius: 9999,
              fontSize: 12, fontWeight: 700, cursor: 'pointer', border: 'none',
              backgroundColor: filter === type ? '#6B4FDB' : 'white',
              color: filter === type ? 'white' : '#374151',
              boxShadow: filter === type ? '0 4px 12px rgba(107,79,219,0.25)' : '0 1px 3px rgba(0,0,0,0.06)',
              border: filter === type ? 'none' : '1px solid #E5E7EB',
              fontFamily: "'Inter', sans-serif",
              transition: 'all 0.15s',
            }}>
              {type === 'ALL' ? 'Tất cả' : type}
            </button>
          ))}
        </div>
      </motion.div>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {[1,2,3,4,5,6].map(i => (
            <div key={i} style={{ height: 240, borderRadius: 20, backgroundColor: '#E5E7EB', animation: 'pulse 1.5s ease-in-out infinite' }} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ ...card, padding: '80px 40px', textAlign: 'center' }}>
          <Sparkles size={36} color="#D1D5DB" style={{ marginBottom: 16 }} />
          <p style={{ fontSize: 15, fontWeight: 700, color: '#374151', margin: '0 0 6px' }}>Không tìm thấy template</p>
          <p style={{ fontSize: 13, color: '#9CA3AF', margin: 0 }}>Thử thay đổi bộ lọc hoặc từ khoá</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {filtered.map((t, i) => {
            const tc = TYPE_COLORS[t.diagramType] || { bg: '#F3F4F6', color: '#4B5563' }
            return (
              <motion.div key={t.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                <div style={{ ...card, display: 'flex', flexDirection: 'column', overflow: 'hidden', cursor: 'default' }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(-3px)'; el.style.boxShadow = '0 8px 24px rgba(107,79,219,0.10)'; el.style.borderColor = '#D4D0F5' }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(0)'; el.style.boxShadow = '0 1px 4px rgba(0,0,0,0.05)'; el.style.borderColor = '#E5E7EB' }}
                >
                  {/* Preview area */}
                  <div style={{ height: 120, backgroundColor: '#F9FAFB', borderBottom: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: 52, height: 52, borderRadius: 16, backgroundColor: tc.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: 22 }}>📊</span>
                    </div>
                  </div>
                  <div style={{ padding: '14px 16px 16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <span style={{ display: 'inline-block', backgroundColor: tc.bg, color: tc.color, fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 9999, marginBottom: 10, alignSelf: 'flex-start' }}>
                      {t.diagramType}
                    </span>
                    <p style={{ fontSize: 14, fontWeight: 700, color: '#111827', margin: '0 0 6px' }}>{t.title}</p>
                    <p style={{ fontSize: 12, color: '#6B7280', margin: '0 0 16px', lineHeight: 1.5, flex: 1, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                      {t.description}
                    </p>
                    <button onClick={() => handleUse(t)} style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                      backgroundColor: '#6B4FDB', color: 'white',
                      fontWeight: 700, fontSize: 12.5,
                      padding: '9px 0', borderRadius: 9999, border: 'none', cursor: 'pointer',
                      boxShadow: '0 3px 10px rgba(107,79,219,0.22)',
                      fontFamily: "'Inter', sans-serif", width: '100%',
                    }}>
                      Dùng template <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
    </div>
  )
}
