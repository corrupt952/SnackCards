export default defineBackground(() => {
  console.log("Hello background!", { id: browser.runtime.id });

  // Update badge with unread count
  const updateBadge = async () => {
    try {
      const items = await chrome.readingList.query({ hasBeenRead: false });
      const unreadCount = items.length;

      if (unreadCount > 0) {
        await chrome.action.setBadgeText({ text: String(unreadCount) });
        await chrome.action.setBadgeBackgroundColor({ color: "#B91C1C" });
      } else {
        await chrome.action.setBadgeText({ text: "" });
      }
    } catch (error) {
      console.error("Failed to update badge:", error);
    }
  };

  // Update badge on startup
  updateBadge();

  // Update badge when reading list changes
  chrome.readingList.onEntryAdded.addListener(() => {
    updateBadge();
  });

  chrome.readingList.onEntryRemoved.addListener(() => {
    updateBadge();
  });

  chrome.readingList.onEntryUpdated.addListener(() => {
    updateBadge();
  });

  // Open Reading List page when extension icon is clicked
  browser.action.onClicked.addListener(() => {
    browser.tabs.create({
      url: browser.runtime.getURL("/reading-list.html"),
    });
  });
});
