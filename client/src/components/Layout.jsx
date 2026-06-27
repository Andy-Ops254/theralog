import React, { useEffect, useState } from 'react'
import Sidebar from './Sidebar'
import Navbar from './Navbar'

function Layout({ children }) {
  const [sidebarExpanded, setSidebarExpanded] = useState(() => {
    if (typeof window === 'undefined') {
      return true
    }

    return window.innerWidth >= 1024
  })

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarExpanded(false)
      } else {
        setSidebarExpanded(true)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-100 via-cyan-50 to-slate-200">
      <div className="flex min-h-screen">
        <Sidebar isExpanded={sidebarExpanded} />

        <div className="flex flex-1 flex-col">
          <Navbar onToggleSidebar={() => setSidebarExpanded((prev) => !prev)} />

          <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
            {children ? (
              children
            ) : (
              <div className="mx-auto max-w-5xl rounded-3xl border border-slate-200 bg-white/70 p-8 shadow-sm backdrop-blur-sm">
                <h2 className="text-3xl font-semibold text-slate-900">Welcome to Theralog</h2>
                <p className="mt-4 text-slate-600">Your dashboard layout is ready. Use the sidebar to navigate once you add pages.</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}

export default Layout