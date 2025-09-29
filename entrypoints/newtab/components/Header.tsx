import React from 'react'

interface HeaderProps {
  totalItems: number
  readItems: number
  unreadItems: number
}

export default function Header({ totalItems, readItems, unreadItems }: HeaderProps) {
  const progressPercentage = totalItems > 0 ? Math.round((readItems / totalItems) * 100) : 0

  return (
    <div className="bg-white border-b border-slate-200 px-8 py-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Reading List</h1>
          <p className="mt-1 text-slate-600 text-lg">Your curated articles and saved reads</p>
        </div>

        <div className="text-right">
          <div className="text-sm font-medium text-slate-900 mb-1">
            Progress: {progressPercentage}%
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-32 bg-slate-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <span className="text-xs text-slate-500">
              {readItems}/{totalItems}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}