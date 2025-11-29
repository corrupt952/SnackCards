import { getDomain, getFavicon, getTimeAgo } from "@/utils/formatUtils";

interface ReadingListItem {
  title: string;
  url: string;
  hasBeenRead: boolean;
  creationTime?: number;
}

interface ArticleItemProps {
  item: ReadingListItem;
  onClick: () => void;
  onMarkAsRead: () => void;
  onMarkAsUnread: () => void;
  onRemove: () => void;
}

export default function ArticleItem({ item, onClick, onMarkAsRead, onMarkAsUnread, onRemove }: ArticleItemProps) {
  return (
    <li
      className={`relative transition-colors rounded-lg overflow-hidden ${
        item.hasBeenRead ? "bg-stone-50 dark:bg-stone-900/50" : "bg-white dark:bg-stone-800 shadow-sm"
      }`}
    >
      <div className="flex items-center gap-3 px-3 py-2.5">
        {/* Favicon - Click to open */}
        <button
          onClick={onClick}
          className="w-10 h-10 rounded-lg bg-stone-100 dark:bg-stone-700 flex items-center justify-center flex-shrink-0 hover:scale-105 transition-transform"
        >
          <img
            src={getFavicon(item.url)}
            alt=""
            className="w-6 h-6 rounded"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2394a3b8'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z'/%3E%3C/svg%3E";
            }}
          />
        </button>

        {/* Content - Click to open */}
        <button onClick={onClick} className="flex-1 min-w-0 text-left">
          <h3
            className={`text-sm font-medium leading-snug line-clamp-2 ${
              item.hasBeenRead ? "text-stone-400 dark:text-stone-500" : "text-stone-900 dark:text-white"
            }`}
          >
            {item.title}
          </h3>
          <div className="flex items-center gap-1.5 mt-0.5 text-xs text-stone-400 dark:text-stone-500">
            <span className="truncate">{getDomain(item.url)}</span>
            <span>·</span>
            <span>{getTimeAgo(item.creationTime)}</span>
          </div>
        </button>

        {/* Actions - Always visible */}
        <div className="flex items-center gap-0.5 flex-shrink-0">
          {!item.hasBeenRead ? (
            <button
              onClick={onMarkAsRead}
              className="p-1.5 rounded-md text-stone-300 dark:text-stone-600 hover:text-green-500 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30 transition-colors"
              title="Mark as read"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </button>
          ) : (
            <button
              onClick={onMarkAsUnread}
              className="p-1.5 rounded-md text-stone-300 dark:text-stone-600 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
              title="Mark as unread"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </button>
          )}
          <button
            onClick={onRemove}
            className="p-1.5 rounded-md text-stone-300 dark:text-stone-600 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
            title="Remove"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </li>
  );
}
