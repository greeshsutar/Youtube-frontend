import React, { useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import AuthProvider from './context/AuthContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import VideoPage from './pages/VideoPage'
import Upload from './pages/Upload'

export default function App() {
  const [searchKey, setSearchKey] = useState('')

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <Navbar onSearch={(q) => setSearchKey(q)} />
        <Routes>
          <Route path="/" element={<Home searchKey={searchKey} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/video/:id" element={<VideoPage />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </AuthProvider>
  )
}

