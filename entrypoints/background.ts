export default defineBackground(() => {
  console.log("Hello background!", { id: browser.runtime.id });

  // Update badge with total reading list count
  const updateBadge = async () => {
    try {
      const items = await browser.readingList.query({});
      const totalCount = items.length;

      if (totalCount > 0) {
        await browser.action.setBadgeText({ text: String(totalCount) });
        await browser.action.setBadgeBackgroundColor({ color: "#57534e" });
      } else {
        await browser.action.setBadgeText({ text: "" });
      }
    } catch (error) {
      console.error("Failed to update badge:", error);
    }
  };

  // Update badge on startup
  updateBadge();

  // Update badge when reading list changes
  browser.readingList.onEntryAdded.addListener(() => {
    updateBadge();
  });

  browser.readingList.onEntryRemoved.addListener(() => {
    updateBadge();
  });

  browser.readingList.onEntryUpdated.addListener(() => {
    updateBadge();
  });

  // Open side panel when extension icon is clicked
  browser.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
});
