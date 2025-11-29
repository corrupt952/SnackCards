/**
 * Extract domain from URL, removing "www." prefix
 */
export function getDomain(url: string): string {
  try {
    return new URL(url).hostname.replace("www.", "");
  } catch {
    return url;
  }
}

/**
 * Generate Google Favicon URL for a given URL
 */
export function getFavicon(url: string): string {
  const domain = getDomain(url);
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
}

/**
 * Convert timestamp to human-readable relative time
 * Returns "Xd" for days, "Xh" for hours, "now" for recent
 */
export function getTimeAgo(timestamp?: number): string {
  if (!timestamp) return "";
  const now = Date.now();
  const diff = now - timestamp;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor(diff / (1000 * 60 * 60));

  if (days > 0) return `${days}d`;
  if (hours > 0) return `${hours}h`;
  return "now";
}
