// components/TrackPlayer.tsx
'use client';

import { useState, useRef, useEffect } from 'react';

function PlayIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

export default function TrackPlayer({
  track,
  index,
}: {
  track: any;
  index: number;
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio(track.preview_url);
    audioRef.current.addEventListener('ended', () =>
      setIsPlaying(false),
    );
    return () => {
      audioRef.current?.pause();
      audioRef.current?.removeEventListener('ended', () =>
        setIsPlaying(false),
      );
    };
  }, [track.preview_url]);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="relative w-8 h-8">
      <span className="absolute inset-0 flex items-center justify-center group-hover:opacity-0 transition-opacity duration-200">
        {index + 1}
      </span>
      <button
        className="absolute inset-0 flex items-center justify-center text-pink-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        onClick={togglePlay}
      >
        <PlayIcon
          className={`h-7 w-7 ${isPlaying ? 'text-green-500' : ''}`}
        />
      </button>
    </div>
  );
}
