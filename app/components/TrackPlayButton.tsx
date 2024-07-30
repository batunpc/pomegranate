'use client';

import React, { useMemo, useCallback } from 'react';
import { useAudioPlayer } from '@/components/AudioProvider';
import { Track } from '@/types/index';

export const TrackPlayButton = React.memo(
  ({
    track,
    playing,
    paused,
    ...props
  }: React.ComponentPropsWithoutRef<'button'> & {
    track: Track;
    playing: React.ReactNode;
    paused: React.ReactNode;
  }) => {
    const player = useAudioPlayer();

    const isPlaying = useMemo(
      () => player.isPlaying(track),
      [player, track],
    );

    const handleClick = useCallback(() => {
      console.log('TrackPlayButton clicked for track:', track.name);
      if (isPlaying) {
        console.log('Pausing track');
        player.pause();
      } else {
        console.log(
          'Attempting to play track',
          JSON.stringify(track),
        );
        player.play(track);
      }
    }, [isPlaying, player, track]);

    console.log(`TrackPlayButton rendering for track: ${track.name}`);

    return (
      <button
        type="button"
        onClick={handleClick}
        aria-label={`${isPlaying ? 'Pause' : 'Play'} track ${
          track.name
        }`}
        className="w-8 h-8 flex items-center justify-center text-white bg-pink-700 rounded-full hover:bg-pink-600"
        {...props}
      >
        {isPlaying ? playing : paused}
      </button>
    );
  },
);

TrackPlayButton.displayName = 'TrackPlayButton';
