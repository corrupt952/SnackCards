import React from "react";
import VideoEmbed from "./VideoEmbed";
import { detectVideoService, isVideoUrl } from "../utils/videoUtils";

interface ReadingListItem {
  title: string;
  url: string;
  hasBeenRead: boolean;
  creationTime?: number;
}

interface ReadingListItemProps {
  item: ReadingListItem;
  onMarkAsRead: (url: string, e: React.MouseEvent) => Promise<void>;
  onMarkAsUnread: (url: string, e: React.MouseEvent) => Promise<void>;
  onRemove: (url: string, e: React.MouseEvent) => Promise<void>;
  onClick: (url: string) => void;
}

export default function ReadingListItemComponent({
  item,
  onMarkAsRead,
  onMarkAsUnread,
  onRemove,
  onClick,
}: ReadingListItemProps) {
  const getDomain = (url: string) => {
    try {
      return new URL(url).hostname.replace("www.", "");
    } catch {
      return url;
    }
  };

  const getFavicon = (url: string) => {
    const domain = getDomain(url);
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=16`;
  };

  const getTimeAgo = (timestamp?: number) => {
    if (!timestamp) return "";
    const now = Date.now();
    const diff = now - timestamp;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return "recently";
  };

  const isVideo = isVideoUrl(item.url);
  const videoInfo = isVideo ? detectVideoService(item.url) : null;

  const handleCardClick = () => {
    if (!isVideo) {
      onClick(item.url);
    }
  };

  return (
    <article
      className={`bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${
        item.hasBeenRead ? "opacity-60" : ""
      } ${isVideo ? "" : "cursor-pointer group"}`}
      onClick={handleCardClick}
    >
      <div className="flex items-start space-x-4">
        {/* Favicon */}
        {!isVideo && (
          <div className="flex-shrink-0 mt-1">
            <div className="w-10 h-10 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center shadow-sm">
              <img
                src={getFavicon(item.url)}
                alt=""
                className="w-6 h-6"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0 pr-4">
              <h3
                className={`text-lg font-semibold leading-6 transition-colors duration-200 ${
                  item.hasBeenRead
                    ? "text-slate-500 dark:text-slate-500 line-through"
                    : "text-slate-900 dark:text-white"
                } ${!isVideo ? "group-hover:text-blue-600 dark:group-hover:text-blue-400" : ""}`}
              >
                {item.title}
              </h3>
              <div className="mt-3 flex items-center space-x-3 text-sm">
                <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                  {getDomain(item.url)}
                </span>
                <span className="text-slate-500 dark:text-slate-400">{getTimeAgo(item.creationTime)}</span>
                {item.hasBeenRead && (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300">
                    ✓ Read
                  </span>
                )}
                {isVideo && (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300">
                    🎥 Video
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div
              className={`flex items-center space-x-2 transition-opacity duration-200 ${isVideo ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
            >
              {!item.hasBeenRead ? (
                <button
                  onClick={(e) => onMarkAsRead(item.url, e)}
                  className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-900/50 border border-green-200 dark:border-green-700 rounded-lg hover:bg-green-100 dark:hover:bg-green-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200"
                  title="Mark as read"
                >
                  Mark read
                </button>
              ) : (
                <button
                  onClick={(e) => onMarkAsUnread(item.url, e)}
                  className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/50 border border-blue-200 dark:border-blue-700 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                  title="Mark as unread"
                >
                  Mark unread
                </button>
              )}
              <button
                onClick={(e) => onRemove(item.url, e)}
                className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-700 rounded-lg hover:bg-red-100 dark:hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200"
                title="Remove"
              >
                Remove
              </button>
            </div>
          </div>

          {/* Video Embed */}
          {isVideo && videoInfo && (
            <div className="mt-4">
              <VideoEmbed videoInfo={videoInfo} title={item.title} />
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
