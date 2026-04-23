import mermaid from 'mermaid'

export function initMermaid() {
  mermaid.initialize({
    startOnLoad: false,
    theme: 'default',
    themeVariables: {
      // Background
      mainBkg: '#EEF2FF',
      secondBkg: '#F5F3FF',
      // Text
      primaryTextColor: '#1E1B4B',
      secondaryTextColor: '#475569',
      tertiaryTextColor: '#64748B',
      // Lines & borders
      primaryBorderColor: '#6366F1',
      secondaryBorderColor: '#818CF8',
      lineColor: '#94A3B8',
      // Nodes
      primaryColor: '#EEF2FF',
      secondaryColor: '#F5F3FF',
      tertiaryColor: '#FFF7ED',
      // Class diagram
      classText: '#1E1B4B',
      // Notes
      noteBkgColor: '#FEF3C7',
      noteTextColor: '#1E1B4B',
      noteBorderColor: '#F59E0B',
      // Fonts
      fontFamily: "'Inter', sans-serif",
      fontSize: '14px',
      // Background
      background: '#FFFFFF',
    },
    securityLevel: 'loose',
    flowchart: {
      htmlLabels: true,
      useMaxWidth: true,
      curve: 'basis',
    },
  })
}

export async function renderMermaidDiagram(
  code: string,
  elementId: string
): Promise<string> {
  try {
    const { svg } = await mermaid.render(elementId, code)
    return svg
  } catch (error) {
    console.error('Mermaid render error:', error)
    throw error
  }
}

export function validateMermaidCode(code: string): { valid: boolean; error?: string } {
  try {
    const trimmed = code.trim()
    if (!trimmed) {
      return { valid: false, error: 'Mermaid code is empty' }
    }

    const validStarts = ['graph', 'flowchart', 'classDiagram', 'sequenceDiagram', 'stateDiagram', 'erDiagram', 'gantt', 'pie', 'mindmap']
    const hasValidStart = validStarts.some(s => trimmed.startsWith(s))

    if (!hasValidStart) {
      return { valid: false, error: 'Invalid Mermaid diagram type' }
    }

    return { valid: true }
  } catch (error) {
    return { valid: false, error: String(error) }
  }
}
