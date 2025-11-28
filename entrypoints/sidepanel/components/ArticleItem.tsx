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
  const getDomain = (url: string) => {
    try {
      return new URL(url).hostname.replace("www.", "");
    } catch {
      return url;
    }
  };

  const getFavicon = (url: string) => {
    const domain = getDomain(url);
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
  };

  const getTimeAgo = (timestamp?: number) => {
    if (!timestamp) return "";
    const now = Date.now();
    const diff = now - timestamp;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (days > 0) return `${days}d`;
    if (hours > 0) return `${hours}h`;
    return "now";
  };

  return (
    <li
      className={`group relative hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
        item.hasBeenRead ? "opacity-60" : ""
      }`}
    >
      <button onClick={onClick} className="w-full text-left px-3 py-3 flex items-start gap-3">
        {/* Favicon */}
        <img
          src={getFavicon(item.url)}
          alt=""
          className="w-5 h-5 mt-0.5 rounded flex-shrink-0"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3
            className={`text-sm font-medium leading-snug line-clamp-2 ${
              item.hasBeenRead ? "text-slate-500 dark:text-slate-500 line-through" : "text-slate-900 dark:text-white"
            }`}
          >
            {item.title}
          </h3>
          <div className="flex items-center gap-2 mt-1 text-xs text-slate-500 dark:text-slate-400">
            <span className="truncate">{getDomain(item.url)}</span>
            <span>·</span>
            <span>{getTimeAgo(item.creationTime)}</span>
          </div>
        </div>
      </button>

      {/* Actions - visible on hover */}
      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {!item.hasBeenRead ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMarkAsRead();
            }}
            className="p-1.5 rounded-md bg-slate-200 dark:bg-slate-700 hover:bg-green-100 dark:hover:bg-green-900 text-slate-600 dark:text-slate-300 hover:text-green-600 dark:hover:text-green-400"
            title="Mark as read"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </button>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMarkAsUnread();
            }}
            className="p-1.5 rounded-md bg-slate-200 dark:bg-slate-700 hover:bg-blue-100 dark:hover:bg-blue-900 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400"
            title="Mark as unread"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </button>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="p-1.5 rounded-md bg-slate-200 dark:bg-slate-700 hover:bg-red-100 dark:hover:bg-red-900 text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400"
          title="Remove"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </li>
  );
}
