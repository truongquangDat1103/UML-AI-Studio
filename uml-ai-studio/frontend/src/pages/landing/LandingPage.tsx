import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sparkles, Zap, Code2, Shield, ArrowRight } from 'lucide-react'

const features = [
  {
    icon: <Sparkles className="w-5 h-5 text-violet-600" />,
    bg: '#F5F3FF',
    title: 'AI-Powered Generation',
    desc: 'Describe your system and watch as AI creates professional UML diagrams instantly.',
  },
  {
    icon: <Zap className="w-5 h-5 text-violet-600" />,
    bg: '#F5F3FF',
    title: 'Lightning Fast',
    desc: 'Generate complex diagrams in seconds, not hours. Save time and boost productivity.',
  },
  {
    icon: <Code2 className="w-5 h-5 text-teal-600" />,
    bg: '#F0FDFA',
    title: 'Multiple Formats',
    desc: 'Support for class, sequence, ER, state, and flowchart diagrams.',
  },
  {
    icon: <Shield className="w-5 h-5 text-orange-500" />,
    bg: '#FFF7ED',
    title: 'Export Anywhere',
    desc: 'Export as PNG, SVG, or Mermaid code. Use in documentation, presentations, or code.',
  },
]

export default function LandingPage() {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#EDEEF3',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      color: '#111827',
    }}>

      {/* ===== NAVBAR ===== */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        backgroundColor: 'rgba(237,238,243,0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(229,231,235,0.6)',
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              backgroundColor: '#6B4FDB',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(107,79,219,0.35)',
            }}>
              <Sparkles size={18} color="white" />
            </div>
            <span style={{ fontWeight: 700, color: '#111827', fontSize: 17, letterSpacing: '-0.5px' }}>
              UML AI Studio
            </span>
          </Link>

          {/* Nav right */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Link to="/login" style={{ color: '#374151', fontWeight: 500, fontSize: 14, textDecoration: 'none' }}>
              Sign In
            </Link>
            <Link to="/login" style={{
              backgroundColor: '#6B4FDB', color: 'white',
              fontWeight: 600, fontSize: 14,
              padding: '9px 22px', borderRadius: 9999,
              textDecoration: 'none',
              boxShadow: '0 4px 12px rgba(107,79,219,0.3)',
              transition: 'all 0.2s',
            }}>
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* ===== HERO ===== */}
      <section style={{ paddingTop: 140, paddingBottom: 80, textAlign: 'center', padding: '140px 24px 80px' }}>
        <div style={{ maxWidth: 750, margin: '0 auto' }}>

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            style={{ marginBottom: 32 }}
          >
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              backgroundColor: '#EAE8F5', color: '#6B4FDB',
              padding: '8px 18px', borderRadius: 9999,
              fontSize: 13, fontWeight: 600,
            }}>
              <Sparkles size={13} />
              AI-Powered UML Diagrams
            </span>
          </motion.div>

          {/* H1 */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{
              fontSize: 'clamp(42px, 6vw, 64px)',
              fontWeight: 800,
              color: '#111827',
              letterSpacing: '-1.5px',
              lineHeight: 1.15,
              margin: '0 0 8px 0',
            }}
          >
            Create UML Diagrams
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            style={{
              fontSize: 'clamp(42px, 6vw, 64px)',
              fontWeight: 800,
              color: '#6B4FDB',
              letterSpacing: '-1.5px',
              lineHeight: 1.15,
              marginBottom: 24,
            }}
          >
            with AI Magic
          </motion.div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{ fontSize: 18, color: '#6B7280', lineHeight: 1.6, marginBottom: 40, maxWidth: 520, margin: '0 auto 40px' }}
          >
            Transform your ideas into professional UML diagrams instantly. Just
            describe your system and let AI do the rest.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}
          >
            <Link to="/register" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              backgroundColor: '#6B4FDB', color: 'white',
              fontWeight: 700, fontSize: 15,
              padding: '14px 28px', borderRadius: 9999,
              textDecoration: 'none',
              boxShadow: '0 4px 16px rgba(107,79,219,0.35)',
              transition: 'all 0.2s',
            }}>
              Start Creating Free <ArrowRight size={16} />
            </Link>

          </motion.div>
        </div>

        {/* Demo Preview Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          style={{ maxWidth: 900, margin: '64px auto 0', padding: '0 16px' }}
        >
          <div style={{
            backgroundColor: '#EAE8F5',
            borderRadius: 24,
            padding: 8,
            boxShadow: '0 20px 60px rgba(107,79,219,0.12), 0 4px 16px rgba(0,0,0,0.06)',
          }}>
            <div style={{ backgroundColor: 'white', borderRadius: 18, overflow: 'hidden', border: '1px solid rgba(229,231,235,0.5)' }}>
              {/* Browser mockbar */}
              <div style={{
                height: 42, backgroundColor: '#F9FAFB', borderBottom: '1px solid #E5E7EB',
                display: 'flex', alignItems: 'center', padding: '0 16px', gap: 8,
              }}>
                <div style={{ display: 'flex', gap: 6 }}>
                  <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#FCB5B0' }} />
                  <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#FCD48B' }} />
                  <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#86EFAC' }} />
                </div>
                <div style={{ flex: 1, height: 22, backgroundColor: '#F3F4F6', borderRadius: 9999, margin: '0 40px' }} />
              </div>
              {/* Preview content */}
              <div style={{
                height: 320, backgroundColor: '#FAFAFA',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              }}>
                <div style={{
                  width: 64, height: 64, borderRadius: 20,
                  backgroundColor: '#EAE8F5',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: 16,
                }}>
                  <Sparkles size={30} color="#6B4FDB" />
                </div>
                <p style={{ color: '#9CA3AF', fontSize: 14, fontWeight: 500 }}>Interactive Demo Preview</p>
                <p style={{ color: '#C4C4C4', fontSize: 12, marginTop: 4 }}>Sign up to start creating diagrams</p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ===== WHY CHOOSE ===== */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ textAlign: 'center', marginBottom: 56 }}
          >
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, color: '#111827', letterSpacing: '-0.8px', marginBottom: 12 }}>
              Why Choose UML AI Studio?
            </h2>
            <p style={{ color: '#6B7280', fontSize: 16 }}>Everything you need to create professional diagrams</p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: 20 }}>
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                style={{
                  backgroundColor: 'white',
                  borderRadius: 20,
                  border: '1px solid #E5E7EB',
                  padding: '28px 28px 32px',
                  transition: 'all 0.2s',
                  cursor: 'default',
                }}
                whileHover={{ y: -4, boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}
              >
                <div style={{
                  width: 44, height: 44, borderRadius: '50%',
                  backgroundColor: f.bg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: 20,
                }}>
                  {f.icon}
                </div>
                <h3 style={{ fontWeight: 700, color: '#111827', fontSize: 17, marginBottom: 8 }}>{f.title}</h3>
                <p style={{ color: '#6B7280', fontSize: 14, lineHeight: 1.65 }}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section style={{ padding: '0 24px 80px' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{
            maxWidth: 760, margin: '0 auto',
            backgroundColor: 'white',
            borderRadius: 24,
            border: '1px solid #E5E7EB',
            padding: '60px 48px',
            textAlign: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          }}
        >
          <h2 style={{ fontSize: 'clamp(26px, 3vw, 36px)', fontWeight: 800, color: '#111827', letterSpacing: '-0.5px', marginBottom: 12 }}>
            Ready to get started?
          </h2>
          <p style={{ color: '#6B7280', fontSize: 16, marginBottom: 36 }}>
            Join thousands of developers creating beautiful UML diagrams with AI
          </p>
          <Link to="/register" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            backgroundColor: '#6B4FDB', color: 'white',
            fontWeight: 700, fontSize: 15.5,
            padding: '15px 32px', borderRadius: 9999,
            textDecoration: 'none',
            boxShadow: '0 4px 16px rgba(107,79,219,0.3)',
          }}>
            Create Your First Diagram <ArrowRight size={16} />
          </Link>
        </motion.div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer style={{ borderTop: '1px solid #E5E7EB', padding: '20px 24px', textAlign: 'center' }}>
        <p style={{ color: '#9CA3AF', fontSize: 13 }}>© 2026 UML AI Studio. All rights reserved.</p>
      </footer>
    </div>
  )
}
