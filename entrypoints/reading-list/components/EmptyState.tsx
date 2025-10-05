import React from 'react'

type FilterType = 'all' | 'unread' | 'read'

interface EmptyStateProps {
  filter: FilterType
}

export default function EmptyState({ filter }: EmptyStateProps) {
  const getEmptyStateContent = () => {
    switch (filter) {
      case 'read':
        return {
          title: 'No read articles',
          description: 'You have no read articles at the moment.'
        }
      case 'unread':
        return {
          title: 'No unread articles',
          description: 'You have no unread articles at the moment.'
        }
      default:
        return {
          title: 'No articles yet',
          description: 'Add articles to Chrome\'s reading list to see them here. Click the bookmark icon or use Cmd+D on articles you want to read later.'
        }
    }
  }

  const { title, description } = getEmptyStateContent()

  return (
    <div className="text-center py-20 px-8">
      <div className="text-slate-300 text-6xl mb-6">📚</div>
      <h3 className="text-xl font-semibold text-slate-900 mb-3">
        {title}
      </h3>
      <p className="text-slate-500 text-lg max-w-md mx-auto leading-relaxed">
        {description}
      </p>
    </div>
  )
}