'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

import { useAudioPlayer } from '@/components/AudioProvider';
import { ForwardButton } from '@/components/player/ForwardButton';
import { MuteButton } from '@/components/player/MuteButton';
import { PlaybackRateButton } from '@/components/player/PlaybackRateButton';
import { PlayButton } from '@/components/player/PlayButton';
import { RewindButton } from '@/components/player/RewindButton';
import { Slider } from '@/components/player/Slider';
import { Track } from '@/types/index';

function parseTime(seconds: number) {
  let hours = Math.floor(seconds / 3600);
  let minutes = Math.floor((seconds - hours * 3600) / 60);
  seconds = seconds - hours * 3600 - minutes * 60;
  return [hours, minutes, seconds];
}

function formatHumanTime(seconds: number) {
  let [h, m, s] = parseTime(seconds);
  return `${h} hour${h === 1 ? '' : 's'}, ${m} minute${
    m === 1 ? '' : 's'
  }, ${s} second${s === 1 ? '' : 's'}`;
}

export function AudioPlayer() {
  let player = useAudioPlayer();

  console.log(
    'AudioPlayer rendering',
    JSON.stringify(player, null, 2),
  );

  if (!player.track) {
    console.log('No track in player, not rendering AudioPlayer');
    return null;
  }

  console.log('Rendering AudioPlayer with track:', player.track);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-neutral-900 text-white p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-semibold">{player.track.name}</p>
          <p className="text-sm text-gray-400">
            {player.track.artists
              .map((artist) => artist.name)
              .join(', ')}
          </p>
        </div>
        <div>
          <button
            onClick={() =>
              player.playing
                ? player.pause()
                : player.play(player.track!)
            }
          >
            {player.playing ? 'Pause' : 'Play'}
          </button>
        </div>
      </div>
    </div>
  );
}
