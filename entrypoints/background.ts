export default defineBackground(() => {
  console.log("Hello background!", { id: browser.runtime.id });

  // Update badge with total reading list count
  const updateBadge = async () => {
    try {
      const items = await chrome.readingList.query({});
      const totalCount = items.length;

      if (totalCount > 0) {
        await chrome.action.setBadgeText({ text: String(totalCount) });
        await chrome.action.setBadgeBackgroundColor({ color: "#57534e" });
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

  // Open side panel when extension icon is clicked
  browser.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
});
