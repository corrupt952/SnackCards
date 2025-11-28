import React, { useState } from "react";
import { VideoInfo } from "../utils/videoUtils";

interface VideoEmbedProps {
  videoInfo: VideoInfo;
  title: string;
}

export default function VideoEmbed({ videoInfo, title }: VideoEmbedProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
  };

  if (hasError) {
    return (
      <div className="w-full h-64 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="text-slate-500 dark:text-slate-400 mb-2">⚠️ Video failed to load</div>
          <a
            href={videoInfo.embedUrl.replace("/embed/", "/watch?v=")}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
          >
            Open in {videoInfo.service}
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full relative">
      {/* Loading placeholder */}
      {!isLoaded && (
        <div className="w-full h-64 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-slate-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-2"></div>
            <div className="text-slate-500 dark:text-slate-400 text-sm">Loading {videoInfo.service} video...</div>
          </div>
        </div>
      )}

      {/* Video iframe */}
      <iframe
        src={videoInfo.embedUrl}
        title={title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className={`w-full h-64 rounded-lg ${isLoaded ? "block" : "hidden"}`}
        onLoad={handleLoad}
        onError={handleError}
      />

      {/* Video service badge */}
      <div className="absolute top-2 right-2">
        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-black/70 text-white">
          {videoInfo.service?.toUpperCase()}
        </span>
      </div>
    </div>
  );
}
