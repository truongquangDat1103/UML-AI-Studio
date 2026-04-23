import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Eye, Filter } from 'lucide-react'

const font = "'Inter', -apple-system, sans-serif"

const mockLogs = [
  { id: 1, time: '16/04/2026 14:32:15', user: 'admin@umlstudio.ai', action: 'CREATE_DIAGRAM', resource: 'Use Case #1205', ip: '192.168.1.1', status: 'SUCCESS' },
  { id: 2, time: '16/04/2026 14:28:03', user: 'nguyenvana@gmail.com', action: 'LOGIN', resource: 'Auth', ip: '10.0.0.45', status: 'SUCCESS' },
  { id: 3, time: '16/04/2026 13:55:44', user: 'admin@umlstudio.ai', action: 'BAN_USER', resource: 'User #4', ip: '192.168.1.1', status: 'SUCCESS' },
  { id: 4, time: '16/04/2026 13:20:11', user: 'unknown', action: 'LOGIN', resource: 'Auth', ip: '203.113.4.5', status: 'FAILED' },
  { id: 5, time: '16/04/2026 12:45:00', user: 'tranthib@example.com', action: 'DELETE_PROJECT', resource: 'Project #88', ip: '172.16.0.22', status: 'SUCCESS' },
  { id: 6, time: '16/04/2026 11:30:20', user: 'phamthid@example.com', action: 'CREATE_DIAGRAM', resource: 'Class #1204', ip: '10.0.0.91', status: 'SUCCESS' },
  { id: 7, time: '16/04/2026 10:12:55', user: 'admin@umlstudio.ai', action: 'UPDATE_AI_CONFIG', resource: 'AIConfig', ip: '192.168.1.1', status: 'SUCCESS' },
]

const actionColor: Record<string, { bg: string; color: string }> = {
  CREATE_DIAGRAM: { bg: '#EAE8F5', color: '#6B4FDB' },
  LOGIN: { bg: '#ECFDF5', color: '#10B981' },
  BAN_USER: { bg: '#FEF2F2', color: '#EF4444' },
  DELETE_PROJECT: { bg: '#FEF2F2', color: '#EF4444' },
  UPDATE_AI_CONFIG: { bg: '#FEF9C3', color: '#D97706' },
}

export default function AuditPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')

  const filtered = mockLogs.filter(l =>
    (statusFilter === 'ALL' || l.status === statusFilter) &&
    (l.user.includes(search) || l.action.includes(search.toUpperCase()))
  )

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', fontFamily: font }}>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#111827', margin: '0 0 4px', letterSpacing: '-0.4px' }}>Audit Log</h1>
        <p style={{ fontSize: 13, color: '#6B7280', margin: 0 }}>Lịch sử hoạt động chi tiết của hệ thống</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
        <div style={{ backgroundColor: 'white', borderRadius: 20, border: '1px solid #E5E7EB', boxShadow: '0 1px 4px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
          {/* Filter bar */}
          <div style={{ padding: '14px 20px', borderBottom: '1px solid #E5E7EB', backgroundColor: '#F9FAFB', display: 'flex', gap: 10, alignItems: 'center' }}>
            <div style={{ position: 'relative' }}>
              <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm theo user, action..."
                style={{ padding: '8px 12px 8px 32px', backgroundColor: 'white', border: '1.5px solid #E5E7EB', borderRadius: 10, fontSize: 12, outline: 'none', fontFamily: font, width: 220 }}
                onFocus={e => { e.target.style.borderColor = '#6B4FDB' }}
                onBlur={e => { e.target.style.borderColor = '#E5E7EB' }}
              />
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {['ALL', 'SUCCESS', 'FAILED'].map(s => (
                <button key={s} onClick={() => setStatusFilter(s)} style={{
                  padding: '6px 14px', borderRadius: 9999, fontSize: 11, fontWeight: 700, cursor: 'pointer', border: 'none', fontFamily: font,
                  backgroundColor: statusFilter === s ? '#6B4FDB' : 'white',
                  color: statusFilter === s ? 'white' : '#374151',
                  border: statusFilter === s ? 'none' : '1px solid #E5E7EB',
                }}>
                  {s}
                </button>
              ))}
            </div>
            <span style={{ fontSize: 12, color: '#9CA3AF', marginLeft: 'auto' }}>{filtered.length} bản ghi</span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
              <thead>
                <tr style={{ backgroundColor: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                  {['Thời gian', 'Người dùng', 'Action', 'Resource', 'IP', 'Status', ''].map(h => (
                    <th key={h} style={{ padding: '10px 18px', textAlign: 'left', fontSize: 10, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((log, i) => {
                  const ac = actionColor[log.action] || { bg: '#F3F4F6', color: '#374151' }
                  return (
                    <motion.tr key={log.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                      style={{ borderBottom: '1px solid #F3F4F6' }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = '#FAFAFA'}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'}
                    >
                      <td style={{ padding: '12px 18px', color: '#9CA3AF', whiteSpace: 'nowrap' }}>{log.time}</td>
                      <td style={{ padding: '12px 18px', fontWeight: 600, color: '#374151' }}>{log.user}</td>
                      <td style={{ padding: '12px 18px' }}>
                        <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: 9999, fontSize: 10, fontWeight: 700, backgroundColor: ac.bg, color: ac.color, whiteSpace: 'nowrap' }}>
                          {log.action}
                        </span>
                      </td>
                      <td style={{ padding: '12px 18px', color: '#6B7280' }}>{log.resource}</td>
                      <td style={{ padding: '12px 18px', color: '#9CA3AF', fontFamily: 'monospace' }}>{log.ip}</td>
                      <td style={{ padding: '12px 18px' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 10px', borderRadius: 9999, fontSize: 10, fontWeight: 700, backgroundColor: log.status === 'SUCCESS' ? '#ECFDF5' : '#FEF2F2', color: log.status === 'SUCCESS' ? '#10B981' : '#EF4444' }}>
                          <div style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: log.status === 'SUCCESS' ? '#10B981' : '#EF4444' }} />
                          {log.status}
                        </span>
                      </td>
                      <td style={{ padding: '12px 18px' }}>
                        <button style={{ width: 28, height: 28, borderRadius: 8, border: '1px solid #E5E7EB', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#9CA3AF' }}>
                          <Eye size={13} />
                        </button>
                      </td>
                    </motion.tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
