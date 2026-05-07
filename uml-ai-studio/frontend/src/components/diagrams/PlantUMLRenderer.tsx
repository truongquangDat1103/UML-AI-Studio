import { useMemo, useState } from 'react'

interface Props {
    code: string        // PlantUML text (e.g. "@startuml ... @enduml")
    className?: string
}

/**
 * Render PlantUML diagram bằng cách encode hex và gọi public PlantUML server.
 * Không cần cài Java, không cần server riêng — chỉ cần internet.
 * URL format: https://www.plantuml.com/plantuml/svg/~h{hex}
 */
function encodePlantUmlHex(text: string): string {
    return Array.from(new TextEncoder().encode(text))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('')
}

export default function PlantUMLRenderer({ code, className = '' }: Props) {
    const [imgError, setImgError] = useState(false)

    const svgUrl = useMemo(() => {
        if (!code) return ''
        const hex = encodePlantUmlHex(code)
        return `https://www.plantuml.com/plantuml/svg/~h${hex}`
    }, [code])

    if (!code) return null

    if (imgError) {
        return (
            <div
                className={className}
                style={{
                    padding: 16,
                    borderRadius: 12,
                    background: 'rgba(239,68,68,0.08)',
                    border: '1px solid rgba(239,68,68,0.3)',
                    textAlign: 'center',
                }}
            >
                <p style={{ color: '#EF4444', fontSize: 13, fontWeight: 600, margin: '0 0 4px' }}>
                    ⚠️ Không thể kết nối PlantUML server
                </p>
                <p style={{ color: '#9CA3AF', fontSize: 12, margin: 0 }}>
                    Kiểm tra kết nối internet hoặc thử lại sau.
                </p>
            </div>
        )
    }

    return (
        <div
            className={className}
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-start',
                width: '100%',
            }}
        >
            <img
                src={svgUrl}
                alt="UML Diagram"
                onError={() => setImgError(true)}
                onLoad={() => setImgError(false)}
                style={{
                    maxWidth: '100%',
                    height: 'auto',
                    borderRadius: 8,
                }}
            />
        </div>
    )
}
