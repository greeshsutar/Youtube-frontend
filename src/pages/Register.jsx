import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

export default function Register() {
  const { register } = useContext(AuthContext)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const navigate = useNavigate()

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await register({ username, email, password })
      navigate('/', { replace: true })
    } catch (e2) {
      setError(e2?.response?.data?.message || e2?.message || 'Register failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="mx-auto max-w-md px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold">Register</h1>

      <form onSubmit={onSubmit} className="space-y-4 rounded-lg border bg-white p-5 shadow-sm">
        {error && <div className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</div>}

        <div>
          <label className="mb-1 block text-sm font-medium">Username</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full rounded border px-3 py-2 text-sm outline-none focus:border-red-500"
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
          {loading ? 'Creating account...' : 'Register'}
        </button>

        <div className="text-center text-sm">
          Already have an account?{' '}
          <Link className="font-medium text-red-700 hover:underline" to="/login">
            Login
          </Link>
        </div>
      </form>
    </main>
  )
}

