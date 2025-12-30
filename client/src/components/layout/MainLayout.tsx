import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Header } from './Header'

export function MainLayout() {
  return (
    <div className="flex h-screen" style={{ background: 'var(--color-bg-primary)' }}>
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto">
          {/* Mesh gradient background */}
          <div className="min-h-full p-6 mesh-bg">
            <div className="max-w-7xl mx-auto animate-fade-in">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
