import { useLocation, Link, NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, PenTool, FolderOpen, Clock,
  FileCode2, Settings, ChevronLeft, ChevronRight,
  Sparkles, Users, Cpu, BarChart2, ClipboardList,
  Zap, Database, ShieldAlert,
} from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: PenTool, label: 'Tạo sơ đồ', href: '/editor' },
  { icon: FolderOpen, label: 'Dự án', href: '/projects' },
  { icon: Clock, label: 'Lịch sử', href: '/history' },
  { icon: FileCode2, label: 'Templates', href: '/templates' },
]

const adminItems = [
  { icon: ShieldAlert, label: 'Admin Panel', href: '/admin' },
  { icon: Users, label: 'Người dùng', href: '/admin/users' },
  { icon: Cpu, label: 'Cấu hình AI', href: '/admin/ai-config' },
  { icon: FileCode2, label: 'Templates', href: '/admin/templates' },
  { icon: BarChart2, label: 'Thống kê', href: '/admin/stats' },
  { icon: ClipboardList, label: 'Audit Log', href: '/admin/audit' },
  { icon: Zap, label: 'Quota', href: '/admin/quota' },
  { icon: Database, label: 'Sao lưu', href: '/admin/backup' },
]

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const { user } = useAuthStore()
  const location = useLocation()
  const isAdmin = user?.role === 'ADMIN'

  const isActive = (href: string) =>
    href === '/dashboard'
      ? location.pathname === href
      : location.pathname === href || location.pathname.startsWith(href + '/')

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 256 }}
      transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
      style={{
        height: '100vh',
        backgroundColor: 'white',
        borderRight: '1px solid #E5E7EB',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        flexShrink: 0,
        position: 'relative',
        zIndex: 10,
      }}
    >
      {/* Logo */}
      <div style={{
        height: 64,
        display: 'flex',
        alignItems: 'center',
        borderBottom: '1px solid #E5E7EB',
        padding: collapsed ? '0' : '0 20px',
        justifyContent: collapsed ? 'center' : 'flex-start',
        gap: 12,
        flexShrink: 0,
      }}>
        <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{
            width: 34, height: 34, borderRadius: '50%',
            backgroundColor: '#6B4FDB',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            boxShadow: '0 3px 10px rgba(107,79,219,0.3)',
          }}>
            <Sparkles size={16} color="white" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.18 }}
                style={{
                  fontWeight: 700, color: '#111827',
                  fontSize: 14, letterSpacing: '-0.3px',
                  whiteSpace: 'nowrap', overflow: 'hidden',
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                UML AI Studio
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {navItems.map((item) => {
          const active = isActive(item.href)
          return (
            <div key={item.href} style={{ position: 'relative' }}>
              <Link
                to={item.href}
                title={collapsed ? item.label : undefined}
                style={{
                  display: 'flex', alignItems: 'center',
                  gap: 10, padding: '10px 12px',
                  borderRadius: 12,
                  textDecoration: 'none',
                  fontWeight: 600, fontSize: 13.5,
                  backgroundColor: active ? '#EAE8F5' : 'transparent',
                  color: active ? '#6B4FDB' : '#374151',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  position: 'relative',
                  transition: 'all 0.12s',
                  fontFamily: "'Inter', sans-serif",
                  borderLeft: active ? '2.5px solid #6B4FDB' : '2.5px solid transparent',
                }}
                onMouseEnter={e => {
                  if (!active) {
                    (e.currentTarget as HTMLElement).style.backgroundColor = '#F3F4F6'
                    ;(e.currentTarget as HTMLElement).style.color = '#111827'
                  }
                }}
                onMouseLeave={e => {
                  if (!active) {
                    (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'
                    ;(e.currentTarget as HTMLElement).style.color = '#374151'
                  }
                }}
              >
                <item.icon size={17} style={{ flexShrink: 0, color: active ? '#6B4FDB' : '#9CA3AF' }} />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      transition={{ duration: 0.13 }}
                      style={{ whiteSpace: 'nowrap', overflow: 'hidden' }}
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
              {/* Tooltip */}
              {collapsed && (
                <div style={{
                  position: 'absolute', left: '100%', top: '50%', transform: 'translateY(-50%)',
                  marginLeft: 10, backgroundColor: '#111827', color: 'white',
                  padding: '6px 10px', borderRadius: 8, fontSize: 12, fontWeight: 600,
                  whiteSpace: 'nowrap', pointerEvents: 'none', zIndex: 99,
                  opacity: 0, transition: 'opacity 0.15s',
                }} className="sidebar-tooltip">
                  {item.label}
                </div>
              )}
            </div>
          )
        })}

        {/* Admin section */}
        {isAdmin && (
          <>
            <div style={{ margin: '16px 0 6px', padding: collapsed ? '0 12px' : '0 12px' }}>
              {!collapsed ? (
                <span style={{ fontSize: 10, fontWeight: 700, color: '#9CA3AF', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  Admin
                </span>
              ) : (
                <div style={{ height: 1, backgroundColor: '#E5E7EB' }} />
              )}
            </div>
            {adminItems.map((item) => {
              const active = location.pathname === item.href
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  title={collapsed ? item.label : undefined}
                  style={{
                    display: 'flex', alignItems: 'center',
                    gap: 10, padding: '9px 12px',
                    borderRadius: 12, textDecoration: 'none',
                    fontWeight: 600, fontSize: 13,
                    backgroundColor: active ? '#EAE8F5' : 'transparent',
                    color: active ? '#6B4FDB' : '#374151',
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    transition: 'all 0.12s',
                    fontFamily: "'Inter', sans-serif",
                    borderLeft: active ? '2.5px solid #6B4FDB' : '2.5px solid transparent',
                  }}
                >
                  <item.icon size={16} style={{ flexShrink: 0, color: active ? '#6B4FDB' : '#9CA3AF' }} />
                  <AnimatePresence>
                    {!collapsed && (
                      <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.13 }}
                        style={{ whiteSpace: 'nowrap' }}>
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>
              )
            })}
          </>
        )}
      </nav>

      {/* Bottom: Settings + User */}
      <div style={{ borderTop: '1px solid #E5E7EB', padding: '10px', flexShrink: 0 }}>
        <Link
          to="/settings"
          style={{
            display: 'flex', alignItems: 'center',
            gap: 10, padding: '9px 12px', borderRadius: 12,
            textDecoration: 'none', fontWeight: 600, fontSize: 13,
            color: location.pathname === '/settings' ? '#6B4FDB' : '#374151',
            backgroundColor: location.pathname === '/settings' ? '#EAE8F5' : 'transparent',
            justifyContent: collapsed ? 'center' : 'flex-start',
            transition: 'all 0.12s',
            fontFamily: "'Inter', sans-serif",
            marginBottom: 6,
          }}
        >
          <Settings size={17} style={{ flexShrink: 0, color: location.pathname === '/settings' ? '#6B4FDB' : '#9CA3AF' }} />
          {!collapsed && <span>Cài đặt</span>}
        </Link>

        {/* User */}
        {!collapsed && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '8px 12px', borderRadius: 12,
            backgroundColor: '#F9FAFB',
          }}>
            <div style={{
              width: 30, height: 30, borderRadius: '50%',
              backgroundColor: '#6B4FDB',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontSize: 12, fontWeight: 700, flexShrink: 0,
            }}>
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: '#111827', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.name}
              </p>
              <p style={{ fontSize: 10, color: '#9CA3AF', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.email}
              </p>
            </div>
          </div>
        )}
        {collapsed && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '4px 0' }}>
            <div style={{
              width: 30, height: 30, borderRadius: '50%',
              backgroundColor: '#6B4FDB',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontSize: 12, fontWeight: 700,
            }}>
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
          </div>
        )}
      </div>

      {/* Toggle */}
      <button
        onClick={onToggle}
        style={{
          position: 'absolute', right: -12, top: 80,
          width: 24, height: 24, borderRadius: '50%',
          backgroundColor: 'white', border: '1.5px solid #E5E7EB',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
          color: '#6B7280', zIndex: 20, transition: 'all 0.15s',
        }}
        title={collapsed ? 'Mở sidebar' : 'Thu sidebar'}
      >
        {collapsed ? <ChevronRight size={13} /> : <ChevronLeft size={13} />}
      </button>
    </motion.aside>
  )
}
