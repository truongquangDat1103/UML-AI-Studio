import { useLocation, Link } from 'react-router-dom'
import { Bell, Menu } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { useState } from 'react'

const routeNames: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/editor': 'Tạo sơ đồ',
  '/projects': 'Dự án của tôi',
  '/history': 'Lịch sử',
  '/templates': 'Templates',
  '/settings': 'Cài đặt',
  '/admin': 'Admin Dashboard',
  '/admin/users': 'Quản lý người dùng',
  '/admin/ai-config': 'Cấu hình AI',
  '/admin/templates': 'Template UML',
  '/admin/stats': 'Thống kê',
  '/admin/audit': 'Audit Log',
  '/admin/quota': 'Quota',
  '/admin/backup': 'Sao lưu',
}

interface HeaderProps { onToggle: () => void }

export default function Header({ onToggle }: HeaderProps) {
  const { user, logout } = useAuthStore()
  const location = useLocation()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const currentRoute = routeNames[location.pathname] || 'UML AI Studio'

  return (
    <header style={{
      height: 64, backgroundColor: 'white', borderBottom: '1px solid #E5E7EB',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 24px', flexShrink: 0, zIndex: 20, position: 'sticky', top: 0,
      fontFamily: "'Inter', -apple-system, sans-serif",
    }}>
      {/* Left */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button
          onClick={onToggle}
          style={{
            width: 36, height: 36, borderRadius: 10,
            border: '1px solid #E5E7EB', backgroundColor: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: '#6B7280',
          }}
        >
          <Menu size={18} />
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14 }}>
          <Link to="/dashboard" style={{ color: '#9CA3AF', textDecoration: 'none', fontWeight: 500 }}>
            UML AI Studio
          </Link>
          <span style={{ color: '#D1D5DB' }}>/</span>
          <span style={{ color: '#111827', fontWeight: 700 }}>{currentRoute}</span>
        </div>
      </div>

      {/* Right */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {/* Bell */}
        <button style={{
          width: 36, height: 36, borderRadius: 10,
          border: '1px solid #E5E7EB', backgroundColor: 'white',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', color: '#6B7280', position: 'relative',
        }}>
          <Bell size={17} />
          <span style={{
            position: 'absolute', top: 7, right: 7,
            width: 7, height: 7, borderRadius: '50%',
            backgroundColor: '#6B4FDB', border: '1.5px solid white',
          }} />
        </button>

        {/* User */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setDropdownOpen(o => !o)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '5px 10px 5px 5px', borderRadius: 10,
              border: '1px solid #E5E7EB', backgroundColor: 'white',
              cursor: 'pointer',
            }}
          >
            <div style={{
              width: 28, height: 28, borderRadius: '50%',
              backgroundColor: '#6B4FDB',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontSize: 12, fontWeight: 700,
            }}>
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>
              {user?.name?.split(' ').slice(-1)[0]}
            </span>
          </button>

          {/* Dropdown */}
          {dropdownOpen && (
            <div
              style={{
                position: 'absolute', right: 0, top: '100%', marginTop: 6,
                width: 200, backgroundColor: 'white',
                border: '1px solid #E5E7EB', borderRadius: 16,
                boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                overflow: 'hidden', zIndex: 100,
              }}
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <div style={{ padding: '12px 16px', borderBottom: '1px solid #F3F4F6' }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: '#111827', margin: 0 }}>{user?.name}</p>
                <p style={{ fontSize: 11, color: '#9CA3AF', margin: '2px 0 0' }}>{user?.email}</p>
              </div>
              <Link
                to="/settings"
                onClick={() => setDropdownOpen(false)}
                style={{
                  display: 'block', padding: '10px 16px', fontSize: 13,
                  color: '#374151', textDecoration: 'none', fontWeight: 500,
                  transition: 'background-color 0.1s',
                }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#F3F4F6')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                Hồ sơ & Cài đặt
              </Link>
              <button
                onClick={() => { setDropdownOpen(false); logout() }}
                style={{
                  display: 'block', width: '100%', padding: '10px 16px',
                  fontSize: 13, color: '#EF4444', fontWeight: 600,
                  background: 'none', border: 'none', cursor: 'pointer',
                  textAlign: 'left', borderTop: '1px solid #F3F4F6',
                  fontFamily: "'Inter', sans-serif",
                }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#FEF2F2')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                Đăng xuất
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
