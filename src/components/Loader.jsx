import React from 'react'

export default function Loader({ text = 'Loading...' }) {
  return (
    <div className="flex items-center justify-center py-10">
      <div className="text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-red-600" />
        <div className="mt-3 text-sm text-gray-600">{text}</div>
      </div>
    </div>
  )
}

