import { describe, expect, it } from "vitest";
import { detectVideoService, isVideoUrl, getVideoThumbnail, VideoInfo } from "./videoUtils";

describe("detectVideoService", () => {
  describe("YouTube", () => {
    it("標準のwatch URLを検出する", () => {
      const result = detectVideoService("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
      expect(result.service).toBe("youtube");
      expect(result.id).toBe("dQw4w9WgXcQ");
      expect(result.embedUrl).toBe("https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ");
    });

    it("短縮URL（youtu.be）を検出する", () => {
      const result = detectVideoService("https://youtu.be/dQw4w9WgXcQ");
      expect(result.service).toBe("youtube");
      expect(result.id).toBe("dQw4w9WgXcQ");
    });

    it("埋め込みURLを検出する", () => {
      const result = detectVideoService("https://www.youtube.com/embed/dQw4w9WgXcQ");
      expect(result.service).toBe("youtube");
      expect(result.id).toBe("dQw4w9WgXcQ");
    });

    it("Shorts URLを検出する", () => {
      const result = detectVideoService("https://www.youtube.com/shorts/dQw4w9WgXcQ");
      expect(result.service).toBe("youtube");
      expect(result.id).toBe("dQw4w9WgXcQ");
    });

    it("追加パラメータ付きURLを検出する", () => {
      const result = detectVideoService("https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=120");
      expect(result.service).toBe("youtube");
      expect(result.id).toBe("dQw4w9WgXcQ");
    });

    it("wwwなしのURLを検出する", () => {
      const result = detectVideoService("https://youtube.com/watch?v=dQw4w9WgXcQ");
      expect(result.service).toBe("youtube");
      expect(result.id).toBe("dQw4w9WgXcQ");
    });
  });

  describe("Vimeo", () => {
    it("標準のVimeo URLを検出する", () => {
      const result = detectVideoService("https://vimeo.com/123456789");
      expect(result.service).toBe("vimeo");
      expect(result.id).toBe("123456789");
      expect(result.embedUrl).toBe("https://player.vimeo.com/video/123456789");
    });

    it("www付きのVimeo URLを検出する", () => {
      const result = detectVideoService("https://www.vimeo.com/123456789");
      expect(result.service).toBe("vimeo");
      expect(result.id).toBe("123456789");
    });
  });

  describe("TikTok", () => {
    it("標準のTikTok URLを検出する", () => {
      const result = detectVideoService("https://www.tiktok.com/@username/video/1234567890123456789");
      expect(result.service).toBe("tiktok");
      expect(result.id).toBe("1234567890123456789");
      expect(result.embedUrl).toBe("https://www.tiktok.com/embed/v2/1234567890123456789");
    });

    it("ユーザー名にドットを含むTikTok URLを検出する", () => {
      const result = detectVideoService("https://www.tiktok.com/@user.name/video/1234567890123456789");
      expect(result.service).toBe("tiktok");
      expect(result.id).toBe("1234567890123456789");
    });

    it("ユーザー名にハイフンを含むTikTok URLを検出する", () => {
      const result = detectVideoService("https://www.tiktok.com/@user-name/video/1234567890123456789");
      expect(result.service).toBe("tiktok");
      expect(result.id).toBe("1234567890123456789");
    });
  });

  describe("非動画URL", () => {
    it("通常のウェブサイトURLはnullを返す", () => {
      const result = detectVideoService("https://example.com/article");
      expect(result.service).toBeNull();
      expect(result.id).toBe("");
      expect(result.embedUrl).toBe("");
    });

    it("GitHubのURLはnullを返す", () => {
      const result = detectVideoService("https://github.com/user/repo");
      expect(result.service).toBeNull();
    });

    it("空文字はnullを返す", () => {
      const result = detectVideoService("");
      expect(result.service).toBeNull();
    });
  });
});

describe("isVideoUrl", () => {
  it("YouTube URLの場合はtrueを返す", () => {
    expect(isVideoUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ")).toBe(true);
  });

  it("Vimeo URLの場合はtrueを返す", () => {
    expect(isVideoUrl("https://vimeo.com/123456789")).toBe(true);
  });

  it("TikTok URLの場合はtrueを返す", () => {
    expect(isVideoUrl("https://www.tiktok.com/@user/video/1234567890123456789")).toBe(true);
  });

  it("通常のURLの場合はfalseを返す", () => {
    expect(isVideoUrl("https://example.com")).toBe(false);
  });
});

describe("getVideoThumbnail", () => {
  it("YouTubeのサムネイルURLを返す", () => {
    const videoInfo: VideoInfo = {
      id: "dQw4w9WgXcQ",
      service: "youtube",
      embedUrl: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
    };
    expect(getVideoThumbnail(videoInfo)).toBe("https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg");
  });

  it("Vimeoの場合は空文字を返す", () => {
    const videoInfo: VideoInfo = {
      id: "123456789",
      service: "vimeo",
      embedUrl: "https://player.vimeo.com/video/123456789",
    };
    expect(getVideoThumbnail(videoInfo)).toBe("");
  });

  it("TikTokの場合は空文字を返す", () => {
    const videoInfo: VideoInfo = {
      id: "1234567890123456789",
      service: "tiktok",
      embedUrl: "https://www.tiktok.com/embed/v2/1234567890123456789",
    };
    expect(getVideoThumbnail(videoInfo)).toBe("");
  });

  it("serviceがnullの場合は空文字を返す", () => {
    const videoInfo: VideoInfo = {
      id: "",
      service: null,
      embedUrl: "",
    };
    expect(getVideoThumbnail(videoInfo)).toBe("");
  });
});
