import { useState, useEffect } from "react";
import { isVideoUrl } from "@/utils/videoUtils";
import ArticleItem from "./components/ArticleItem";
import VideoItem from "./components/VideoItem";

type FilterType = "all" | "unread" | "read";

interface ReadingListItem {
  title: string;
  url: string;
  hasBeenRead: boolean;
  creationTime?: number;
}

export default function App() {
  const [items, setItems] = useState<ReadingListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterType>("unread");

  useEffect(() => {
    loadReadingList();
  }, []);

  const loadReadingList = async () => {
    try {
      setLoading(true);
      setError(null);
      const readingListItems = await chrome.readingList.query({});
      const sortedItems = readingListItems.sort((a, b) => (b.creationTime || 0) - (a.creationTime || 0));
      setItems(sortedItems);
    } catch (err) {
      console.error("Failed to load reading list:", err);
      setError("Failed to load reading list");
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (url: string) => {
    try {
      await chrome.readingList.updateEntry({ url, hasBeenRead: true });
      setItems((prev) => prev.map((item) => (item.url === url ? { ...item, hasBeenRead: true } : item)));
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  const markAsUnread = async (url: string) => {
    try {
      await chrome.readingList.updateEntry({ url, hasBeenRead: false });
      setItems((prev) => prev.map((item) => (item.url === url ? { ...item, hasBeenRead: false } : item)));
    } catch (error) {
      console.error("Failed to mark as unread:", error);
    }
  };

  const removeItem = async (url: string) => {
    try {
      await chrome.readingList.removeEntry({ url });
      setItems((prev) => prev.filter((item) => item.url !== url));
    } catch (error) {
      console.error("Failed to remove item:", error);
    }
  };

  const openInCurrentTab = async (url: string) => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab?.id) {
      chrome.tabs.update(tab.id, { url });
    }
  };

  const handleArticleClick = (url: string) => {
    openInCurrentTab(url);
    const item = items.find((item) => item.url === url);
    if (item && !item.hasBeenRead) {
      markAsRead(url);
    }
  };

  const handleVideoOpen = (url: string) => {
    openInCurrentTab(url);
    const item = items.find((item) => item.url === url);
    if (item && !item.hasBeenRead) {
      markAsRead(url);
    }
  };

  const filteredItems = items.filter((item) => {
    if (filter === "unread") return !item.hasBeenRead;
    if (filter === "read") return item.hasBeenRead;
    return true;
  });

  const unreadCount = items.filter((item) => !item.hasBeenRead).length;
  const readCount = items.filter((item) => item.hasBeenRead).length;

  const filters: { key: FilterType; label: string; count: number }[] = [
    { key: "unread", label: "Unread", count: unreadCount },
    { key: "all", label: "All", count: items.length },
    { key: "read", label: "Read", count: readCount },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50 dark:bg-slate-900">
        <div className="w-6 h-6 border-2 border-slate-300 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-slate-50 dark:bg-slate-900 p-4">
        <p className="text-red-500 text-sm mb-3">{error}</p>
        <button
          onClick={loadReadingList}
          className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-3 py-2 shadow-sm">
        <div className="flex items-center justify-between">
          <h1 className="text-base font-bold text-slate-900 dark:text-white">Snack Cards</h1>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>

        {/* Filter Tabs */}
        <nav className="flex gap-1 mt-2">
          {filters.map(({ key, label, count }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`flex-1 px-2 py-1.5 text-xs font-medium rounded-md transition-colors ${
                filter === key
                  ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900"
                  : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              {label} ({count})
            </button>
          ))}
        </nav>
      </header>

      {/* List */}
      <main className="flex-1 overflow-y-auto p-2">
        {filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-slate-400 dark:text-slate-500">
            <p className="text-sm">
              {filter === "unread" ? "All caught up!" : filter === "read" ? "No read items" : "No items yet"}
            </p>
          </div>
        ) : (
          <ul className="flex flex-col gap-1">
            {filteredItems.map((item) =>
              isVideoUrl(item.url) ? (
                <VideoItem
                  key={item.url}
                  item={item}
                  onOpen={() => handleVideoOpen(item.url)}
                  onMarkAsRead={() => markAsRead(item.url)}
                  onMarkAsUnread={() => markAsUnread(item.url)}
                  onRemove={() => removeItem(item.url)}
                />
              ) : (
                <ArticleItem
                  key={item.url}
                  item={item}
                  onClick={() => handleArticleClick(item.url)}
                  onMarkAsRead={() => markAsRead(item.url)}
                  onMarkAsUnread={() => markAsUnread(item.url)}
                  onRemove={() => removeItem(item.url)}
                />
              ),
            )}
          </ul>
        )}
      </main>
    </div>
  );
}
