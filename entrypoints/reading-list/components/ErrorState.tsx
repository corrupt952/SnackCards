import React from "react";

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
}

export default function ErrorState({ error, onRetry }: ErrorStateProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center max-w-md">
        <div className="text-red-600 text-lg font-medium mb-4">Failed to load reading list</div>
        <p className="text-gray-600 mb-6">{error}</p>
        <button onClick={onRetry} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 font-medium">
          Try again
        </button>
      </div>
    </div>
  );
}
