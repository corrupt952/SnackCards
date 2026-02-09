import { detectVideoService, getVideoThumbnail } from "@/utils/videoUtils";
import { getTimeAgo } from "@/utils/formatUtils";

interface ReadingListItem {
  title: string;
  url: string;
  hasBeenRead: boolean;
  creationTime?: number;
}

interface VideoItemProps {
  item: ReadingListItem;
  onOpen: () => void;
  onRemove: () => void;
}

export default function VideoItem({ item, onOpen, onRemove }: VideoItemProps) {
  const videoInfo = detectVideoService(item.url);
  const thumbnail = getVideoThumbnail(videoInfo);

  const getServiceLabel = () => {
    switch (videoInfo.service) {
      case "youtube":
        return "YouTube";
      case "vimeo":
        return "Vimeo";
      case "tiktok":
        return "TikTok";
      default:
        return "Video";
    }
  };

  return (
    <li
      className={`relative transition-colors rounded-lg overflow-hidden ${
        item.hasBeenRead ? "bg-white dark:bg-stone-800/80" : "bg-white dark:bg-stone-800 shadow-sm"
      }`}
    >
      <div className="flex items-center gap-3 px-3 py-2.5">
        {/* Thumbnail - Click to open */}
        <button
          onClick={onOpen}
          className="relative w-16 h-10 rounded-lg overflow-hidden flex-shrink-0 hover:scale-105 transition-transform bg-stone-200 dark:bg-stone-700"
        >
          {thumbnail ? (
            <img src={thumbnail} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg className="w-5 h-5 text-stone-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          )}
          {/* Play icon overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <div className="w-6 h-6 rounded-full bg-white/90 flex items-center justify-center">
              <svg className="w-3 h-3 text-stone-900 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </button>

        {/* Content - Click to open */}
        <button onClick={onOpen} className="flex-1 min-w-0 text-left">
          <h3
            className={`text-sm font-medium leading-snug line-clamp-2 ${
              item.hasBeenRead ? "text-stone-500 dark:text-stone-400" : "text-stone-900 dark:text-white"
            }`}
          >
            {item.title}
          </h3>
          <div className="flex items-center gap-1.5 mt-0.5 text-xs text-stone-400 dark:text-stone-500">
            <span>{getServiceLabel()}</span>
            <span>·</span>
            <span>{getTimeAgo(item.creationTime)}</span>
          </div>
        </button>

        {/* Actions */}
        <div className="flex items-center flex-shrink-0">
          <button
            onClick={onRemove}
            className="p-1.5 rounded-md text-stone-300 dark:text-stone-600 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
            title="Remove from list"
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
