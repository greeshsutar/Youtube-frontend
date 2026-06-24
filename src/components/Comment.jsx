import React from 'react'

export default function Comment({ comment, onDelete, canDelete = false, deleting = false }) {
  const username = comment?.username || comment?.user?.username || comment?.author?.username || 'User'
  const text = comment?.text || comment?.comment || comment?.content

  return (
    <div className="flex gap-3 rounded-lg border bg-white p-3">
      <div className="flex-1">
        <div className="text-sm font-semibold">{username}</div>
        <div className="mt-1 whitespace-pre-wrap text-sm text-gray-700">{text}</div>
      </div>

      {canDelete && (
        <button
          type="button"
          disabled={deleting}
          onClick={() => onDelete?.(comment?._id || comment?.id)}
          className="h-fit rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700 disabled:opacity-60"
        >
          Delete
        </button>
      )}
    </div>
  )
}


