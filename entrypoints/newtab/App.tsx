import React, { useState, useEffect } from 'react'

interface ReadingListItem {
  title: string
  url: string
  hasBeenRead: boolean
  creationTime?: number
}

export default function App() {
  const [items, setItems] = useState<ReadingListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('unread')

  useEffect(() => {
    loadReadingList()
  }, [])

  const loadReadingList = async () => {
    try {
      setLoading(true)
      setError(null)
      const readingListItems = await chrome.readingList.query({})
      const sortedItems = readingListItems.sort((a, b) =>
        (b.creationTime || 0) - (a.creationTime || 0)
      )
      setItems(sortedItems)
    } catch (err) {
      console.error('Failed to load reading list:', err)
      setError('Failed to load reading list: ' + (err as Error).message)
    } finally {
      setLoading(false)
    }
  }

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

  const markAsRead = async (url: string, e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      await chrome.readingList.updateEntry({ url, hasBeenRead: true })
      setItems(prev => prev.map(item =>
        item.url === url ? { ...item, hasBeenRead: true } : item
      ))
    } catch (error) {
      console.error('Failed to mark as read:', error)
    }
  }

  const markAsUnread = async (url: string, e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      await chrome.readingList.updateEntry({ url, hasBeenRead: false })
      setItems(prev => prev.map(item =>
        item.url === url ? { ...item, hasBeenRead: false } : item
      ))
    } catch (error) {
      console.error('Failed to mark as unread:', error)
    }
  }

  const removeItem = async (url: string, e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      await chrome.readingList.removeEntry({ url })
      setItems(prev => prev.filter(item => item.url !== url))
    } catch (error) {
      console.error('Failed to remove item:', error)
    }
  }

  const filteredItems = items.filter(item => {
    if (filter === 'unread') return !item.hasBeenRead
    if (filter === 'read') return item.hasBeenRead
    return true
  })

  const unreadCount = items.filter(item => !item.hasBeenRead).length

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading reading list...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center max-w-md">
          <div className="text-red-600 text-lg font-medium mb-4">Failed to load reading list</div>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={loadReadingList}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 font-medium"
          >
            Try again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white border-b border-slate-200 px-8 py-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Reading List</h1>
            <p className="mt-1 text-slate-600 text-lg">Your curated articles and saved reads</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white border-b border-slate-200">
          <div className="px-8">
            <nav className="flex space-x-12">
              {[
                { key: 'unread', label: 'Unread', count: unreadCount },
                { key: 'all', label: 'All', count: items.length },
                { key: 'read', label: 'Read', count: items.length - unreadCount }
              ].map(({ key, label, count }) => (
                <button
                  key={key}
                  onClick={() => setFilter(key as typeof filter)}
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

        {/* Reading List */}
        <div className="bg-white">
          {filteredItems.length === 0 ? (
            <div className="text-center py-20 px-8">
              <div className="text-slate-300 text-6xl mb-6">📚</div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">
                {filter === 'read'
                  ? 'No read articles'
                  : filter === 'unread'
                  ? 'No unread articles'
                  : 'No articles yet'
                }
              </h3>
              <p className="text-slate-500 text-lg max-w-md mx-auto leading-relaxed">
                {filter === 'all'
                  ? 'Add articles to Chrome\'s reading list to see them here. Click the bookmark icon or use Cmd+D on articles you want to read later.'
                  : `You have no ${filter} articles at the moment.`
                }
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredItems.map((item) => (
                <article
                  key={item.url}
                  className="px-8 py-6 hover:bg-slate-50 cursor-pointer group transition-colors duration-150"
                  onClick={() => {
                    window.open(item.url, '_blank')
                    if (!item.hasBeenRead) {
                      markAsRead(item.url, new MouseEvent('click'))
                    }
                  }}
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
                              onClick={(e) => markAsRead(item.url, e)}
                              className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-green-700 bg-green-50 border border-green-200 rounded-md hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200"
                              title="Mark as read"
                            >
                              Mark read
                            </button>
                          ) : (
                            <button
                              onClick={(e) => markAsUnread(item.url, e)}
                              className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                              title="Mark as unread"
                            >
                              Mark unread
                            </button>
                          )}
                          <button
                            onClick={(e) => removeItem(item.url, e)}
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
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}