import React from 'react'

export default function Comment({ comment, onDelete, deleting = false }) {
  return (
    <div className="flex gap-3 rounded-lg border bg-white p-3">
      <div className="flex-1">
        <div className="text-sm font-semibold">{comment?.username || comment?.user?.username || 'User'}</div>
        <div className="mt-1 text-sm text-gray-700 whitespace-pre-wrap">{comment?.text || comment?.comment || comment?.content}</div>
      </div>
      <button
        type="button"
        disabled={deleting}
        onClick={() => onDelete?.(comment?._id || comment?.id)}
        className="h-fit rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700 disabled:opacity-60"
      >
        Delete
      </button>
    </div>
  )
}

