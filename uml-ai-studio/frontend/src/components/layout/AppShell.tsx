import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'

export default function AppShell() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      backgroundColor: '#EDEEF3',
      overflow: 'hidden',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      colorScheme: 'light',
    }}>
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(c => !c)} />

      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden', minWidth: 0 }}>
        <Header onToggle={() => setCollapsed(c => !c)} />

        <main style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
