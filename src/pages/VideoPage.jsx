import React, { useContext, useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../api/axios'
import Loader from '../components/Loader'
import Comment from '../components/Comment'
import { AuthContext } from '../context/AuthContext'

function toAbsoluteMediaUrl(src) {
  if (!src) return ''
  if (src.startsWith('uploads/')) return `http://localhost:5000/${src}`
  if (src.startsWith('/uploads/')) return `http://localhost:5000${src}`
  if (/^https?:\/\//i.test(src)) return src
  if (src === 'uploads/image.jpg') return 'http://localhost:5000/uploads/image.jpg'
  return src
}

function youtubeEmbedUrl(url) {
  // Supports: youtu.be/<id>, youtube.com/watch?v=<id>, youtube.com/embed/<id>
  if (!url) return ''
  const u = String(url)
  const ytMatch = u.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/))([A-Za-z0-9_-]{6,})/,
  )
  const id = ytMatch?.[1]
  if (!id) return ''
  return `https://www.youtube.com/embed/${id}`
}

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

  const embedSrc = useMemo(() => youtubeEmbedUrl(video?.videoUrl || video?.video || ''), [video])

  const videoSrc = useMemo(() => {
    const src = video?.videoUrl || video?.video || ''
    if (!src) return ''
    if (youtubeEmbedUrl(src)) return ''
    return toAbsoluteMediaUrl(src)
  }, [video])

  const thumbSrc = useMemo(() => toAbsoluteMediaUrl(video?.thumbnailUrl || video?.thumbnail || ''), [video])

  const fetchVideoAndComments = async () => {
    const [videoRes, commentsRes] = await Promise.all([
      api.get(`/api/videos/${id}`),
      api.get(`/api/comments/video/${id}`),
    ])

    // video controller returns { success, data: { ... } } from backend; current frontend previously used res?.data
    const nextVideo = videoRes?.data?.data || videoRes?.data
    const nextComments = commentsRes?.data?.data || commentsRes?.data || []

    setVideo(nextVideo)
    setComments(nextComments)
  }

  useEffect(() => {
    let active = true

    const run = async () => {
      try {
        setLoadingVideo(true)
        setError('')
        if (!active) return

        await fetchVideoAndComments()
      } catch (e) {
        if (!active) return
        setError(e?.response?.data?.message || e?.message || 'Failed to fetch video')
      } finally {
        if (active) setLoadingVideo(false)
      }
    }

    run()
    return () => {
      active = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const onReact = async (value) => {
    setLikesBusy(true)
    setError('')
    try {
      // Backend exposes POST /api/likes/like and POST /api/likes/dislike
      const nextEndpoint = value === 'like' ? '/api/likes/like' : '/api/likes/dislike'
      await api.post(nextEndpoint, { videoId: id })
      await fetchVideoAndComments()
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || 'Failed to update reaction')
    } finally {
      setLikesBusy(false)
    }
  }

  // keep commentsBusy for UX; fetch is done together with video

  const onAddComment = async (e) => {
    e.preventDefault()
    const text = commentText.trim()
    if (!text) return

    try {
      setError('')
      const res = await api.post('/api/comments', { videoId: id, content: text })
      const created = res?.data?.data || res?.data
      setComments((prev) => [created, ...prev])
      setCommentText('')
    } catch (e2) {
      setError(e2?.response?.data?.message || e2?.message || 'Failed to add comment')
    }
  }

  const onDeleteComment = async (commentId) => {
    try {
      await api.delete(`/api/comments/${commentId}`)
      setComments((prev) => prev.filter((c) => String(c?._id || c?.id) !== String(commentId)))
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
              {embedSrc ? (
                <iframe
                  src={embedSrc}
                  title="YouTube player"
                  className="h-[360px] w-full lg:h-[480px]"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : videoSrc ? (
                <video src={videoSrc} controls className="h-auto w-full bg-black" />
              ) : (
                <div className="flex items-center justify-center p-6 text-sm text-gray-500">No video source</div>
              )}
            </div>

            <div className="mt-4">
              <h1 className="text-xl font-bold">{video?.title}</h1>
              <p className="mt-2 text-sm text-gray-700 whitespace-pre-wrap">{video?.description}</p>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  disabled={likesBusy}
                  onClick={() => onReact('like')}
                  className="rounded bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-60"
                >
                  👍 Like {typeof video?.likes === 'number' ? `(${video.likes})` : ''}
                </button>
                <button
                  type="button"
                  disabled={likesBusy}
                  onClick={() => onReact('dislike')}
                  className="rounded border px-4 py-2 text-sm font-semibold hover:bg-gray-50 disabled:opacity-60"
                >
                  👎 Dislike {typeof video?.dislikes === 'number' ? `(${video.dislikes})` : ''}
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
                <div className="mt-3 max-h-[420px] space-y-3 overflow-auto pr-1">
                  {comments.length === 0 && <div className="text-sm text-gray-500">No comments yet.</div>}
                  {comments.map((c) => {
                    const commentAuthorId = c?.author?._id || c?.author?.id || c?.author
                    const canDelete = !!user && String(commentAuthorId) === String(user?.id)
                    return (
                      <Comment
                        key={c._id || c.id}
                        comment={c}
                        onDelete={onDeleteComment}
                        canDelete={canDelete}
                        deleting={false}
                      />
                    )
                  })}
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


