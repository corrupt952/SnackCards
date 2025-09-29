import React from 'react'

type FilterType = 'all' | 'unread' | 'read'

interface FilterTabsProps {
  filter: FilterType
  onFilterChange: (filter: FilterType) => void
  totalItems: number
  unreadItems: number
  readItems: number
}

export default function FilterTabs({
  filter,
  onFilterChange,
  totalItems,
  unreadItems,
  readItems
}: FilterTabsProps) {
  const tabs = [
    { key: 'unread' as FilterType, label: 'Unread', count: unreadItems },
    { key: 'all' as FilterType, label: 'All', count: totalItems },
    { key: 'read' as FilterType, label: 'Read', count: readItems }
  ]

  return (
    <div className="bg-white border-b border-slate-200">
      <div className="px-8">
        <nav className="flex space-x-12">
          {tabs.map(({ key, label, count }) => (
            <button
              key={key}
              onClick={() => onFilterChange(key)}
              className={`py-4 px-2 border-b-2 font-semibold text-base transition-colors duration-200 ${
                filter === key
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              {label}
              <span className="ml-2 px-2 py-1 text-xs font-medium bg-slate-100 text-slate-600 rounded-full">
                {count}
              </span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  )
}