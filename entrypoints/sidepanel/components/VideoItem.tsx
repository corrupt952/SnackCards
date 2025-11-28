import { detectVideoService, getVideoThumbnail } from "@/utils/videoUtils";

interface ReadingListItem {
  title: string;
  url: string;
  hasBeenRead: boolean;
  creationTime?: number;
}

interface VideoItemProps {
  item: ReadingListItem;
  onOpen: () => void;
  onMarkAsRead: () => void;
  onMarkAsUnread: () => void;
  onRemove: () => void;
}

export default function VideoItem({ item, onOpen, onMarkAsRead, onMarkAsUnread, onRemove }: VideoItemProps) {
  const videoInfo = detectVideoService(item.url);
  const thumbnail = getVideoThumbnail(videoInfo);

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

  const getServiceColor = () => {
    switch (videoInfo.service) {
      case "youtube":
        return "bg-red-600 text-white";
      case "vimeo":
        return "bg-sky-500 text-white";
      case "tiktok":
        return "bg-black text-white";
      default:
        return "bg-slate-600 text-white";
    }
  };

  return (
    <li className={`group relative ${item.hasBeenRead ? "opacity-60" : ""}`}>
      <div className="px-3 py-3">
        {/* Thumbnail - Click to open */}
        <button
          onClick={onOpen}
          className="relative w-full aspect-video bg-slate-200 dark:bg-slate-700 rounded-lg overflow-hidden mb-2 group/thumb"
        >
          {thumbnail ? (
            <img src={thumbnail} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-slate-300 dark:bg-slate-600">
              <span className="text-4xl">🎬</span>
            </div>
          )}
          {/* Play overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover/thumb:bg-black/50 transition-colors">
            <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
              <svg className="w-7 h-7 text-slate-900 ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
          {/* Service badge */}
          <div className="absolute top-2 left-2">
            <span className={`px-2 py-0.5 text-xs font-bold rounded ${getServiceColor()}`}>
              {videoInfo.service?.toUpperCase()}
            </span>
          </div>
          {/* Time badge */}
          <div className="absolute top-2 right-2">
            <span className="px-2 py-0.5 text-xs font-medium rounded bg-black/70 text-white">
              {getTimeAgo(item.creationTime)}
            </span>
          </div>
        </button>

        {/* Title and actions */}
        <div className="flex items-start justify-between gap-2">
          <h3
            className={`flex-1 text-sm font-medium leading-snug line-clamp-2 ${
              item.hasBeenRead ? "text-slate-500 dark:text-slate-500 line-through" : "text-slate-900 dark:text-white"
            }`}
          >
            {item.title}
          </h3>

          {/* Actions */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
            {!item.hasBeenRead ? (
              <button
                onClick={onMarkAsRead}
                className="p-1.5 rounded-md bg-slate-200 dark:bg-slate-700 hover:bg-green-100 dark:hover:bg-green-900 text-slate-600 dark:text-slate-300 hover:text-green-600 dark:hover:text-green-400"
                title="Mark as read"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </button>
            ) : (
              <button
                onClick={onMarkAsUnread}
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
              onClick={onRemove}
              className="p-1.5 rounded-md bg-slate-200 dark:bg-slate-700 hover:bg-red-100 dark:hover:bg-red-900 text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400"
              title="Remove"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </li>
  );
}
