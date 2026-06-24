import React, { useContext, useState } from 'react'
import api from '../api/axios'
import ProtectedRoute from '../components/ProtectedRoute'
import { AuthContext } from '../context/AuthContext'

export default function Upload() {
  return (
    <ProtectedRoute>
      <UploadInner />
    </ProtectedRoute>
  )
}

function UploadInner() {
  const { user } = useContext(AuthContext)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [thumbnailUrl, setThumbnailUrl] = useState('')
  const [videoUrl, setVideoUrl] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const payload = {
        title,
        description,
    thumbnailUrl: thumbnailUrl,
        videoUrl,
      }
      const res = await api.post('/api/videos', payload)
      setSuccess(res?.data?.message || 'Upload successful')
      setTitle('')
      setDescription('')
      setThumbnailUrl('')
      setVideoUrl('')
    } catch (e2) {
      setError(e2?.response?.data?.message || e2?.message || 'Upload failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Upload</h1>

      <form onSubmit={onSubmit} className="space-y-4 rounded-lg border bg-white p-5 shadow-sm">
        {error && <div className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</div>}
        {success && <div className="rounded border border-green-200 bg-green-50 p-3 text-sm text-green-800">{success}</div>}

        {!user && <div className="text-sm text-gray-600">Login required.</div>}

        <div>
          <label className="mb-1 block text-sm font-medium">Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded border px-3 py-2 text-sm outline-none focus:border-red-500" required />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="min-h-[90px] w-full rounded border p-2 text-sm outline-none focus:border-red-500" required />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Thumbnail URL</label>
          <input value={thumbnailUrl} onChange={(e) => setThumbnailUrl(e.target.value)} className="w-full rounded border px-3 py-2 text-sm outline-none focus:border-red-500" placeholder="uploads/image.jpg" required />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Video URL</label>
          <input value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} className="w-full rounded border px-3 py-2 text-sm outline-none focus:border-red-500" placeholder="uploads/video.mp4" required />
        </div>

        <button type="submit" disabled={loading} className="w-full rounded bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60">
          {loading ? 'Uploading...' : 'Upload Video'}
        </button>
      </form>
    </main>
  )
}

