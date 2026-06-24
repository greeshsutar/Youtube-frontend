import React, { useContext, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

export default function Header({ onSearch, onToggleSidebar }) {
  const { user, logout } = useContext(AuthContext)
  const [q, setQ] = useState('')
  const navigate = useNavigate()

  const profileLabel = useMemo(() => {
    if (!user) return 'Login'
    return user?.username || user?.name || 'Profile'
  }, [user])

  const handleSubmit = (e) => {
    e.preventDefault()
    const next = q.trim()
    onSearch?.(next)
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-50 border-b bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
        <button
          type="button"
          aria-label="Toggle menu"
          onClick={onToggleSidebar}
          className="rounded p-2 text-gray-700 hover:bg-gray-100 lg:hidden"
        >
          ☰
        </button>

        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded bg-red-600 text-white font-bold">YT</div>
          <div className="hidden sm:block text-lg font-semibold">YouTube Clone</div>
        </Link>

        <form onSubmit={handleSubmit} className="flex-1">
          <div className="flex items-center gap-2 rounded-full border bg-white px-3 py-2">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search"
              className="w-full outline-none"
            />
            <button type="submit" className="rounded-full bg-gray-100 px-3 py-1 text-sm hover:bg-gray-200">
              Search
            </button>
          </div>
        </form>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <button
                type="button"
                className="rounded-full border px-3 py-2 text-sm hover:bg-gray-50"
                onClick={() => navigate('/upload')}
              >
                Upload
              </button>
              <button
                type="button"
                className="rounded-full bg-gray-900 px-3 py-2 text-sm text-white hover:bg-gray-800"
                onClick={() => logout()}
              >
                {profileLabel}
              </button>
            </>
          ) : (
            <Link to="/login" className="rounded-full bg-gray-900 px-3 py-2 text-sm text-white hover:bg-gray-800">
              {profileLabel}
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}

