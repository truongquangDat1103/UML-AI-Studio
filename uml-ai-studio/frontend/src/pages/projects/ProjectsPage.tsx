import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, Plus, Trash2, FolderOpen } from 'lucide-react'
import { projectsAPI } from '@/services/apiService'
import MermaidRenderer from '@/components/diagrams/MermaidRenderer'
import toast from 'react-hot-toast'

const card = {
  backgroundColor: 'white', borderRadius: 20,
  border: '1px solid #E5E7EB', boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
  transition: 'all 0.18s ease', overflow: 'hidden',
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('ALL')
  const [sort, setSort] = useState('newest')
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    const params: Record<string, string> = { sort }
    if (search) params.search = search
    if (typeFilter !== 'ALL') params.type = typeFilter
    projectsAPI.list(params)
      .then(r => { setProjects(r.data || []); setLoading(false) })
      .catch(() => setLoading(false))
  }
  useEffect(() => { load() }, [search, typeFilter, sort])

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Xóa dự án "${title}"?`)) return
    await projectsAPI.delete(id)
    toast.success('Đã xóa dự án')
    load()
  }

  const selectStyle = {
    padding: '10px 14px', backgroundColor: 'white',
    border: '1.5px solid #E5E7EB', borderRadius: 12,
    fontSize: 13, color: '#374151', outline: 'none',
    fontFamily: "'Inter', sans-serif", cursor: 'pointer',
  }

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#111827', margin: '0 0 4px', letterSpacing: '-0.4px' }}>Dự án của tôi</h1>
          <p style={{ fontSize: 13, color: '#6B7280', margin: 0 }}>Quản lý tất cả sơ đồ UML đã tạo</p>
        </div>
        <Link to="/editor" style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          backgroundColor: '#6B4FDB', color: 'white', fontWeight: 700,
          fontSize: 13, padding: '10px 20px', borderRadius: 9999,
          textDecoration: 'none', boxShadow: '0 4px 12px rgba(107,79,219,0.25)',
        }}>
          <Plus size={15} /> Tạo mới
        </Link>
      </motion.div>

      {/* Filters */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
        style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
          <Search size={15} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Tìm kiếm dự án..."
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
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} style={selectStyle}>
          <option value="ALL">Tất cả loại</option>
          <option value="USECASE">Use Case</option>
          <option value="CLASS">Class Diagram</option>
        </select>
        <select value={sort} onChange={e => setSort(e.target.value)} style={selectStyle}>
          <option value="newest">Mới nhất</option>
          <option value="oldest">Cũ nhất</option>
          <option value="name">Theo tên</option>
        </select>
      </motion.div>

      {/* Grid */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {[1,2,3,4,5,6].map(i => (
            <div key={i} style={{ height: 220, borderRadius: 20, backgroundColor: '#E5E7EB', animation: 'pulse 1.5s ease-in-out infinite' }} />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div style={{ ...card, padding: '80px 40px', textAlign: 'center' }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', backgroundColor: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <FolderOpen size={26} color="#9CA3AF" />
          </div>
          <p style={{ fontSize: 15, fontWeight: 700, color: '#374151', margin: '0 0 8px' }}>Chưa có dự án nào</p>
          <p style={{ fontSize: 13, color: '#9CA3AF', margin: '0 0 24px' }}>Bắt đầu tạo sơ đồ UML đầu tiên của bạn</p>
          <Link to="/editor" style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            backgroundColor: '#6B4FDB', color: 'white', fontWeight: 700,
            fontSize: 13, padding: '10px 22px', borderRadius: 9999,
            textDecoration: 'none', boxShadow: '0 4px 12px rgba(107,79,219,0.25)',
          }}>
            <Plus size={14} /> Tạo sơ đồ đầu tiên
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {projects.map((p, i) => (
            <motion.div key={p.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
              style={{ position: 'relative' }} className="group">
              <Link to={`/editor/${p.id}`} style={{ textDecoration: 'none', display: 'block' }}>
                <div style={{ ...card, cursor: 'pointer' }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(-3px)'; el.style.boxShadow = '0 8px 24px rgba(107,79,219,0.12)'; el.style.borderColor = '#D4D0F5' }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(0)'; el.style.boxShadow = '0 1px 4px rgba(0,0,0,0.05)'; el.style.borderColor = '#E5E7EB' }}
                >
                  {/* Preview */}
                  <div style={{ height: 140, backgroundColor: '#F9FAFB', borderBottom: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
                    <div style={{ transform: 'scale(0.4)', transformOrigin: 'center', width: '250%', height: '250%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'absolute', pointerEvents: 'none' }}>
                      {p.mermaidCode ? <MermaidRenderer code={p.mermaidCode} /> : <span style={{ fontSize: 40, opacity: 0.2 }}>📊</span>}
                    </div>
                  </div>
                  <div style={{ padding: '14px 16px' }}>
                    <span style={{ display: 'inline-block', backgroundColor: '#EAE8F5', color: '#6B4FDB', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 9999, marginBottom: 8 }}>
                      {p.diagramType}
                    </span>
                    <p style={{ fontSize: 13, fontWeight: 700, color: '#111827', margin: '0 0 4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</p>
                    <p style={{ fontSize: 11, color: '#9CA3AF', margin: 0 }}>{new Date(p.updatedAt).toLocaleDateString('vi-VN')}</p>
                  </div>
                </div>
              </Link>
              {/* Delete btn */}
              <button
                onClick={() => handleDelete(p.id, p.title)}
                style={{
                  position: 'absolute', top: 10, right: 10,
                  width: 28, height: 28, borderRadius: '50%',
                  backgroundColor: 'white', border: '1px solid #E5E7EB',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: '#9CA3AF', opacity: 0,
                  transition: 'all 0.15s', boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
                }}
                onMouseEnter={e => { const el = e.currentTarget; el.style.backgroundColor = '#FEF2F2'; el.style.borderColor = '#FECACA'; el.style.color = '#EF4444' }}
                onMouseLeave={e => { const el = e.currentTarget; el.style.backgroundColor = 'white'; el.style.borderColor = '#E5E7EB'; el.style.color = '#9CA3AF' }}
                onFocus={e => (e.currentTarget.style.opacity = '1')}
                className="delete-btn"
              >
                <Trash2 size={13} />
              </button>
            </motion.div>
          ))}
        </div>
      )}

      <style>{`
        .group:hover .delete-btn { opacity: 1 !important; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
      `}</style>
    </div>
  )
}
