import React, { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Navbar from './Navbar'

function Layout() {
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
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}

export default Layout