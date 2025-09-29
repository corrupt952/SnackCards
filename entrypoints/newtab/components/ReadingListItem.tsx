import React from 'react'

interface ReadingListItem {
  title: string
  url: string
  hasBeenRead: boolean
  creationTime?: number
}

interface ReadingListItemProps {
  item: ReadingListItem
  onMarkAsRead: (url: string, e: React.MouseEvent) => Promise<void>
  onMarkAsUnread: (url: string, e: React.MouseEvent) => Promise<void>
  onRemove: (url: string, e: React.MouseEvent) => Promise<void>
  onClick: (url: string) => void
}

export default function ReadingListItemComponent({
  item,
  onMarkAsRead,
  onMarkAsUnread,
  onRemove,
  onClick
}: ReadingListItemProps) {
  const getDomain = (url: string) => {
    try {
      return new URL(url).hostname.replace('www.', '')
    } catch {
      return url
    }
  }

  const getFavicon = (url: string) => {
    const domain = getDomain(url)
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=16`
  }

  const getTimeAgo = (timestamp?: number) => {
    if (!timestamp) return ''
    const now = Date.now()
    const diff = now - timestamp
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor(diff / (1000 * 60 * 60))

    if (days > 0) return `${days}d ago`
    if (hours > 0) return `${hours}h ago`
    return 'recently'
  }

  return (
    <article
      className="px-8 py-6 hover:bg-slate-50 cursor-pointer group transition-colors duration-150"
      onClick={() => onClick(item.url)}
    >
      <div className="flex items-start space-x-4">
        {/* Favicon */}
        <div className="flex-shrink-0 mt-2">
          <div className="w-6 h-6 bg-slate-100 rounded flex items-center justify-center">
            <img
              src={getFavicon(item.url)}
              alt=""
              className="w-4 h-4"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none'
              }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0 pr-4">
              <h3 className={`text-xl font-semibold leading-7 group-hover:text-blue-600 transition-colors duration-200 ${
                item.hasBeenRead ? 'text-slate-500 line-through' : 'text-slate-900'
              }`}>
                {item.title}
              </h3>
              <div className="mt-2 flex items-center space-x-3 text-sm">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                  {getDomain(item.url)}
                </span>
                <span className="text-slate-500">
                  {getTimeAgo(item.creationTime)}
                </span>
                {item.hasBeenRead && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                    ✓ Read
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              {!item.hasBeenRead ? (
                <button
                  onClick={(e) => onMarkAsRead(item.url, e)}
                  className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-green-700 bg-green-50 border border-green-200 rounded-md hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200"
                  title="Mark as read"
                >
                  Mark read
                </button>
              ) : (
                <button
                  onClick={(e) => onMarkAsUnread(item.url, e)}
                  className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                  title="Mark as unread"
                >
                  Mark unread
                </button>
              )}
              <button
                onClick={(e) => onRemove(item.url, e)}
                className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200"
                title="Remove"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}