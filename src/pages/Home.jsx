import React, { useContext, useEffect, useMemo, useState } from 'react'
import api from '../api/axios'
import VideoCard from '../components/VideoCard'
import Loader from '../components/Loader'
import { AuthContext } from '../context/AuthContext'

export default function Home({ searchKey }) {
  const { user } = useContext(AuthContext)
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [activeCategory, setActiveCategory] = useState('All')
  const categories = useMemo(
    () => ['All', 'Tech', 'Music', 'Gaming', 'Education', 'News'],
    [],
  )

  const filtered = useMemo(() => {
    const q = (searchKey || '').trim().toLowerCase()
    const cat = activeCategory.toLowerCase()

    const matchesQuery = (v) => {
      if (!q) return true
      const title = v?.title || ''
      const channel = v?.channel?.name || v?.channelName || ''
      return title.toLowerCase().includes(q) || channel.toLowerCase().includes(q)
    }

    const matchesCategory = (v) => {
      if (activeCategory === 'All') return true

      // Frontend-only filtering by title/description keywords (backend schema has no explicit category)
      const title = `${v?.title || ''}`.toLowerCase()
      const desc = `${v?.description || ''}`.toLowerCase()

      const map = {
        tech: ['tech', 'code', 'programming', 'javascript', 'react', 'frontend', 'backend'],
        music: ['music', 'song', 'audio', 'piano', 'guitar', 'rap'],
        gaming: ['game', 'gaming', 'fps', 'minecraft', 'valorant', 'fortnite', 'stream'],
        education: ['learn', 'education', 'course', 'tutorial', 'study', 'school'],
        news: ['news', 'breaking', 'world', 'report', 'headline'],
      }

      const keywords = map[cat] || []
      return keywords.some((k) => title.includes(k) || desc.includes(k))
    }

    return videos.filter((v) => matchesQuery(v) && matchesCategory(v))
  }, [videos, searchKey, activeCategory])

  useEffect(() => {
    let active = true

    const fetchVideos = async () => {
      try {
        setLoading(true)
        setError('')
        const res = await api.get('/api/videos')
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
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-semibold">Home</h1>

        <div className="flex flex-wrap items-center gap-2">
          {categories.map((c) => {
            const isActive = c === activeCategory
            return (
              <button
                key={c}
                type="button"
                onClick={() => setActiveCategory(c)}
                className={
                  'rounded-full border px-3 py-1.5 text-xs font-semibold transition ' +
                  (isActive
                    ? 'border-red-600 bg-red-50 text-red-700'
                    : 'bg-white text-gray-700 hover:bg-gray-50')
                }
              >
                {c}
              </button>
            )
          })}
        </div>
      </div>

      {loading && <Loader text="Loading videos..." />}
      {error && <div className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</div>}

      {!loading && !error && (
        <>
          {filtered.length === 0 ? (
            <div className="text-sm text-gray-500">No videos found</div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((v) => (
                <VideoCard key={v._id || v.id} video={v} />
              ))}
            </div>
          )}
        </>
      )}
    </main>
  )
}


