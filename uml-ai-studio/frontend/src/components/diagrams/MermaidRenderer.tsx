import { useEffect, useRef, useState } from 'react'
import mermaid from 'mermaid'

mermaid.initialize({
    startOnLoad: false,
    theme: 'dark',
    themeVariables: {
        primaryColor: '#6366f1',
        primaryTextColor: '#e2e8f0',
        primaryBorderColor: '#818cf8',
        lineColor: '#94a3b8',
        secondaryColor: '#8b5cf6',
        tertiaryColor: '#1e1b4b',
        background: '#0a0a1a',
        mainBkg: '#1e1b4b',
        nodeBorder: '#6366f1',
        clusterBkg: 'rgba(99, 102, 241, 0.1)',
        titleColor: '#e2e8f0',
        edgeLabelBackground: '#1e1b4b',
    },
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 14,
})

interface Props {
    code: string
    className?: string
}

export default function MermaidRenderer({ code, className = '' }: Props) {
    const containerRef = useRef<HTMLDivElement>(null)
    const [error, setError] = useState<string | null>(null)
    const [svgContent, setSvgContent] = useState('')

    useEffect(() => {
        if (!code || !containerRef.current) return

        const render = async () => {
            try {
                setError(null)
                const id = `mermaid-${Date.now()}`
                const { svg } = await mermaid.render(id, code)
                setSvgContent(svg)
            } catch (err: any) {
                setError(err.message || 'Mermaid render error')
                setSvgContent('')
            }
        }

        render()
    }, [code])

    if (error) {
        return (
            <div className={`p-4 rounded-xl ${className}`} style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                <p className="text-red-400 text-sm font-medium mb-1">⚠️ Lỗi render Mermaid</p>
                <pre className="text-xs text-red-300/70 whitespace-pre-wrap">{error}</pre>
            </div>
        )
    }

    return (
        <div
            ref={containerRef}
            className={`mermaid-container ${className}`}
            dangerouslySetInnerHTML={{ __html: svgContent }}
            style={{ display: 'flex', justifyContent: 'center' }}
        />
    )
}
