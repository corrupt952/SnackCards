import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import FilterTabs from "./components/FilterTabs";
import ReadingListItemComponent from "./components/ReadingListItem";
import EmptyState from "./components/EmptyState";
import LoadingSpinner from "./components/LoadingSpinner";
import ErrorState from "./components/ErrorState";

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
  const [filter, setFilter] = useState<"all" | "unread" | "read">("unread");

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
      setError("Failed to load reading list: " + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (url: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await chrome.readingList.updateEntry({ url, hasBeenRead: true });
      setItems((prev) => prev.map((item) => (item.url === url ? { ...item, hasBeenRead: true } : item)));
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  const markAsUnread = async (url: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await chrome.readingList.updateEntry({ url, hasBeenRead: false });
      setItems((prev) => prev.map((item) => (item.url === url ? { ...item, hasBeenRead: false } : item)));
    } catch (error) {
      console.error("Failed to mark as unread:", error);
    }
  };

  const removeItem = async (url: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await chrome.readingList.removeEntry({ url });
      setItems((prev) => prev.filter((item) => item.url !== url));
    } catch (error) {
      console.error("Failed to remove item:", error);
    }
  };

  const filteredItems = items.filter((item) => {
    if (filter === "unread") return !item.hasBeenRead;
    if (filter === "read") return item.hasBeenRead;
    return true;
  });

  const unreadCount = items.filter((item) => !item.hasBeenRead).length;
  const readCount = items.filter((item) => item.hasBeenRead).length;

  const handleArticleClick = (url: string) => {
    window.open(url, "_blank");
    const item = items.find((item) => item.url === url);
    if (item && !item.hasBeenRead) {
      markAsRead(url, new MouseEvent("click"));
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={loadReadingList} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="max-w-4xl mx-auto">
        <Header />

        <FilterTabs
          filter={filter}
          onFilterChange={setFilter}
          totalItems={items.length}
          unreadItems={unreadCount}
          readItems={readCount}
        />

        <div className="p-6">
          {filteredItems.length === 0 ? (
            <EmptyState filter={filter} />
          ) : (
            <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-1">
              {filteredItems.map((item) => (
                <ReadingListItemComponent
                  key={item.url}
                  item={item}
                  onMarkAsRead={markAsRead}
                  onMarkAsUnread={markAsUnread}
                  onRemove={removeItem}
                  onClick={handleArticleClick}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
