import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sparkles, Eye, EyeOff, ArrowRight, Check } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import toast from 'react-hot-toast'

const features = [
  'Tạo sơ đồ UML từ mô tả tự nhiên',
  'AI phân tích yêu cầu hệ thống',
  'Export PNG, SVG, Mermaid code',
  'Lưu và quản lý dự án dễ dàng',
]

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) { toast.error('Vui lòng nhập đầy đủ thông tin'); return }
    setLoading(true)
    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (err: any) {
      toast.error(err.message || 'Đăng nhập thất bại')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      backgroundColor: '#EDEEF3',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      colorScheme: 'light',
    }}>
      {/* ===== LEFT PANEL — Brand ===== */}
      <div style={{
        width: '45%',
        minHeight: '100vh',
        background: 'linear-gradient(145deg, #6B4FDB 0%, #8B6FE8 50%, #A78BFA 100%)',
        display: 'flex',
        flexDirection: 'column',
        padding: '48px',
        position: 'relative',
        overflow: 'hidden',
      }} className="hidden lg:flex">
        {/* Decorative circles */}
        <div style={{
          position: 'absolute', top: -80, right: -80,
          width: 320, height: 320, borderRadius: '50%',
          background: 'rgba(255,255,255,0.06)',
        }} />
        <div style={{
          position: 'absolute', bottom: -60, left: -60,
          width: 250, height: 250, borderRadius: '50%',
          background: 'rgba(255,255,255,0.05)',
        }} />
        <div style={{
          position: 'absolute', top: '40%', right: -40,
          width: 180, height: 180, borderRadius: '50%',
          background: 'rgba(255,255,255,0.04)',
        }} />

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 'auto' }}>
          <div style={{
            width: 40, height: 40, borderRadius: '50%',
            backgroundColor: 'rgba(255,255,255,0.2)',
            backdropFilter: 'blur(10px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '1px solid rgba(255,255,255,0.3)',
          }}>
            <Sparkles size={20} color="white" />
          </div>
          <span style={{ color: 'white', fontWeight: 700, fontSize: 18, letterSpacing: '-0.4px' }}>
            UML AI Studio
          </span>
        </div>

        {/* Center content */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingBottom: 60 }}>
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              backgroundColor: 'rgba(255,255,255,0.15)',
              color: 'rgba(255,255,255,0.9)',
              padding: '6px 14px', borderRadius: 9999,
              fontSize: 12, fontWeight: 600,
              marginBottom: 24,
              border: '1px solid rgba(255,255,255,0.2)',
            }}>
              <Sparkles size={12} /> AI-Powered
            </div>

            <h1 style={{
              color: 'white', fontWeight: 800,
              fontSize: 36, lineHeight: 1.2,
              letterSpacing: '-1px', marginBottom: 16,
            }}>
              Tạo sơ đồ UML<br />
              <span style={{ color: 'rgba(255,255,255,0.75)' }}>bằng AI thông minh</span>
            </h1>

            <p style={{
              color: 'rgba(255,255,255,0.7)',
              fontSize: 15, lineHeight: 1.65,
              marginBottom: 36, maxWidth: 340,
            }}>
              Chỉ cần mô tả hệ thống của bạn, AI sẽ tạo ra sơ đồ UML chuyên nghiệp trong vài giây.
            </p>

            {/* Feature list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {features.map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.08 }}
                  style={{ display: 'flex', alignItems: 'center', gap: 10 }}
                >
                  <div style={{
                    width: 22, height: 22, borderRadius: '50%',
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <Check size={12} color="white" />
                  </div>
                  <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14, fontWeight: 500 }}>{f}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom */}
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>© 2026 UML AI Studio. All rights reserved.</p>
      </div>

      {/* ===== RIGHT PANEL — Form ===== */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 24px',
        backgroundColor: '#EDEEF3',
      }}>
        {/* Mobile logo */}
        <div className="lg:hidden" style={{ marginBottom: 32, textAlign: 'center' }}>
          <div style={{
            width: 48, height: 48, borderRadius: '50%',
            backgroundColor: '#6B4FDB',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 12px',
            boxShadow: '0 4px 16px rgba(107,79,219,0.35)',
          }}>
            <Sparkles size={22} color="white" />
          </div>
          <span style={{ fontWeight: 700, color: '#111827', fontSize: 18 }}>UML AI Studio</span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{ width: '100%', maxWidth: 420 }}
        >
          {/* Heading */}
          <div style={{ marginBottom: 32 }}>
            <h2 style={{
              fontSize: 28, fontWeight: 800, color: '#111827',
              letterSpacing: '-0.6px', marginBottom: 6,
            }}>
              Chào mừng trở lại 👋
            </h2>
            <p style={{ color: '#6B7280', fontSize: 15 }}>
              Đăng nhập để tiếp tục tạo sơ đồ UML với AI
            </p>
          </div>

          {/* Form card */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: 20,
            border: '1px solid #E5E7EB',
            padding: '32px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
          }}>
            <form onSubmit={handleSubmit}>
              {/* Email */}
              <div style={{ marginBottom: 16 }}>
                <label style={{
                  display: 'block', fontSize: 13, fontWeight: 600,
                  color: '#374151', marginBottom: 6,
                }}>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  style={{
                    width: '100%', padding: '12px 16px',
                    backgroundColor: '#F9FAFB',
                    border: '1.5px solid #E5E7EB',
                    borderRadius: 12, fontSize: 14,
                    color: '#111827', outline: 'none',
                    transition: 'border-color 0.15s',
                    boxSizing: 'border-box',
                    fontFamily: "'Inter', sans-serif",
                  }}
                  onFocus={e => { e.target.style.borderColor = '#6B4FDB'; e.target.style.boxShadow = '0 0 0 3px rgba(107,79,219,0.1)' }}
                  onBlur={e => { e.target.style.borderColor = '#E5E7EB'; e.target.style.boxShadow = 'none' }}
                />
              </div>

              {/* Password */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>Mật khẩu</label>
                  <button type="button" style={{
                    fontSize: 12, color: '#6B4FDB', fontWeight: 600,
                    background: 'none', border: 'none', cursor: 'pointer',
                    fontFamily: "'Inter', sans-serif",
                  }}>
                    Quên mật khẩu?
                  </button>
                </div>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    style={{
                      width: '100%', padding: '12px 44px 12px 16px',
                      backgroundColor: '#F9FAFB',
                      border: '1.5px solid #E5E7EB',
                      borderRadius: 12, fontSize: 14,
                      color: '#111827', outline: 'none',
                      boxSizing: 'border-box',
                      fontFamily: "'Inter', sans-serif",
                    }}
                    onFocus={e => { e.target.style.borderColor = '#6B4FDB'; e.target.style.boxShadow = '0 0 0 3px rgba(107,79,219,0.1)' }}
                    onBlur={e => { e.target.style.borderColor = '#E5E7EB'; e.target.style.boxShadow = 'none' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    style={{
                      position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: '#9CA3AF', display: 'flex', alignItems: 'center',
                    }}
                  >
                    {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  backgroundColor: loading ? '#9B8AE8' : '#6B4FDB',
                  color: 'white',
                  fontWeight: 700, fontSize: 15,
                  padding: '13px 24px',
                  borderRadius: 9999,
                  border: 'none',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 14px rgba(107,79,219,0.35)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  fontFamily: "'Inter', sans-serif",
                  transition: 'all 0.2s',
                }}
              >
                {loading ? (
                  <div style={{
                    width: 16, height: 16, borderRadius: '50%',
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderTopColor: 'white',
                    animation: 'spin 0.6s linear infinite',
                  }} />
                ) : (
                  <><span>Đăng nhập</span><ArrowRight size={16} /></>
                )}
              </button>
            </form>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '24px 0' }}>
              <div style={{ flex: 1, height: 1, backgroundColor: '#E5E7EB' }} />
              <span style={{ fontSize: 12, color: '#9CA3AF', fontWeight: 500 }}>Chưa có tài khoản?</span>
              <div style={{ flex: 1, height: 1, backgroundColor: '#E5E7EB' }} />
            </div>

            <Link to="/register" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: '100%', padding: '12px 24px',
              backgroundColor: 'white', color: '#374151',
              fontWeight: 600, fontSize: 14,
              borderRadius: 9999,
              border: '1.5px solid #E5E7EB',
              textDecoration: 'none',
              transition: 'all 0.2s',
              boxSizing: 'border-box',
            }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor = '#6B4FDB';
                (e.currentTarget as HTMLAnchorElement).style.color = '#6B4FDB';
                (e.currentTarget as HTMLAnchorElement).style.backgroundColor = '#EAE8F5';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor = '#E5E7EB';
                (e.currentTarget as HTMLAnchorElement).style.color = '#374151';
                (e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'white';
              }}
            >
              Tạo tài khoản miễn phí
            </Link>
          </div>

          {/* Back to home */}
          <div style={{ textAlign: 'center', marginTop: 20 }}>
            <Link to="/" style={{
              fontSize: 13, color: '#9CA3AF', textDecoration: 'none', fontWeight: 500,
            }}>
              ← Về trang chủ
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Spin keyframe */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
