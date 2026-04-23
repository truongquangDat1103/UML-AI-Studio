import { useState } from 'react'
import { motion } from 'framer-motion'
import { Cpu, Save, RefreshCw, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

const font = "'Inter', -apple-system, sans-serif"
const card = { backgroundColor: 'white', borderRadius: 20, border: '1px solid #E5E7EB', boxShadow: '0 1px 4px rgba(0,0,0,0.05)', padding: '24px 28px' }
const input = { width: '100%', padding: '10px 14px', backgroundColor: '#F9FAFB', border: '1.5px solid #E5E7EB', borderRadius: 12, fontSize: 13, color: '#111827', outline: 'none', fontFamily: font, boxSizing: 'border-box' as const }

export default function AIConfigPage() {
  const [config, setConfig] = useState({
    model: 'gemini-1.5-flash', temperature: '0.7', maxTokens: '4096',
    systemPrompt: 'You are an expert UML diagram designer. Generate clear, accurate Mermaid diagrams from user requirements.',
    usecasePrompt: 'Analyze the requirements and generate a Use Case diagram focusing on actors and system boundaries.',
    classPrompt: 'Generate a Class diagram with proper attributes, methods, and relationships.',
  })

  const handleSave = () => toast.success('Đã lưu cấu hình AI!')
  const set = (k: string, v: string) => setConfig(prev => ({ ...prev, [k]: v }))

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', fontFamily: font }}>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#111827', margin: '0 0 4px', letterSpacing: '-0.4px' }}>Cấu hình AI</h1>
          <p style={{ fontSize: 13, color: '#6B7280', margin: 0 }}>Điều chỉnh model và prompt cho AI Engine</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => setConfig(prev => ({ ...prev, temperature: '0.7' }))} style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '9px 16px',
            backgroundColor: 'white', border: '1.5px solid #E5E7EB', borderRadius: 12,
            fontSize: 13, fontWeight: 600, color: '#374151', cursor: 'pointer', fontFamily: font,
          }}>
            <RefreshCw size={13} /> Reset
          </button>
          <button onClick={handleSave} style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '9px 18px',
            backgroundColor: '#6B4FDB', color: 'white', border: 'none',
            borderRadius: 12, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: font,
            boxShadow: '0 4px 12px rgba(107,79,219,0.25)',
          }}>
            <Save size={13} /> Lưu cấu hình
          </button>
        </div>
      </motion.div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Model settings */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
          <div style={card}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', backgroundColor: '#EAE8F5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Cpu size={17} color="#6B4FDB" />
              </div>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: '#111827', margin: 0 }}>Model Settings</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Gemini Model</label>
                <select value={config.model} onChange={e => set('model', e.target.value)} style={{ ...input, cursor: 'pointer' }}>
                  <option value="gemini-1.5-flash">gemini-1.5-flash</option>
                  <option value="gemini-1.5-pro">gemini-1.5-pro</option>
                  <option value="gemini-2.0-flash">gemini-2.0-flash</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Temperature <span style={{ color: '#6B4FDB', fontWeight: 700 }}>{config.temperature}</span></label>
                <input type="range" min="0" max="1" step="0.1" value={config.temperature} onChange={e => set('temperature', e.target.value)}
                  style={{ width: '100%', accentColor: '#6B4FDB', cursor: 'pointer', marginTop: 8 }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#9CA3AF', marginTop: 4 }}>
                  <span>Chính xác</span><span>Sáng tạo</span>
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Max Tokens</label>
                <input value={config.maxTokens} onChange={e => set('maxTokens', e.target.value)} style={input}
                  onFocus={e => { e.target.style.borderColor = '#6B4FDB'; e.target.style.boxShadow = '0 0 0 3px rgba(107,79,219,0.1)' }}
                  onBlur={e => { e.target.style.borderColor = '#E5E7EB'; e.target.style.boxShadow = 'none' }}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* System prompt */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14 }}>
          <div style={card}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: '#111827', margin: '0 0 16px' }}>System Prompt</h2>
            <textarea value={config.systemPrompt} onChange={e => set('systemPrompt', e.target.value)} rows={4}
              style={{ ...input, resize: 'vertical', lineHeight: 1.6 }}
              onFocus={e => { e.target.style.borderColor = '#6B4FDB'; e.target.style.boxShadow = '0 0 0 3px rgba(107,79,219,0.1)' }}
              onBlur={e => { e.target.style.borderColor = '#E5E7EB'; e.target.style.boxShadow = 'none' }}
            />
          </div>
        </motion.div>

        {/* Diagram prompts */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div style={card}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: '#111827', margin: '0 0 16px' }}>Diagram-Specific Prompts</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {[
                { label: '📐 Use Case Prompt', key: 'usecasePrompt', val: config.usecasePrompt },
                { label: '📦 Class Diagram Prompt', key: 'classPrompt', val: config.classPrompt },
              ].map(p => (
                <div key={p.key}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6 }}>{p.label}</label>
                  <textarea value={p.val} onChange={e => set(p.key, e.target.value)} rows={4}
                    style={{ ...input, resize: 'vertical', lineHeight: 1.6 }}
                    onFocus={e => { e.target.style.borderColor = '#6B4FDB'; e.target.style.boxShadow = '0 0 0 3px rgba(107,79,219,0.1)' }}
                    onBlur={e => { e.target.style.borderColor = '#E5E7EB'; e.target.style.boxShadow = 'none' }}
                  />
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Status */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.26 }}>
          <div style={{ backgroundColor: '#ECFDF5', borderRadius: 16, border: '1px solid #A7F3D0', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <CheckCircle size={18} color="#10B981" />
            <p style={{ fontSize: 13, fontWeight: 600, color: '#065F46', margin: 0 }}>
              AI Engine đang hoạt động bình thường — Model: <strong>{config.model}</strong>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
