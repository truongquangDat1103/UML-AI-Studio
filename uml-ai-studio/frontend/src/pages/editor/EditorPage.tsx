import { useState, useRef, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, ZoomIn, ZoomOut, Maximize2, Copy, Save, Trash2, Lightbulb, Send, RefreshCw } from 'lucide-react'
import { useDiagramStore } from '@/stores/diagramStore'
import { generateDiagramAPI, projectsAPI } from '@/services/apiService'
import MermaidRenderer from '@/components/diagrams/MermaidRenderer'
import toast from 'react-hot-toast'
import type { DiagramType } from '@/types'

export default function EditorPage() {
  const { projectId } = useParams()
  const [input, setInput] = useState('')
  const [refineInput, setRefineInput] = useState('')
  const chatEndRef = useRef<HTMLDivElement>(null)
  const font = "'Inter', sans-serif"

  const {
    diagramType, setDiagramType, mermaidCode, setMermaidCode,
    explanation, setExplanation, suggestions, setSuggestions,
    messages, addMessage, isGenerating, setIsGenerating,
    streamingText, setStreamingText, appendStreamingText,
    projectTitle, setProjectTitle, zoomLevel, setZoom,
    resetSession, loadProject, projectId: storeProjectId, setProjectId,
  } = useDiagramStore()

  useEffect(() => {
    if (projectId && projectId !== storeProjectId) {
      projectsAPI.getById(projectId).then(res => {
        if (res.success) loadProject({
          id: res.data.id, title: res.data.title,
          diagramType: res.data.diagramType.toLowerCase() as DiagramType,
          mermaidCode: res.data.mermaidCode, explanation: res.data.explanation,
          messages: res.data.messages || [],
        })
      }).catch(() => toast.error('Không tìm thấy dự án'))
    }
  }, [projectId])

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, streamingText])

  const doGenerate = async (text: string) => {
    if (!text.trim() || isGenerating) return
    addMessage({ role: 'user', content: text, timestamp: new Date().toISOString() })
    setIsGenerating(true); setStreamingText('')
    try {
      const result = await generateDiagramAPI(
        { input: text, diagramType: diagramType.toUpperCase() as 'USECASE' | 'CLASS', conversationHistory: messages.map(m => ({ role: m.role, content: m.content })) },
        (chunk) => appendStreamingText(chunk),
      )
      setMermaidCode(result.mermaidCode); setExplanation(result.explanation)
      setSuggestions(result.suggestions || [])
      addMessage({ role: 'assistant', content: result.explanation, timestamp: new Date().toISOString() })
      setStreamingText('')
    } catch (err: any) { toast.error(err.message || 'Lỗi AI') }
    finally { setIsGenerating(false) }
  }

  const handleSave = async () => {
    if (!mermaidCode) { toast.error('Chưa có sơ đồ!'); return }
    try {
      const data = { title: projectTitle || 'Dự án mới', diagramType: diagramType.toUpperCase(), mermaidCode, explanation, messages, tags: [] }
      if (storeProjectId) { await projectsAPI.update(storeProjectId, data); toast.success('Đã cập nhật!') }
      else { const res = await projectsAPI.create(data); setProjectId(res.data.id); toast.success('Đã lưu!') }
    } catch { toast.error('Lỗi khi lưu') }
  }

  const panelStyle = {
    backgroundColor: 'white', borderRadius: 20,
    border: '1px solid #E5E7EB', boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
    display: 'flex', flexDirection: 'column' as const, overflow: 'hidden',
  }

  const pillBtn = (bg: string, color: string, disabled = false) => ({
    backgroundColor: bg, color, border: 'none', borderRadius: 9999,
    fontWeight: 700, fontSize: 13, cursor: disabled ? 'not-allowed' : 'pointer',
    fontFamily: font, opacity: disabled ? 0.5 : 1, transition: 'all 0.15s',
    display: 'flex', alignItems: 'center', gap: 6,
  })

  return (
    <div style={{
      display: 'flex', gap: 14, fontFamily: font,
      height: 'calc(100vh - 64px - 48px)',
    }}>

      {/* ===== CHAT PANEL ===== */}
      <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} style={{ width: 300, flexShrink: 0, ...panelStyle }}>

        {/* Type switch */}
        <div style={{ padding: '12px 12px 0', flexShrink: 0 }}>
          <div style={{ display: 'flex', backgroundColor: '#F3F4F6', borderRadius: 12, padding: 4 }}>
            {(['usecase', 'class'] as DiagramType[]).map(type => (
              <button key={type} onClick={() => setDiagramType(type)} style={{
                flex: 1, padding: '8px 0', borderRadius: 10, border: 'none', cursor: 'pointer', fontSize: 12,
                fontWeight: 700, fontFamily: font, transition: 'all 0.15s',
                backgroundColor: diagramType === type ? 'white' : 'transparent',
                color: diagramType === type ? '#6B4FDB' : '#9CA3AF',
                boxShadow: diagramType === type ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              }}>
                {type === 'usecase' ? '📐 Use Case' : '📦 Class'}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div style={{ padding: '12px', flexShrink: 0 }}>
          <textarea
            value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.ctrlKey && e.key === 'Enter') { doGenerate(input); setInput('') } }}
            placeholder="Mô tả hệ thống... (Ctrl+Enter)" rows={4} disabled={isGenerating}
            style={{
              width: '100%', backgroundColor: '#F9FAFB', border: '1.5px solid #E5E7EB',
              borderRadius: 12, padding: '10px 12px', fontSize: 13, color: '#111827',
              outline: 'none', resize: 'none', fontFamily: font, boxSizing: 'border-box',
              transition: 'all 0.15s', lineHeight: 1.5,
            }}
            onFocus={e => { e.target.style.borderColor = '#6B4FDB'; e.target.style.boxShadow = '0 0 0 3px rgba(107,79,219,0.1)' }}
            onBlur={e => { e.target.style.borderColor = '#E5E7EB'; e.target.style.boxShadow = 'none' }}
          />
          <button
            onClick={() => { doGenerate(input); setInput('') }}
            disabled={isGenerating || !input.trim()}
            style={{
              ...pillBtn('#6B4FDB', 'white', isGenerating || !input.trim()),
              width: '100%', marginTop: 8, padding: '11px 0',
              justifyContent: 'center', boxShadow: '0 4px 12px rgba(107,79,219,0.25)',
            }}
          >
            {isGenerating
              ? <><div style={{ width: 14, height: 14, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', animation: 'spin 0.6s linear infinite' }} /> Đang xử lý...</>
              : <><Sparkles size={15} /> Phân tích & Sinh sơ đồ</>
            }
          </button>
        </div>

        {/* Chat messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 12px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <AnimatePresence>
            {messages.map((msg, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: '85%', padding: '10px 13px', borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  backgroundColor: msg.role === 'user' ? '#6B4FDB' : '#F3F4F6',
                  color: msg.role === 'user' ? 'white' : '#374151',
                  fontSize: 13, lineHeight: 1.5,
                  border: msg.role === 'assistant' ? '1px solid #E5E7EB' : 'none',
                }}>
                  {msg.role === 'assistant' && (
                    <span style={{ display: 'block', fontSize: 10, fontWeight: 700, color: '#6B4FDB', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>AI Studio</span>
                  )}
                  <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                    {msg.content.length > 300 && i !== messages.length - 1 ? msg.content.slice(0, 300) + '…' : msg.content}
                  </p>
                </div>
              </motion.div>
            ))}
            {streamingText && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{
                  maxWidth: '85%', padding: '10px 13px', borderRadius: '18px 18px 18px 4px',
                  backgroundColor: '#F3F4F6', border: '1px solid #E5E7EB', fontSize: 13, color: '#374151',
                }}>
                  <span style={{ display: 'block', fontSize: 10, fontWeight: 700, color: '#6B4FDB', marginBottom: 4, textTransform: 'uppercase' }}>AI viết…</span>
                  <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{streamingText.slice(-400)}<span style={{ animation: 'blink 1s infinite', color: '#6B4FDB' }}>▊</span></p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={chatEndRef} />
        </div>

        {/* Refine */}
        {mermaidCode && (
          <div style={{ padding: '10px 12px 12px', borderTop: '1px solid #E5E7EB', flexShrink: 0 }}>
            <div style={{ display: 'flex', gap: 8 }}>
              <textarea
                value={refineInput} onChange={e => setRefineInput(e.target.value)} rows={2} disabled={isGenerating}
                placeholder="Yêu cầu chỉnh sửa thêm…"
                style={{
                  flex: 1, backgroundColor: '#F9FAFB', border: '1.5px solid #E5E7EB',
                  borderRadius: 12, padding: '8px 10px', fontSize: 12, resize: 'none',
                  fontFamily: font, outline: 'none', color: '#111827', boxSizing: 'border-box',
                }}
                onFocus={e => { e.target.style.borderColor = '#6B4FDB' }}
                onBlur={e => { e.target.style.borderColor = '#E5E7EB' }}
              />
              <button
                onClick={() => { doGenerate(refineInput); setRefineInput('') }}
                disabled={isGenerating || !refineInput.trim()}
                style={{
                  width: 36, height: 36, borderRadius: '50%', border: 'none',
                  backgroundColor: '#EAE8F5', color: '#6B4FDB', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, alignSelf: 'flex-end',
                  opacity: (!refineInput.trim() || isGenerating) ? 0.4 : 1,
                }}
              >
                <Send size={15} />
              </button>
            </div>
          </div>
        )}
      </motion.div>

      {/* ===== DIAGRAM PANEL ===== */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} style={{ flex: 1, ...panelStyle }}>
        {/* Toolbar */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 16px', borderBottom: '1px solid #E5E7EB', backgroundColor: '#F9FAFB', flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ backgroundColor: '#EAE8F5', color: '#6B4FDB', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 9999 }}>
              {diagramType === 'usecase' ? 'USE CASE' : 'CLASS'}
            </span>
            <input
              value={projectTitle} onChange={e => setProjectTitle(e.target.value)}
              placeholder="Tên sơ đồ..." className="title-input"
              style={{ background: 'transparent', border: 'none', fontSize: 13, fontWeight: 700, color: '#111827', outline: 'none', width: 180, fontFamily: font }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: 12, padding: '4px 6px' }}>
            {[
              { icon: <ZoomOut size={14} />, action: () => setZoom(Math.max(0.3, zoomLevel - 0.1)), title: 'Thu nhỏ' },
              null,
              { icon: <ZoomIn size={14} />, action: () => setZoom(Math.min(3, zoomLevel + 0.1)), title: 'Phóng to' },
              'divider',
              { icon: <Maximize2 size={14} />, action: () => setZoom(1), title: 'Reset zoom' },
              { icon: <Copy size={14} />, action: () => { navigator.clipboard.writeText(mermaidCode); toast.success('Copied!') }, title: 'Copy code' },
            ].map((item, i) => {
              if (item === 'divider') return <div key={i} style={{ width: 1, height: 16, backgroundColor: '#E5E7EB', margin: '0 2px' }} />
              if (!item) return <span key={i} style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 600, minWidth: 36, textAlign: 'center' }}>{Math.round(zoomLevel * 100)}%</span>
              return (
                <button key={i} onClick={(item as any).action} title={(item as any).title} style={{
                  padding: '5px 7px', borderRadius: 8, border: 'none', cursor: 'pointer',
                  backgroundColor: 'transparent', color: '#6B7280', display: 'flex', alignItems: 'center',
                }}>
                  {(item as any).icon}
                </button>
              )
            })}
          </div>
        </div>

        {/* Canvas */}
        <div style={{
          flex: 1, overflow: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center',
          backgroundImage: 'radial-gradient(#E5E7EB 1px, transparent 1px)', backgroundSize: '20px 20px',
          backgroundColor: '#F9FAFB',
        }}>
          <div style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center', transition: 'transform 0.2s' }}>
            {isGenerating && !mermaidCode ? (
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: 64, height: 64, borderRadius: 20, backgroundColor: '#EAE8F5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <Sparkles size={30} color="#6B4FDB" style={{ animation: 'pulse 1.5s ease-in-out infinite' }} />
                </div>
                <p style={{ fontSize: 14, color: '#6B7280', fontWeight: 500, fontFamily: font }}>AI đang thiết kế sơ đồ...</p>
              </div>
            ) : mermaidCode ? (
              <div style={{ backgroundColor: 'white', padding: 24, borderRadius: 20, boxShadow: '0 4px 16px rgba(0,0,0,0.06)', border: '1px solid #E5E7EB', minWidth: 260 }}>
                <MermaidRenderer code={mermaidCode} />
              </div>
            ) : (
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: 64, height: 64, borderRadius: 20, border: '2px dashed #D1D5DB', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                  <span style={{ fontSize: 26 }}>📐</span>
                </div>
                <p style={{ fontSize: 14, fontWeight: 600, color: '#374151', fontFamily: font, margin: '0 0 4px' }}>Khu vực hiển thị sơ đồ</p>
                <p style={{ fontSize: 12, color: '#9CA3AF', fontFamily: font, margin: 0 }}>Nhập mô tả bên trái để AI bắt đầu</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* ===== EXPLANATION PANEL ===== */}
      <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.16 }} style={{ width: 280, flexShrink: 0, ...panelStyle }}>
        {explanation ? (
          <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <h4 style={{ fontSize: 11, fontWeight: 700, color: '#6B4FDB', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 10px', display: 'flex', alignItems: 'center', gap: 6 }}>
                📖 Phân tích
              </h4>
              <div style={{ backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: 12, padding: '12px 14px', fontSize: 13, color: '#374151', lineHeight: 1.6 }}>
                {explanation}
              </div>
            </div>
            {suggestions.length > 0 && (
              <div>
                <h4 style={{ fontSize: 11, fontWeight: 700, color: '#D97706', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 10px', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Lightbulb size={12} /> Gợi ý
                </h4>
                {suggestions.map((s, i) => (
                  <div key={i} style={{ backgroundColor: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 12, padding: '10px 12px', marginBottom: 8, fontSize: 12, color: '#92400E', lineHeight: 1.5 }}>
                    <p style={{ margin: '0 0 8px' }}>{s}</p>
                    <button onClick={() => setRefineInput(s)} style={{
                      ...pillBtn('#FEF3C7', '#92400E'), padding: '4px 10px', fontSize: 11, border: '1px solid #FDE68A',
                    }}>
                      <RefreshCw size={10} /> Áp dụng
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12, padding: 24, textAlign: 'center' }}>
            <Lightbulb size={32} color="#D1D5DB" />
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#374151', margin: '0 0 4px', fontFamily: font }}>Phân tích chi tiết</p>
              <p style={{ fontSize: 12, color: '#9CA3AF', margin: 0, fontFamily: font, lineHeight: 1.4 }}>Sẽ xuất hiện sau khi tạo sơ đồ</p>
            </div>
          </div>
        )}

        {/* Save section */}
        <div style={{ borderTop: '1px solid #E5E7EB', padding: '12px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button onClick={handleSave} disabled={!mermaidCode} style={{
            ...pillBtn('#6B4FDB', 'white', !mermaidCode),
            padding: '11px 0', justifyContent: 'center', width: '100%',
            boxShadow: mermaidCode ? '0 4px 12px rgba(107,79,219,0.25)' : 'none',
          }}>
            <Save size={15} /> Lưu dự án
          </button>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => { navigator.clipboard.writeText(mermaidCode); toast.success('Copied!') }} disabled={!mermaidCode} style={{
              ...pillBtn('white', '#374151', !mermaidCode),
              flex: 1, padding: '9px 0', justifyContent: 'center', border: '1.5px solid #E5E7EB', fontSize: 12,
            }}>
              <Copy size={13} /> Copy
            </button>
            <button onClick={resetSession} style={{
              width: 36, height: 36, borderRadius: '50%', border: '1.5px solid #E5E7EB',
              backgroundColor: 'white', cursor: 'pointer', color: '#9CA3AF', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Trash2 size={15} />
            </button>
          </div>
        </div>
      </motion.div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes blink { 0%,50%{opacity:1} 51%,100%{opacity:0} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
      `}</style>
    </div>
  )
}
