import React, { useContext, useEffect, useMemo, useState } from 'react'
import api from '../api/axios'
import VideoCard from '../components/VideoCard'
import Loader from '../components/Loader'
import { AuthContext } from '../context/AuthContext'

export default function Home() {
  const { user } = useContext(AuthContext)
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return videos
    return videos.filter((v) => {
      const title = v?.title || ''
      const channel = v?.channel?.name || v?.channelName || ''
      return title.toLowerCase().includes(q) || channel.toLowerCase().includes(q)
    })
  }, [videos, query])

  useEffect(() => {
    let active = true
    const fetchVideos = async () => {
      try {
        setLoading(true)
        setError('')
        const res = await api.get('/api/videos');
        console.log(res.data);
        if (!active) return
       setVideos(res?.data?.data || [])
      } catch (e) {
        if (!active) return
        setError(e?.response?.data?.message || e?.message || 'Failed to fetch videos')
      } finally {
        if (active) setLoading(false)
      }
    }

    fetchVideos()
    return () => {
      active = false
    }
  }, [user])

  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Home</h1>
      </div>

      {loading && <Loader text="Loading videos..." />}
      {error && <div className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</div>}

      {!loading && !error && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((v) => (
            <VideoCard key={v._id || v.id} video={v} />
          ))}
        </div>
      )}

      {/* Search input hook is via Navbar onSearch */}
      <input type="hidden" value={query} readOnly />
    </main>
  )
}

