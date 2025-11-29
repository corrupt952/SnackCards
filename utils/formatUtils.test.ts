import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { getDomain, getFavicon, getTimeAgo } from "./formatUtils";

describe("getDomain", () => {
  it("標準的なURLからドメインを抽出する", () => {
    expect(getDomain("https://example.com/path/to/page")).toBe("example.com");
  });

  it("www.を除去する", () => {
    expect(getDomain("https://www.example.com/page")).toBe("example.com");
  });

  it("サブドメイン付きURLを処理する", () => {
    expect(getDomain("https://blog.example.com/article")).toBe("blog.example.com");
  });

  it("www.blog.のような複合サブドメインからwww.のみ除去する", () => {
    expect(getDomain("https://www.blog.example.com")).toBe("blog.example.com");
  });

  it("ポート番号付きURLを処理する", () => {
    expect(getDomain("https://localhost:3000/page")).toBe("localhost");
  });

  it("httpプロトコルを処理する", () => {
    expect(getDomain("http://example.com")).toBe("example.com");
  });

  it("クエリパラメータ付きURLを処理する", () => {
    expect(getDomain("https://example.com/page?foo=bar&baz=qux")).toBe("example.com");
  });

  it("無効なURLの場合は元の文字列を返す", () => {
    expect(getDomain("not-a-valid-url")).toBe("not-a-valid-url");
  });

  it("空文字の場合は空文字を返す", () => {
    expect(getDomain("")).toBe("");
  });
});

describe("getFavicon", () => {
  it("Google Favicon APIのURLを生成する", () => {
    expect(getFavicon("https://example.com")).toBe(
      "https://www.google.com/s2/favicons?domain=example.com&sz=64"
    );
  });

  it("www.を除去したドメインでURLを生成する", () => {
    expect(getFavicon("https://www.github.com/user/repo")).toBe(
      "https://www.google.com/s2/favicons?domain=github.com&sz=64"
    );
  });

  it("サブドメイン付きURLを処理する", () => {
    expect(getFavicon("https://docs.google.com/document")).toBe(
      "https://www.google.com/s2/favicons?domain=docs.google.com&sz=64"
    );
  });
});

describe("getTimeAgo", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("undefinedの場合は空文字を返す", () => {
    expect(getTimeAgo(undefined)).toBe("");
  });

  it("1時間未満の場合は'now'を返す", () => {
    const now = Date.now();
    vi.setSystemTime(now);

    // 30分前
    expect(getTimeAgo(now - 30 * 60 * 1000)).toBe("now");

    // 59分前
    expect(getTimeAgo(now - 59 * 60 * 1000)).toBe("now");

    // 直前
    expect(getTimeAgo(now - 1000)).toBe("now");
  });

  it("1時間以上24時間未満の場合は'Xh'を返す", () => {
    const now = Date.now();
    vi.setSystemTime(now);

    // 1時間前
    expect(getTimeAgo(now - 1 * 60 * 60 * 1000)).toBe("1h");

    // 5時間前
    expect(getTimeAgo(now - 5 * 60 * 60 * 1000)).toBe("5h");

    // 23時間前
    expect(getTimeAgo(now - 23 * 60 * 60 * 1000)).toBe("23h");
  });

  it("24時間以上の場合は'Xd'を返す", () => {
    const now = Date.now();
    vi.setSystemTime(now);

    // 1日前
    expect(getTimeAgo(now - 24 * 60 * 60 * 1000)).toBe("1d");

    // 7日前
    expect(getTimeAgo(now - 7 * 24 * 60 * 60 * 1000)).toBe("7d");

    // 30日前
    expect(getTimeAgo(now - 30 * 24 * 60 * 60 * 1000)).toBe("30d");

    // 365日前
    expect(getTimeAgo(now - 365 * 24 * 60 * 60 * 1000)).toBe("365d");
  });

  it("日数が優先される（25時間 = 1d）", () => {
    const now = Date.now();
    vi.setSystemTime(now);

    // 25時間前 = 1日と1時間 → 1d
    expect(getTimeAgo(now - 25 * 60 * 60 * 1000)).toBe("1d");
  });
});
