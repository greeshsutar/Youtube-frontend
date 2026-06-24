import React, { useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import AuthProvider from './context/AuthContext'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import VideoPage from './pages/VideoPage'
import Upload from './pages/Upload'
import Channel from './pages/Channel'

export default function App() {
  const [searchKey, setSearchKey] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <Header onSearch={(q) => setSearchKey(q)} onToggleSidebar={() => setSidebarOpen((s) => !s)} />

        <div className="flex">
          <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

          <div className="min-h-screen flex-1 lg:pl-64">
            <Routes>
              <Route path="/" element={<Home searchKey={searchKey} />} />
              <Route path="/channel" element={<Channel />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/video/:id" element={<VideoPage />} />
              <Route path="/upload" element={<Upload />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </div>
      </div>
    </AuthProvider>
  )
}


