export default defineBackground(() => {
  console.log('Hello background!', { id: browser.runtime.id });

  // Open Reading List page when extension icon is clicked
  browser.action.onClicked.addListener(() => {
    browser.tabs.create({
      url: browser.runtime.getURL('/reading-list.html')
    });
  });
});
