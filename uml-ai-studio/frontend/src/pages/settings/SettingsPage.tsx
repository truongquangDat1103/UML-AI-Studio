import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Lock, Bell, Palette, Save, LogOut, Check } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import toast from 'react-hot-toast'

const tabs = [
  { id: 'profile', label: 'Hồ sơ', icon: User },
  { id: 'security', label: 'Bảo mật', icon: Lock },
  { id: 'notifications', label: 'Thông báo', icon: Bell },
  { id: 'appearance', label: 'Giao diện', icon: Palette },
]

const inputStyle = {
  width: '100%', padding: '11px 14px',
  backgroundColor: '#F9FAFB', border: '1.5px solid #E5E7EB',
  borderRadius: 12, fontSize: 13, color: '#111827', outline: 'none',
  boxSizing: 'border-box' as const, fontFamily: "'Inter', sans-serif",
  transition: 'all 0.15s',
}

export default function SettingsPage() {
  const { user, logout } = useAuthStore()
  const [activeTab, setActiveTab] = useState('profile')
  const [name, setName] = useState(user?.name || '')
  const [email] = useState(user?.email || '')

  const handleSave = () => toast.success('Đã lưu cài đặt!')

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', fontFamily: "'Inter', sans-serif" }}>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#111827', margin: '0 0 4px', letterSpacing: '-0.4px' }}>Cài đặt</h1>
        <p style={{ fontSize: 13, color: '#6B7280', margin: 0 }}>Quản lý hồ sơ và tùy chỉnh tài khoản</p>
      </motion.div>

      <div style={{ display: 'flex', gap: 20 }}>
        {/* Tab sidebar */}
        <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.08 }}>
          <div style={{
            backgroundColor: 'white', borderRadius: 20, border: '1px solid #E5E7EB',
            boxShadow: '0 1px 4px rgba(0,0,0,0.05)', padding: 8, width: 200, flexShrink: 0,
          }}>
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 14px', borderRadius: 12, border: 'none', cursor: 'pointer',
                backgroundColor: activeTab === tab.id ? '#EAE8F5' : 'transparent',
                color: activeTab === tab.id ? '#6B4FDB' : '#374151',
                fontWeight: 600, fontSize: 13, marginBottom: 2,
                fontFamily: "'Inter', sans-serif", transition: 'all 0.12s',
                textAlign: 'left',
              }}>
                <tab.icon size={16} color={activeTab === tab.id ? '#6B4FDB' : '#9CA3AF'} />
                {tab.label}
              </button>
            ))}
            <div style={{ height: 1, backgroundColor: '#E5E7EB', margin: '8px 0' }} />
            <button onClick={logout} style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 14px', borderRadius: 12, border: 'none', cursor: 'pointer',
              backgroundColor: 'transparent', color: '#EF4444',
              fontWeight: 600, fontSize: 13, fontFamily: "'Inter', sans-serif",
              transition: 'all 0.12s', textAlign: 'left',
            }}>
              <LogOut size={16} color="#EF4444" /> Đăng xuất
            </button>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }} style={{ flex: 1 }}>
          <div style={{
            backgroundColor: 'white', borderRadius: 20, border: '1px solid #E5E7EB',
            boxShadow: '0 1px 4px rgba(0,0,0,0.05)', padding: '28px 28px',
          }}>
            {/* Profile */}
            {activeTab === 'profile' && (
              <div>
                <h2 style={{ fontSize: 16, fontWeight: 800, color: '#111827', margin: '0 0 20px' }}>Thông tin cá nhân</h2>
                {/* Avatar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24, padding: 16, backgroundColor: '#F9FAFB', borderRadius: 16, border: '1px solid #E5E7EB' }}>
                  <div style={{
                    width: 64, height: 64, borderRadius: '50%', backgroundColor: '#6B4FDB',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', fontSize: 26, fontWeight: 800,
                    boxShadow: '0 4px 14px rgba(107,79,219,0.3)',
                  }}>
                    {user?.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <div>
                    <p style={{ fontSize: 15, fontWeight: 700, color: '#111827', margin: '0 0 4px' }}>{user?.name}</p>
                    <span style={{
                      display: 'inline-block',
                      backgroundColor: user?.role === 'ADMIN' ? '#F5F3FF' : '#EAE8F5',
                      color: user?.role === 'ADMIN' ? '#7C3AED' : '#6B4FDB',
                      fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 9999,
                    }}>{user?.role}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 6 }}>Họ và tên</label>
                    <input
                      value={name} onChange={e => setName(e.target.value)}
                      style={inputStyle}
                      onFocus={e => { e.target.style.borderColor = '#6B4FDB'; e.target.style.boxShadow = '0 0 0 3px rgba(107,79,219,0.1)' }}
                      onBlur={e => { e.target.style.borderColor = '#E5E7EB'; e.target.style.boxShadow = 'none' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 6 }}>Email <span style={{ color: '#9CA3AF', fontWeight: 400 }}>(không thể thay đổi)</span></label>
                    <input value={email} disabled style={{ ...inputStyle, backgroundColor: '#F3F4F6', color: '#9CA3AF', cursor: 'not-allowed' }} />
                  </div>
                </div>

                <button onClick={handleSave} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  backgroundColor: '#6B4FDB', color: 'white', fontWeight: 700, fontSize: 13,
                  padding: '11px 24px', borderRadius: 9999, border: 'none', cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(107,79,219,0.25)', fontFamily: "'Inter', sans-serif",
                }}>
                  <Save size={15} /> Lưu thay đổi
                </button>
              </div>
            )}

            {/* Security */}
            {activeTab === 'security' && (
              <div>
                <h2 style={{ fontSize: 16, fontWeight: 800, color: '#111827', margin: '0 0 20px' }}>Đổi mật khẩu</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
                  {['Mật khẩu hiện tại', 'Mật khẩu mới', 'Xác nhận mật khẩu mới'].map((label) => (
                    <div key={label}>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 6 }}>{label}</label>
                      <input type="password" placeholder="••••••••" style={inputStyle}
                        onFocus={e => { e.target.style.borderColor = '#6B4FDB'; e.target.style.boxShadow = '0 0 0 3px rgba(107,79,219,0.1)' }}
                        onBlur={e => { e.target.style.borderColor = '#E5E7EB'; e.target.style.boxShadow = 'none' }}
                      />
                    </div>
                  ))}
                </div>
                <button onClick={handleSave} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  backgroundColor: '#6B4FDB', color: 'white', fontWeight: 700, fontSize: 13,
                  padding: '11px 24px', borderRadius: 9999, border: 'none', cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(107,79,219,0.25)', fontFamily: "'Inter', sans-serif",
                }}>
                  <Lock size={15} /> Cập nhật mật khẩu
                </button>
              </div>
            )}

            {/* Notifications */}
            {activeTab === 'notifications' && (
              <div>
                <h2 style={{ fontSize: 16, fontWeight: 800, color: '#111827', margin: '0 0 20px' }}>Thông báo</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {[
                    { label: 'Email khi tạo sơ đồ thành công', desc: 'Nhận email mỗi khi AI hoàn thành sơ đồ', on: true },
                    { label: 'Cảnh báo Quota sắp hết', desc: 'Thông báo khi còn dưới 20% quota hàng ngày', on: true },
                    { label: 'Bản tin hàng tuần', desc: 'Nhận tips và tính năng mới từ UML AI Studio', on: false },
                  ].map((item, i) => (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '14px 16px', backgroundColor: '#F9FAFB', borderRadius: 14, border: '1px solid #E5E7EB',
                    }}>
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 700, color: '#111827', margin: '0 0 2px' }}>{item.label}</p>
                        <p style={{ fontSize: 12, color: '#6B7280', margin: 0 }}>{item.desc}</p>
                      </div>
                      {/* Toggle */}
                      <div style={{
                        width: 44, height: 24, borderRadius: 9999, padding: 2,
                        backgroundColor: item.on ? '#6B4FDB' : '#E5E7EB',
                        position: 'relative', cursor: 'pointer', transition: 'background-color 0.2s', flexShrink: 0,
                      }}>
                        <div style={{
                          width: 20, height: 20, borderRadius: '50%', backgroundColor: 'white',
                          position: 'absolute', top: 2, transition: 'left 0.2s',
                          left: item.on ? 22 : 2, boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
                        }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Appearance */}
            {activeTab === 'appearance' && (
              <div>
                <h2 style={{ fontSize: 16, fontWeight: 800, color: '#111827', margin: '0 0 20px' }}>Giao diện</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  {[
                    { id: 'light', label: 'Sáng', emoji: '☀️', desc: 'Giao diện trắng, hiện đại', active: true },
                    { id: 'dark', label: 'Tối', emoji: '🌙', desc: 'Sắp ra mắt', active: false },
                  ].map(theme => (
                    <div key={theme.id} style={{
                      padding: '20px', borderRadius: 16, cursor: theme.active ? 'pointer' : 'default',
                      border: theme.active ? '2px solid #6B4FDB' : '2px solid #E5E7EB',
                      backgroundColor: theme.active ? '#EAE8F5' : '#F9FAFB',
                      opacity: theme.active ? 1 : 0.5, position: 'relative',
                    }}>
                      <span style={{ fontSize: 28, display: 'block', marginBottom: 10 }}>{theme.emoji}</span>
                      <p style={{ fontSize: 14, fontWeight: 700, color: '#111827', margin: '0 0 4px' }}>{theme.label}</p>
                      <p style={{ fontSize: 12, color: '#6B7280', margin: 0 }}>{theme.desc}</p>
                      {theme.active && (
                        <div style={{
                          position: 'absolute', top: 12, right: 12,
                          width: 20, height: 20, borderRadius: '50%', backgroundColor: '#6B4FDB',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          <Check size={12} color="white" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
