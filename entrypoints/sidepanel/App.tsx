import { useState, useEffect } from "react";
import { isVideoUrl } from "@/utils/videoUtils";
import ArticleItem from "./components/ArticleItem";
import VideoItem from "./components/VideoItem";

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

  const markAsOpened = async (url: string) => {
    try {
      await chrome.readingList.updateEntry({ url, hasBeenRead: true });
      setItems((prev) => prev.map((item) => (item.url === url ? { ...item, hasBeenRead: true } : item)));
    } catch (error) {
      console.error("Failed to mark as opened:", error);
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
      markAsOpened(url);
    }
  };

  const handleVideoOpen = (url: string) => {
    openInCurrentTab(url);
    const item = items.find((item) => item.url === url);
    if (item && !item.hasBeenRead) {
      markAsOpened(url);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-stone-50 dark:bg-stone-900">
        <div className="w-6 h-6 border-2 border-stone-300 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-stone-50 dark:bg-stone-900 p-4">
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
    <div className="min-h-screen bg-stone-100 dark:bg-stone-950 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 px-3 py-2.5 shadow-sm">
        <div className="flex items-center justify-between">
          <h1 className="text-base font-bold text-stone-900 dark:text-white">Snack Cards</h1>
          {items.length > 0 && (
            <span className="px-2 py-0.5 text-xs font-medium bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400 rounded-full">
              {items.length}
            </span>
          )}
        </div>
      </header>

      {/* List */}
      <main className="flex-1 overflow-y-auto p-2">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-stone-400 dark:text-stone-500">
            <p className="text-sm">Your reading list is empty</p>
          </div>
        ) : (
          <ul className="flex flex-col gap-1">
            {items.map((item) =>
              isVideoUrl(item.url) ? (
                <VideoItem
                  key={item.url}
                  item={item}
                  onOpen={() => handleVideoOpen(item.url)}
                  onRemove={() => removeItem(item.url)}
                />
              ) : (
                <ArticleItem
                  key={item.url}
                  item={item}
                  onClick={() => handleArticleClick(item.url)}
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
