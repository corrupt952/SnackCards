export interface VideoInfo {
  id: string;
  service: "youtube" | "vimeo" | "tiktok" | null;
  embedUrl: string;
}

export function detectVideoService(url: string): VideoInfo {
  // YouTube patterns
  const youtubeRegex =
    /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w\-]{11})/;
  const youtubeId = url.match(youtubeRegex)?.[1];

  if (youtubeId) {
    return {
      id: youtubeId,
      service: "youtube",
      // Use YouTube's official Privacy Enhanced Mode domain
      // https://support.google.com/youtube/answer/171780
      embedUrl: `https://www.youtube-nocookie.com/embed/${youtubeId}`,
    };
  }

  // Vimeo patterns
  const vimeoRegex = /^(?:https?:\/\/)?(?:www\.)?(?:vimeo\.com\/)([0-9]+)/;
  const vimeoId = url.match(vimeoRegex)?.[1];

  if (vimeoId) {
    return {
      id: vimeoId,
      service: "vimeo",
      embedUrl: `https://player.vimeo.com/video/${vimeoId}`,
    };
  }

  // TikTok patterns
  const tiktokRegex = /^(?:https?:\/\/)?(?:www\.)?tiktok\.com\/@[\w\-\.]+\/video\/([0-9]+)/;
  const tiktokId = url.match(tiktokRegex)?.[1];

  if (tiktokId) {
    return {
      id: tiktokId,
      service: "tiktok",
      embedUrl: `https://www.tiktok.com/embed/v2/${tiktokId}`,
    };
  }

  // Not a video URL
  return {
    id: "",
    service: null,
    embedUrl: "",
  };
}

export function isVideoUrl(url: string): boolean {
  const videoInfo = detectVideoService(url);
  return videoInfo.service !== null;
}

export function getVideoThumbnail(videoInfo: VideoInfo): string {
  switch (videoInfo.service) {
    case "youtube":
      return `https://img.youtube.com/vi/${videoInfo.id}/mqdefault.jpg`;
    case "vimeo":
      return "";
    case "tiktok":
      return "";
    default:
      return "";
  }
}
