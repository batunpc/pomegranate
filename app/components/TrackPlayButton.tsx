'use client';

import React from 'react';
import { useAudioPlayer } from '@/components/AudioProvider';
import { Track } from '@/types/index';

export function TrackPlayButton({
  track,
  playing,
  paused,
  ...props
}: React.ComponentPropsWithoutRef<'button'> & {
  track: Track;
  playing: React.ReactNode;
  paused: React.ReactNode;
}) {
  console.log('TrackPlayButton rendering for track:', track.name);
  let player = useAudioPlayer();

  const handleClick = () => {
    console.log('TrackPlayButton clicked for track:', track.name);
    if (player.isPlaying(track)) {
      console.log('Pausing track');
      player.pause();
    } else {
      console.log('Attempting to play track', JSON.stringify(track));
      player.play(track);
    }
  };

  return (
    <button
      type="button"
      onClick={(e) => {
        console.log('Button clicked');
        e.preventDefault();
        handleClick();
      }}
      aria-label={`${
        player.isPlaying(track) ? 'Pause' : 'Play'
      } track ${track.name}`}
      className="w-8 h-8 flex items-center justify-center text-white bg-pink-700 rounded-full hover:bg-pink-600"
      {...props}
    >
      {player.isPlaying(track) ? playing : paused}
    </button>
  );
}
