import React, { useContext, useEffect, useMemo, useState } from 'react'
import api from '../api/axios'
import Loader from '../components/Loader'
import { AuthContext } from '../context/AuthContext'
import VideoCard from '../components/VideoCard'

export default function Channel() {
  const { user } = useContext(AuthContext)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [channel, setChannel] = useState(null)
  const [busyDelete, setBusyDelete] = useState(false)

  const uploadedVideos = useMemo(() => {
    // Backend /api/channel currently returns channel doc only (no videos). We'll try best:
    // If backend extends it later to include videos, this will still work.
    return channel?.videos || channel?.uploadedVideos || []
  }, [channel])

  useEffect(() => {
    let active = true

    const fetchChannel = async () => {
      try {
        setLoading(true)
        setError('')
        const res = await api.get('/api/channel')
        if (!active) return
        setChannel(res?.data?.data || null)
      } catch (e) {
        if (!active) return
        setError(e?.response?.data?.message || e?.message || 'Failed to fetch channel')
      } finally {
        if (active) setLoading(false)
      }
    }

    fetchChannel()
    return () => {
      active = false
    }
  }, [user])

  const onDeleteVideo = async (videoId) => {
    if (!videoId) return
    setBusyDelete(true)
    setError('')
    try {
      await api.delete(`/api/videos/${videoId}`)
      // If backend doesn't provide videos in /api/channel, we'll re-fetch channel.
      const res = await api.get('/api/channel')
      setChannel(res?.data?.data || null)
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || 'Failed to delete video')
    } finally {
      setBusyDelete(false)
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <h1 className="mb-4 text-xl font-semibold">My Channel</h1>

      {loading && <Loader text="Loading channel..." />}
      {error && <div className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</div>}

      {!loading && !error && channel && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_2fr]">
          <section className="rounded-lg border bg-white p-4">
            <div className="text-lg font-bold">{channel?.name || 'Channel'}</div>
            <div className="mt-2 text-sm text-gray-700">{channel?.description || ''}</div>
          </section>

          <section className="rounded-lg border bg-white p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold">Uploaded Videos</h2>
              {busyDelete && <div className="text-xs text-gray-500">Updating...</div>}
            </div>

            {uploadedVideos.length === 0 ? (
              <div className="mt-3 text-sm text-gray-500">
                No uploaded videos info available from <code className="rounded bg-gray-100 px-1">/api/channel</code>.
                {/* UI will still work if backend includes videos */}
              </div>
            ) : (
              <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {uploadedVideos.map((v) => (
                  <div key={v._id || v.id} className="relative">
                    <VideoCard video={v} />
                    <button
                      type="button"
                      onClick={() => onDeleteVideo(v._id || v.id)}
                      disabled={busyDelete}
                      className="absolute right-2 top-2 rounded bg-red-600 px-3 py-1 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-60"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      )}

      {!loading && !error && !channel && <div className="text-sm text-gray-500">No channel found.</div>}
    </main>
  )
}

