import React, { useContext, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

export default function Login() {
  const { login } = useContext(AuthContext)
  const [emailOrUsername, setEmailOrUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo = location?.state?.from?.pathname || '/'

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await login(emailOrUsername, password)
      navigate(redirectTo, { replace: true })
    } catch (e2) {
      setError(e2?.response?.data?.message || e2?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="mx-auto max-w-md px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold">Login</h1>

      <form onSubmit={onSubmit} className="space-y-4 rounded-lg border bg-white p-5 shadow-sm">
        {error && <div className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</div>}

        <div>
          <label className="mb-1 block text-sm font-medium">Email or Username</label>
          <input
            value={emailOrUsername}
            onChange={(e) => setEmailOrUsername(e.target.value)}
            className="w-full rounded border px-3 py-2 text-sm outline-none focus:border-red-500"
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded border px-3 py-2 text-sm outline-none focus:border-red-500"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <div className="text-center text-sm">
          Don&apos;t have an account?{' '}
          <Link className="font-medium text-red-700 hover:underline" to="/register">
            Register
          </Link>
        </div>
      </form>
    </main>
  )
}

