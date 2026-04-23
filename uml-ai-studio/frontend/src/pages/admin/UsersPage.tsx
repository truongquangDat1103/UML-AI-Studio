import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Edit2, Ban, UserPlus, Shield } from 'lucide-react'
import toast from 'react-hot-toast'

const font = "'Inter', -apple-system, sans-serif"

const mockUsers = [
  { id: 1, name: 'Admin', email: 'admin@umlstudio.ai', role: 'ADMIN', status: 'ACTIVE', quota: '45/∞', created: '01/01/2026' },
  { id: 2, name: 'Nguyễn Văn A', email: 'nguyenvana@gmail.com', role: 'USER', status: 'ACTIVE', quota: '12/20', created: '15/02/2026' },
  { id: 3, name: 'Trần Thị B', email: 'tranthib@example.com', role: 'USER', status: 'ACTIVE', quota: '3/20', created: '20/02/2026' },
  { id: 4, name: 'Lê Văn C', email: 'levanc@example.com', role: 'USER', status: 'BANNED', quota: '0/20', created: '03/03/2026' },
  { id: 5, name: 'Phạm Thị D', email: 'phamthid@example.com', role: 'USER', status: 'ACTIVE', quota: '19/20', created: '10/03/2026' },
]

export default function UsersPage() {
  const [search, setSearch] = useState('')
  const [users, setUsers] = useState(mockUsers)

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  )

  const toggleBan = (id: number) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: u.status === 'ACTIVE' ? 'BANNED' : 'ACTIVE' } : u))
    toast.success('Đã cập nhật trạng thái người dùng')
  }

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', fontFamily: font }}>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#111827', margin: '0 0 4px', letterSpacing: '-0.4px' }}>Quản lý người dùng</h1>
          <p style={{ fontSize: 13, color: '#6B7280', margin: 0 }}>{users.length} người dùng trong hệ thống</p>
        </div>
        <button onClick={() => toast.success('Tính năng đang phát triển')} style={{
          display: 'flex', alignItems: 'center', gap: 6, padding: '9px 18px',
          backgroundColor: '#6B4FDB', color: 'white', border: 'none',
          borderRadius: 9999, fontSize: 13, fontWeight: 700, cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(107,79,219,0.25)', fontFamily: font,
        }}>
          <UserPlus size={15} /> Thêm người dùng
        </button>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
        <div style={{ backgroundColor: 'white', borderRadius: 20, border: '1px solid #E5E7EB', boxShadow: '0 1px 4px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
          {/* Search bar */}
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #E5E7EB', backgroundColor: '#F9FAFB', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ position: 'relative', flex: 1, maxWidth: 320 }}>
              <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
              <input
                value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Tìm theo tên hoặc email..."
                style={{
                  width: '100%', padding: '9px 14px 9px 36px', backgroundColor: 'white',
                  border: '1.5px solid #E5E7EB', borderRadius: 10, fontSize: 13, color: '#111827',
                  outline: 'none', fontFamily: font, boxSizing: 'border-box',
                }}
                onFocus={e => { e.target.style.borderColor = '#6B4FDB'; e.target.style.boxShadow = '0 0 0 3px rgba(107,79,219,0.1)' }}
                onBlur={e => { e.target.style.borderColor = '#E5E7EB'; e.target.style.boxShadow = 'none' }}
              />
            </div>
            <span style={{ fontSize: 12, color: '#9CA3AF' }}>{filtered.length} kết quả</span>
          </div>

          {/* Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ backgroundColor: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                  {['Tên & Email', 'Role', 'Quota dùng', 'Ngày tạo', 'Trạng thái', 'Thao tác'].map(h => (
                    <th key={h} style={{ padding: '11px 20px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((u, i) => (
                  <motion.tr key={u.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                    style={{ borderBottom: '1px solid #F3F4F6', transition: 'background-color 0.1s' }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = '#FAFAFA'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'}
                  >
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: u.role === 'ADMIN' ? '#6B4FDB' : '#E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'center', color: u.role === 'ADMIN' ? 'white' : '#6B7280', fontWeight: 700, fontSize: 13, flexShrink: 0 }}>
                          {u.name.charAt(0)}
                        </div>
                        <div>
                          <p style={{ fontSize: 13, fontWeight: 700, color: '#111827', margin: 0 }}>{u.name}</p>
                          <p style={{ fontSize: 11, color: '#9CA3AF', margin: 0 }}>{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: 4,
                        padding: '3px 10px', borderRadius: 9999, fontSize: 10, fontWeight: 700,
                        backgroundColor: u.role === 'ADMIN' ? '#F5F3FF' : '#EAE8F5',
                        color: u.role === 'ADMIN' ? '#7C3AED' : '#6B4FDB',
                      }}>
                        {u.role === 'ADMIN' && <Shield size={9} />} {u.role}
                      </span>
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 60, height: 5, backgroundColor: '#E5E7EB', borderRadius: 9999, overflow: 'hidden' }}>
                          <div style={{ height: '100%', backgroundColor: '#6B4FDB', borderRadius: 9999, width: `${u.quota === '45/∞' ? 100 : (parseInt(u.quota) / 20) * 100}%` }} />
                        </div>
                        <span style={{ fontSize: 12, color: '#6B7280', fontWeight: 600 }}>{u.quota}</span>
                      </div>
                    </td>
                    <td style={{ padding: '14px 20px', fontSize: 12, color: '#9CA3AF' }}>{u.created}</td>
                    <td style={{ padding: '14px 20px' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 9999, fontSize: 10, fontWeight: 700, backgroundColor: u.status === 'ACTIVE' ? '#ECFDF5' : '#FEF2F2', color: u.status === 'ACTIVE' ? '#10B981' : '#EF4444' }}>
                        <div style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: u.status === 'ACTIVE' ? '#10B981' : '#EF4444' }} />
                        {u.status}
                      </span>
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <button onClick={() => toast.success('Chỉnh sửa: ' + u.name)} style={{ width: 30, height: 30, borderRadius: 8, border: '1px solid #E5E7EB', backgroundColor: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B7280' }}
                          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = '#EAE8F5'; (e.currentTarget as HTMLElement).style.color = '#6B4FDB'; (e.currentTarget as HTMLElement).style.borderColor = '#D4D0F5' }}
                          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'white'; (e.currentTarget as HTMLElement).style.color = '#6B7280'; (e.currentTarget as HTMLElement).style.borderColor = '#E5E7EB' }}>
                          <Edit2 size={13} />
                        </button>
                        <button onClick={() => toggleBan(u.id)} style={{ width: 30, height: 30, borderRadius: 8, border: '1px solid #E5E7EB', backgroundColor: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B7280' }}
                          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = '#FEF2F2'; (e.currentTarget as HTMLElement).style.color = '#EF4444'; (e.currentTarget as HTMLElement).style.borderColor = '#FECACA' }}
                          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'white'; (e.currentTarget as HTMLElement).style.color = '#6B7280'; (e.currentTarget as HTMLElement).style.borderColor = '#E5E7EB' }}>
                          <Ban size={13} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
