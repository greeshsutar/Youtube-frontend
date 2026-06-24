import React, { createContext, useEffect, useMemo, useState } from 'react'
import api from '../api/axios'

export const AuthContext = createContext(null)

export default function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'))
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('user')
    return raw ? JSON.parse(raw) : null
  })

  useEffect(() => {
    // Keep axios interceptor in sync (interceptor reads localStorage each request)
    if (!token) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
  }, [token])

  const value = useMemo(() => {
    const login = async (emailOrUsername, password) => {
      // Backend authRoutes should accept { email, password } or { username, password }
      // We'll send both fields; backend may ignore unknown.
      const payload = {
        email: emailOrUsername,
        username: emailOrUsername,
        password,
      }

      const res = await api.post('/api/auth/login', payload)
      const nextToken = res?.data?.token || res?.data?.accessToken
      const nextUser = res?.data?.user

      if (!nextToken) throw new Error('Login failed: missing token')
      setToken(nextToken)
      setUser(nextUser || null)
      localStorage.setItem('token', nextToken)
      if (nextUser) localStorage.setItem('user', JSON.stringify(nextUser))
      return res.data
    }

    const register = async ({ username, email, password }) => {
      const payload = { username, email, password }
      const res = await api.post('/api/auth/register', payload)
      const nextToken = res?.data?.token || res?.data?.accessToken
      const nextUser = res?.data?.user

      if (nextToken) {
        setToken(nextToken)
        setUser(nextUser || null)
        localStorage.setItem('token', nextToken)
        if (nextUser) localStorage.setItem('user', JSON.stringify(nextUser))
      } else {
        // Some backends only return created user; keep current token if absent.
        setUser(nextUser || null)
        if (nextUser) localStorage.setItem('user', JSON.stringify(nextUser))
      }

      return res.data
    }

    const logout = () => {
      setToken(null)
      setUser(null)
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }

    return { user, token, login, register, logout }
  }, [user, token])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

