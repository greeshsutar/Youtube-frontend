import React, { useMemo } from 'react'
import { NavLink } from 'react-router-dom'

export default function Sidebar({ open, onClose }) {
  const items = useMemo(
    () => [
      { to: '/', label: 'Home' },
      { to: '/subscriptions', label: 'Subscriptions' },
      { to: '/library', label: 'Library' },
    ],
    [],
  )

  return (
    <div className="relative">
      {/* Overlay */}
      {open && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
        />
      )}

      <aside
        className={
          'fixed left-0 top-0 z-50 h-full w-64 transform bg-white shadow-lg transition-transform duration-200 lg:static lg:translate-x-0 lg:shadow-none ' +
          (open ? 'translate-x-0' : '-translate-x-full')
        }
      >
        <div className="flex h-14 items-center justify-between border-b px-4">
          <div className="text-sm font-semibold text-gray-800">Browse</div>
          <button
            type="button"
            className="lg:hidden rounded px-2 py-1 text-sm text-gray-700 hover:bg-gray-100"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <nav className="p-2">
          {items.map((it) => (
            <NavLink
              key={it.to}
              to={it.to}
              onClick={onClose}
              className={({ isActive }) =>
                'flex items-center rounded px-3 py-2 text-sm font-medium ' +
                (isActive ? 'bg-red-50 text-red-700' : 'text-gray-700 hover:bg-gray-50')
              }
            >
              {it.label}
            </NavLink>
          ))}

          {/* placeholders - backend not implemented */}
          <div className="mt-3 px-3 text-xs font-medium text-gray-400">(Subscriptions/Library UI only)</div>
        </nav>
      </aside>
    </div>
  )
}

