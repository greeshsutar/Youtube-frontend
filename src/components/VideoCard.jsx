import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'

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
      </div>
    </Link>
  )
}

