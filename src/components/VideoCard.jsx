import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'

function formatViews(views) {
  const n = Number(views)
  if (!Number.isFinite(n)) return ''
  if (n < 1000) return `${n} views`
  if (n < 1_000_000) return `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}K views`
  if (n < 1_000_000_000)
    return `${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}M views`
  return `${(n / 1_000_000_000).toFixed(n % 1_000_000_000 === 0 ? 0 : 1)}B views`
}

export default function VideoCard({ video }) {
  const thumbnailUrl = useMemo(() => {
    const thumb = video?.thumbnailUrl || ''
    if (!thumb) return null
    if (thumb === 'uploads/image.jpg' || thumb.startsWith('uploads/')) {
      return `http://localhost:5000/${thumb}`
    }
    // If backend already returns full URL
    if (/^https?:\/\//i.test(thumb)) return thumb
    return thumb
  }, [video])

  const views = video?.views ?? video?.viewsCount ?? video?.viewCount ?? ''
  const viewsLabel = formatViews(views)

  return (
    <Link to={`/video/${video?._id || video?.id}`} className="group">

      <div className="overflow-hidden rounded-lg bg-gray-100">
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={video?.title || 'Video'}
            className="h-44 w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-44 items-center justify-center text-sm text-gray-500">No thumbnail</div>
        )}
      </div>

      <div className="mt-2">
        <div className="line-clamp-2 text-sm font-medium text-gray-900">{video?.title}</div>
        <div className="mt-1 line-clamp-1 text-xs text-gray-600">{video?.channel?.name || video?.channelName || 'Channel'}</div>
        <div className="mt-1 text-xs text-gray-500">{viewsLabel}</div>
      </div>
    </Link>
  )
}

