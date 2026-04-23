import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sparkles, Eye, EyeOff, ArrowRight, Zap, Shield, Code2 } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import toast from 'react-hot-toast'

const highlights = [
  { icon: <Sparkles size={16} color="#A78BFA" />, text: 'AI sinh sơ đồ tức thì' },
  { icon: <Zap size={16} color="#FCD34D" />, text: 'Nhanh hơn vẽ tay 10 lần' },
  { icon: <Code2 size={16} color="#6EE7B7" />, text: 'Export Mermaid, PNG, SVG' },
  { icon: <Shield size={16} color="#93C5FD" />, text: 'Dữ liệu bảo mật tuyệt đối' },
]

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const { register } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email || !password) { toast.error('Vui lòng nhập đầy đủ thông tin'); return }
    if (password.length < 6) { toast.error('Mật khẩu tối thiểu 6 ký tự'); return }
    setLoading(true)
    try {
      await register(name, email, password)
      navigate('/dashboard')
    } catch (err: any) {
      toast.error(err.message || 'Đăng ký thất bại')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: '100%', padding: '12px 16px',
    backgroundColor: '#F9FAFB',
    border: '1.5px solid #E5E7EB',
    borderRadius: 12, fontSize: 14,
    color: '#111827', outline: 'none',
    boxSizing: 'border-box' as const,
    fontFamily: "'Inter', sans-serif",
    transition: 'all 0.15s',
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
        background: 'linear-gradient(145deg, #5B3FCA 0%, #6B4FDB 40%, #8B6FE8 100%)',
        display: 'flex',
        flexDirection: 'column',
        padding: '48px',
        position: 'relative',
        overflow: 'hidden',
      }} className="hidden lg:flex">
        {/* Decorative shapes */}
        <div style={{ position: 'absolute', top: -100, left: -100, width: 350, height: 350, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
        <div style={{ position: 'absolute', bottom: -80, right: -80, width: 280, height: 280, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
        <div style={{ position: 'absolute', top: '35%', right: 40, width: 120, height: 120, borderRadius: 24, background: 'rgba(255,255,255,0.05)', transform: 'rotate(12deg)' }} />

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 'auto' }}>
          <div style={{
            width: 40, height: 40, borderRadius: '50%',
            backgroundColor: 'rgba(255,255,255,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '1px solid rgba(255,255,255,0.3)',
          }}>
            <Sparkles size={20} color="white" />
          </div>
          <span style={{ color: 'white', fontWeight: 700, fontSize: 18, letterSpacing: '-0.4px' }}>UML AI Studio</span>
        </div>

        {/* Center content */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingBottom: 60 }}
        >
          <h1 style={{
            color: 'white', fontWeight: 800,
            fontSize: 36, lineHeight: 1.2,
            letterSpacing: '-1px', marginBottom: 16,
          }}>
            Bắt đầu hành trình<br />
            <span style={{ color: 'rgba(255,255,255,0.7)' }}>thiết kế thông minh</span>
          </h1>
          <p style={{
            color: 'rgba(255,255,255,0.65)',
            fontSize: 15, lineHeight: 1.65,
            marginBottom: 40, maxWidth: 340,
          }}>
            Đăng ký miễn phí và nhận ngay 20 lượt tạo sơ đồ UML bằng AI mỗi ngày.
          </p>

          {/* Highlights */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {highlights.map((h, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.08 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  backgroundColor: 'rgba(255,255,255,0.08)',
                  padding: '12px 16px', borderRadius: 12,
                  border: '1px solid rgba(255,255,255,0.12)',
                }}
              >
                <div style={{
                  width: 32, height: 32, borderRadius: '50%',
                  backgroundColor: 'rgba(255,255,255,0.12)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  {h.icon}
                </div>
                <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14, fontWeight: 500 }}>{h.text}</span>
              </motion.div>
            ))}
          </div>

          {/* Free badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            backgroundColor: 'rgba(255,255,255,0.15)',
            color: 'white', padding: '8px 16px',
            borderRadius: 9999, fontSize: 12, fontWeight: 600,
            border: '1px solid rgba(255,255,255,0.25)',
            marginTop: 32, alignSelf: 'flex-start',
          }}>
            🎁 Miễn phí 20 lượt/ngày — Không cần thẻ tín dụng
          </div>
        </motion.div>

        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12 }}>© 2026 UML AI Studio</p>
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
          <div style={{ marginBottom: 28 }}>
            <h2 style={{
              fontSize: 28, fontWeight: 800, color: '#111827',
              letterSpacing: '-0.6px', marginBottom: 6,
            }}>
              Tạo tài khoản miễn phí 🚀
            </h2>
            <p style={{ color: '#6B7280', fontSize: 15 }}>
              Bắt đầu tạo sơ đồ UML với AI chỉ trong 30 giây
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
              {/* Name */}
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                  Họ và tên
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Nguyễn Văn A"
                  autoComplete="name"
                  style={inputStyle}
                  onFocus={e => { e.target.style.borderColor = '#6B4FDB'; e.target.style.boxShadow = '0 0 0 3px rgba(107,79,219,0.1)' }}
                  onBlur={e => { e.target.style.borderColor = '#E5E7EB'; e.target.style.boxShadow = 'none' }}
                />
              </div>

              {/* Email */}
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  style={inputStyle}
                  onFocus={e => { e.target.style.borderColor = '#6B4FDB'; e.target.style.boxShadow = '0 0 0 3px rgba(107,79,219,0.1)' }}
                  onBlur={e => { e.target.style.borderColor = '#E5E7EB'; e.target.style.boxShadow = 'none' }}
                />
              </div>

              {/* Password */}
              <div style={{ marginBottom: 22 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                  Mật khẩu <span style={{ color: '#9CA3AF', fontWeight: 400 }}>(tối thiểu 6 ký tự)</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    style={{ ...inputStyle, paddingRight: 44 }}
                    onFocus={e => { e.target.style.borderColor = '#6B4FDB'; e.target.style.boxShadow = '0 0 0 3px rgba(107,79,219,0.1)' }}
                    onBlur={e => { e.target.style.borderColor = '#E5E7EB'; e.target.style.boxShadow = 'none' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    style={{
                      position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                      background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF',
                      display: 'flex', alignItems: 'center',
                    }}
                  >
                    {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
                {/* Password strength */}
                {password.length > 0 && (
                  <div style={{ display: 'flex', gap: 4, marginTop: 8 }}>
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} style={{
                        flex: 1, height: 3, borderRadius: 9999,
                        backgroundColor: password.length >= i * 3 ? '#6B4FDB' : '#E5E7EB',
                        transition: 'background-color 0.3s',
                      }} />
                    ))}
                  </div>
                )}
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
                  borderRadius: 9999, border: 'none',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 14px rgba(107,79,219,0.35)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  fontFamily: "'Inter', sans-serif",
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
                  <><span>Tạo tài khoản miễn phí</span><ArrowRight size={15} /></>
                )}
              </button>
            </form>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0' }}>
              <div style={{ flex: 1, height: 1, backgroundColor: '#E5E7EB' }} />
              <span style={{ fontSize: 12, color: '#9CA3AF', fontWeight: 500 }}>Đã có tài khoản?</span>
              <div style={{ flex: 1, height: 1, backgroundColor: '#E5E7EB' }} />
            </div>

            <Link to="/login" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: '100%', padding: '12px 24px',
              backgroundColor: 'white', color: '#374151',
              fontWeight: 600, fontSize: 14,
              borderRadius: 9999, border: '1.5px solid #E5E7EB',
              textDecoration: 'none', boxSizing: 'border-box',
            }}>
              Đăng nhập
            </Link>
          </div>

          {/* Back */}
          <div style={{ textAlign: 'center', marginTop: 20 }}>
            <Link to="/" style={{ fontSize: 13, color: '#9CA3AF', textDecoration: 'none', fontWeight: 500 }}>
              ← Về trang chủ
            </Link>
          </div>
        </motion.div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
