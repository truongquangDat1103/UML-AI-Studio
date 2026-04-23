import { create } from 'zustand'
import type { DiagramType } from '@/types'

interface AIMessage {
    role: 'user' | 'assistant'
    content: string
    timestamp: string
}

interface DiagramState {
    projectId: string | null
    projectTitle: string
    diagramType: DiagramType
    mermaidCode: string
    explanation: string
    suggestions: string[]
    messages: AIMessage[]
    isGenerating: boolean
    streamingText: string
    tokenCount: number
    zoomLevel: number

    setDiagramType: (type: DiagramType) => void
    setMermaidCode: (code: string) => void
    setExplanation: (text: string) => void
    setSuggestions: (items: string[]) => void
    addMessage: (msg: AIMessage) => void
    setIsGenerating: (val: boolean) => void
    setStreamingText: (text: string) => void
    appendStreamingText: (text: string) => void
    setProjectId: (id: string | null) => void
    setProjectTitle: (title: string) => void
    setZoom: (level: number) => void
    resetSession: () => void
    loadProject: (data: {
        id: string; title: string; diagramType: DiagramType;
        mermaidCode: string; explanation: string; messages: AIMessage[]
    }) => void
}

export const useDiagramStore = create<DiagramState>((set) => ({
    projectId: null,
    projectTitle: 'Untitled',
    diagramType: 'usecase',
    mermaidCode: '',
    explanation: '',
    suggestions: [],
    messages: [],
    isGenerating: false,
    streamingText: '',
    tokenCount: 0,
    zoomLevel: 1,

    setDiagramType: (type) => set({ diagramType: type }),
    setMermaidCode: (code) => set({ mermaidCode: code }),
    setExplanation: (text) => set({ explanation: text }),
    setSuggestions: (items) => set({ suggestions: items }),
    addMessage: (msg) => set((s) => ({ messages: [...s.messages, msg] })),
    setIsGenerating: (val) => set({ isGenerating: val }),
    setStreamingText: (text) => set({ streamingText: text }),
    appendStreamingText: (text) => set((s) => ({ streamingText: s.streamingText + text })),
    setProjectId: (id) => set({ projectId: id }),
    setProjectTitle: (title) => set({ projectTitle: title }),
    setZoom: (level) => set({ zoomLevel: Math.max(0.25, Math.min(3, level)) }),
    resetSession: () => set({
        projectId: null, projectTitle: 'Untitled', mermaidCode: '', explanation: '',
        suggestions: [], messages: [], isGenerating: false, streamingText: '', tokenCount: 0,
    }),
    loadProject: (data) => set({
        projectId: data.id, projectTitle: data.title,
        diagramType: data.diagramType, mermaidCode: data.mermaidCode,
        explanation: data.explanation, messages: data.messages,
    }),
}))
