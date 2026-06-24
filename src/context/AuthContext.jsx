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
    if (!token) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
  }, [token])

  const value = useMemo(() => {
    // 🔥 LOGIN
    const login = async (emailOrUsername, password) => {
      const payload = {
        email: emailOrUsername,
        username: emailOrUsername,
        password,
      }

      const res = await api.post('/api/auth/login', payload)

      // ✅ FIXED HERE
      const nextToken = res?.data?.data?.token
      const nextUser = res?.data?.data?.user

      if (!nextToken) throw new Error('Login failed: missing token')

      setToken(nextToken)
      setUser(nextUser || null)

      localStorage.setItem('token', nextToken)
      if (nextUser) {
        localStorage.setItem('user', JSON.stringify(nextUser))
      }

      return res.data
    }

    // 🔥 REGISTER
    const register = async ({ username, email, password }) => {
      const payload = { username, email, password }

      const res = await api.post('/api/auth/register', payload)

      // ✅ FIXED HERE
      const nextToken = res?.data?.data?.token
      const nextUser = res?.data?.data?.user

      if (nextToken) {
        setToken(nextToken)
        setUser(nextUser || null)

        localStorage.setItem('token', nextToken)
        if (nextUser) {
          localStorage.setItem('user', JSON.stringify(nextUser))
        }
      }

      return res.data
    }

    // 🔥 LOGOUT
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