import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit2, Trash2, Search, FileCode2 } from 'lucide-react'
import toast from 'react-hot-toast'

const font = "'Inter', -apple-system, sans-serif"

const TYPE_COLORS: Record<string, { bg: string; color: string }> = {
  USECASE:   { bg: '#EAE8F5', color: '#6B4FDB' },
  CLASS:     { bg: '#F5F3FF', color: '#7C3AED' },
  SEQUENCE:  { bg: '#EFF6FF', color: '#2563EB' },
  ER:        { bg: '#F0FDFA', color: '#0D9488' },
  FLOWCHART: { bg: '#F0FDF4', color: '#16A34A' },
}

const mockTemplates = [
  { id: 1, title: 'E-Commerce System', type: 'USECASE', desc: 'Hệ thống mua sắm trực tuyến với thanh toán', uses: 127 },
  { id: 2, title: 'Library Management', type: 'CLASS', desc: 'Hệ thống quản lý thư viện với sách và thành viên', uses: 89 },
  { id: 3, title: 'ATM System', type: 'USECASE', desc: 'Hệ thống máy rút tiền tự động', uses: 203 },
  { id: 4, title: 'Hospital System', type: 'CLASS', desc: 'Hệ thống quản lý bệnh viện', uses: 56 },
  { id: 5, title: 'Authentication Flow', type: 'SEQUENCE', desc: 'Luồng đăng nhập với JWT token', uses: 314 },
]

export default function TemplatesAdminPage() {
  const [search, setSearch] = useState('')
  const [templates, setTemplates] = useState(mockTemplates)

  const filtered = templates.filter(t =>
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    t.type.toLowerCase().includes(search.toLowerCase())
  )

  const handleDelete = (id: number, title: string) => {
    if (!confirm(`Xóa template "${title}"?`)) return
    setTemplates(prev => prev.filter(t => t.id !== id))
    toast.success('Đã xóa template')
  }

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', fontFamily: font }}>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#111827', margin: '0 0 4px', letterSpacing: '-0.4px' }}>Quản lý Templates</h1>
          <p style={{ fontSize: 13, color: '#6B7280', margin: 0 }}>{templates.length} templates trong hệ thống</p>
        </div>
        <button onClick={() => toast.success('Form tạo template mới')} style={{
          display: 'flex', alignItems: 'center', gap: 6, padding: '9px 18px',
          backgroundColor: '#6B4FDB', color: 'white', border: 'none',
          borderRadius: 9999, fontSize: 13, fontWeight: 700, cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(107,79,219,0.25)', fontFamily: font,
        }}>
          <Plus size={15} /> Thêm template
        </button>
      </motion.div>

      {/* Search */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} style={{ marginBottom: 16 }}>
        <div style={{ position: 'relative', maxWidth: 340 }}>
          <Search size={15} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm kiếm template..."
            style={{ width: '100%', padding: '10px 14px 10px 38px', backgroundColor: 'white', border: '1.5px solid #E5E7EB', borderRadius: 12, fontSize: 13, color: '#111827', outline: 'none', fontFamily: font, boxSizing: 'border-box' }}
            onFocus={e => { e.target.style.borderColor = '#6B4FDB'; e.target.style.boxShadow = '0 0 0 3px rgba(107,79,219,0.1)' }}
            onBlur={e => { e.target.style.borderColor = '#E5E7EB'; e.target.style.boxShadow = 'none' }}
          />
        </div>
      </motion.div>

      {/* Table */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14 }}>
        <div style={{ backgroundColor: 'white', borderRadius: 20, border: '1px solid #E5E7EB', boxShadow: '0 1px 4px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ backgroundColor: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                {['Template', 'Loại', 'Mô tả', 'Lượt dùng', 'Thao tác'].map(h => (
                  <th key={h} style={{ padding: '11px 20px', textAlign: 'left', fontSize: 10, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((t, i) => {
                const tc = TYPE_COLORS[t.type] || { bg: '#F3F4F6', color: '#4B5563' }
                return (
                  <motion.tr key={t.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                    style={{ borderBottom: '1px solid #F3F4F6', transition: 'background-color 0.1s' }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = '#FAFAFA'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'}
                  >
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 34, height: 34, borderRadius: 10, backgroundColor: tc.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <FileCode2 size={15} color={tc.color} />
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>{t.title}</span>
                      </div>
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: 9999, fontSize: 10, fontWeight: 700, backgroundColor: tc.bg, color: tc.color }}>
                        {t.type}
                      </span>
                    </td>
                    <td style={{ padding: '14px 20px', color: '#6B7280', maxWidth: 260 }}>
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>{t.desc}</span>
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#6B4FDB', backgroundColor: '#EAE8F5', padding: '3px 10px', borderRadius: 9999 }}>
                        {t.uses} lần
                      </span>
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button onClick={() => toast.success('Chỉnh sửa: ' + t.title)} style={{ width: 30, height: 30, borderRadius: 8, border: '1px solid #E5E7EB', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#6B7280', transition: 'all 0.12s' }}
                          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = '#EAE8F5'; (e.currentTarget as HTMLElement).style.color = '#6B4FDB' }}
                          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'white'; (e.currentTarget as HTMLElement).style.color = '#6B7280' }}>
                          <Edit2 size={13} />
                        </button>
                        <button onClick={() => handleDelete(t.id, t.title)} style={{ width: 30, height: 30, borderRadius: 8, border: '1px solid #E5E7EB', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#6B7280', transition: 'all 0.12s' }}
                          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = '#FEF2F2'; (e.currentTarget as HTMLElement).style.color = '#EF4444'; (e.currentTarget as HTMLElement).style.borderColor = '#FECACA' }}
                          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'white'; (e.currentTarget as HTMLElement).style.color = '#6B7280'; (e.currentTarget as HTMLElement).style.borderColor = '#E5E7EB' }}>
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}
