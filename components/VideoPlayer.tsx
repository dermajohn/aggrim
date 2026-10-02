'use client';

import { useState } from 'react';

interface VideoPlayerProps {
  embedUrl: string;
  title?: string;
}

export default function VideoPlayer({ embedUrl, title }: VideoPlayerProps) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div className="relative w-full aspect-video bg-[#1a1a1a] rounded-lg overflow-hidden flex items-center justify-center">
        <div className="text-center">
          <svg className="w-16 h-16 text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-gray-400 mb-4">Unable to load video</p>
          <button
            onClick={() => setError(false)}
            className="bg-[#e50914] text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
      <iframe
        src={embedUrl}
        className="w-full h-full"
        frameBorder="0"
        allowFullScreen
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
        referrerPolicy="no-referrer"
        title={title || 'Video Player'}
        style={{
          border: 'none',
        }}
      />
    </div>
  );
}
