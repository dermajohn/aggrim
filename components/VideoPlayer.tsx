'use client';

import { useEffect, useRef, useState } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import { extractStreamUrl } from '@/lib/videoSource';

interface VideoPlayerProps {
  embedUrl: string;
  title?: string;
}

export default function VideoPlayer({ embedUrl, title }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [useFallback, setUseFallback] = useState(false);

  useEffect(() => {
    let player: any = null;

    const initPlayer = async () => {
      if (!videoRef.current) return;

      setLoading(true);
      setError(null);

      // Try to extract direct stream URL
      const streamUrl = await extractStreamUrl(embedUrl);

      if (streamUrl) {
        // Use custom video.js player with direct stream
        try {
          player = videojs(videoRef.current, {
            controls: true,
            autoplay: false,
            preload: 'auto',
            fluid: true,
            responsive: true,
            sources: [
              {
                src: streamUrl,
                type: streamUrl.includes('.m3u8') ? 'application/x-mpegURL' : 'video/mp4',
              },
            ],
            controlBar: {
              children: [
                'playToggle',
                'volumePanel',
                'currentTimeDisplay',
                'timeDivider',
                'durationDisplay',
                'progressControl',
                'fullscreenToggle',
              ],
            },
          });

          player.ready(function () {
            setLoading(false);
          });

          player.on('error', () => {
            console.error('Video.js error, falling back to iframe');
            setUseFallback(true);
            setLoading(false);
          });

          playerRef.current = player;
        } catch (err) {
          console.error('Failed to initialize video.js:', err);
          setUseFallback(true);
          setLoading(false);
        }
      } else {
        // Fallback to sandboxed iframe
        setUseFallback(true);
        setLoading(false);
      }
    };

    initPlayer();

    return () => {
      if (player) {
        player.dispose();
      }
    };
  }, [embedUrl]);

  if (loading) {
    return (
      <div className="relative w-full aspect-video bg-[#1a1a1a] rounded-lg overflow-hidden flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e50914] mx-auto mb-4"></div>
          <p className="text-gray-400">Loading player...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative w-full aspect-video bg-[#1a1a1a] rounded-lg overflow-hidden flex items-center justify-center">
        <div className="text-center">
          <svg className="w-16 h-16 text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-[#e50914] text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (useFallback) {
    // Sandboxed iframe fallback
    return (
      <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
        <iframe
          src={embedUrl}
          className="w-full h-full"
          frameBorder="0"
          allowFullScreen
          sandbox="allow-scripts allow-same-origin"
          referrerPolicy="no-referrer"
          title={title || 'Video Player'}
          style={{
            border: 'none',
          }}
        />
      </div>
    );
  }

  // Custom video.js player
  return (
    <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
      <div data-vjs-player>
        <video
          ref={videoRef}
          className="video-js vjs-big-play-centered vjs-theme-fantasy"
          playsInline
        />
      </div>
    </div>
  );
}
