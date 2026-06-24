import React, { useContext, useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../api/axios'
import Loader from '../components/Loader'
import Comment from '../components/Comment'
import { AuthContext } from '../context/AuthContext'

export default function VideoPage() {
  const { id } = useParams()
  const { user } = useContext(AuthContext)

  const [video, setVideo] = useState(null)
  const [loadingVideo, setLoadingVideo] = useState(true)
  const [error, setError] = useState('')

  const [likesBusy, setLikesBusy] = useState(false)
  const [comments, setComments] = useState([])
  const [commentsBusy, setCommentsBusy] = useState(false)
  const [commentText, setCommentText] = useState('')

  const videoSrc = useMemo(() => {
    const src = video?.videoUrl || video?.video || video?.src
    if (!src) return ''
    if (src === 'uploads/image.jpg') return `http://localhost:5000/uploads/image.jpg`
    if (src.startsWith('uploads/')) return `http://localhost:5000/${src}`
    if (/^https?:\/\//i.test(src)) return src
    return src
  }, [video])

  const thumbSrc = useMemo(() => {
    const thumb = video?.thumbnail || video?.thumbnailUrl || ''
    if (!thumb) return ''
    if (thumb.startsWith('uploads/')) return `http://localhost:5000/${thumb}`
    if (/^https?:\/\//i.test(thumb)) return thumb
    return thumb
  }, [video])

  useEffect(() => {
    let active = true

    const fetchVideo = async () => {
      try {
        setLoadingVideo(true)
        setError('')
        const res = await api.get(`/api/videos/${id}`)
        if (!active) return
        setVideo(res?.data)
      } catch (e) {
        if (!active) return
        setError(e?.response?.data?.message || e?.message || 'Failed to fetch video')
      } finally {
        if (active) setLoadingVideo(false)
      }
    }

    const fetchComments = async () => {
      try {
        setCommentsBusy(true)
        const res = await api.get(`/api/comments/video/${id}`)
        if (!active) return
        setComments(res?.data || [])
      } catch {
        // keep UI working even if comments fail
      } finally {
        if (active) setCommentsBusy(false)
      }
    }

    fetchVideo()
    fetchComments()

    return () => {
      active = false
    }
  }, [id, user])

  const onLike = async (type) => {
    setLikesBusy(true)
    try {
      if (type === 'like') await api.put(`/api/videos/like/${id}`)
      else await api.put(`/api/videos/dislike/${id}`)
      const res = await api.get(`/api/videos/${id}`)
      setVideo(res?.data)
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || 'Failed to update reaction')
    } finally {
      setLikesBusy(false)
    }
  }

  const onAddComment = async (e) => {
    e.preventDefault()
    const text = commentText.trim()
    if (!text) return

    try {
      setError('')
      const payload = { videoId: id, text }
      const res = await api.post('/api/comments', payload)
      const created = res?.data
      setComments((prev) => [created, ...prev])
      setCommentText('')
    } catch (e2) {
      setError(e2?.response?.data?.message || e2?.message || 'Failed to add comment')
    }
  }

  const onDeleteComment = async (commentId) => {
    try {
      await api.delete(`/api/comments/${commentId}`)
      setComments((prev) => prev.filter((c) => (c._id || c.id) !== commentId))
    } catch (e2) {
      setError(e2?.response?.data?.message || e2?.message || 'Failed to delete comment')
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      {loadingVideo && <Loader text="Loading video..." />}
      {!loadingVideo && error && (
        <div className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</div>
      )}

      {!loadingVideo && video && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]">
          <section>
            <div className="overflow-hidden rounded-lg border bg-white">
              {videoSrc ? (
                <video src={videoSrc} controls className="h-auto w-full bg-black" />
              ) : (
                <div className="flex items-center justify-center p-6 text-sm text-gray-500">No video source</div>
              )}
            </div>

            <div className="mt-4">
              <h1 className="text-xl font-bold">{video?.title}</h1>
              <p className="mt-2 text-sm text-gray-700">{video?.description}</p>

              <div className="mt-4 flex items-center gap-3">
                <button
                  type="button"
                  disabled={likesBusy}
                  onClick={() => onLike('like')}
                  className="rounded bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-60"
                >
                  👍 Like
                </button>
                <button
                  type="button"
                  disabled={likesBusy}
                  onClick={() => onLike('dislike')}
                  className="rounded border px-4 py-2 text-sm font-semibold hover:bg-gray-50 disabled:opacity-60"
                >
                  👎 Dislike
                </button>
              </div>
            </div>
          </section>

          <aside className="rounded-lg border bg-white p-4">
            <div className="mb-3 flex items-center gap-3">
              {thumbSrc ? (
                <img src={thumbSrc} alt="thumbnail" className="h-16 w-24 rounded object-cover" />
              ) : (
                <div className="h-16 w-24 rounded bg-gray-100" />
              )}
              <div>
                <div className="text-sm font-semibold">{video?.channel?.name || video?.channelName || 'Channel'}</div>
                <div className="text-xs text-gray-500">{video?._id ? 'Video' : ''}</div>
              </div>
            </div>

            <div className="border-t pt-4">
              <h2 className="text-sm font-semibold">Comments</h2>

              {commentsBusy && <Loader text="Loading comments..." />}

              {!commentsBusy && (
                <div className="mt-3 space-y-3 max-h-[420px] overflow-auto pr-1">
                  {comments.length === 0 && <div className="text-sm text-gray-500">No comments yet.</div>}
                  {comments.map((c) => (
                    <Comment key={c._id || c.id} comment={c} onDelete={onDeleteComment} />
                  ))}
                </div>
              )}

              <form onSubmit={onAddComment} className="mt-4 space-y-2">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="min-h-[90px] w-full rounded border p-2 text-sm outline-none focus:border-red-500"
                  placeholder={user ? 'Add a comment...' : 'Login to comment...'}
                  disabled={!user}
                />
                <button
                  type="submit"
                  disabled={!user || !commentText.trim()}
                  className="w-full rounded bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
                >
                  Post Comment
                </button>
              </form>
            </div>
          </aside>
        </div>
      )}
    </main>
  )
}

