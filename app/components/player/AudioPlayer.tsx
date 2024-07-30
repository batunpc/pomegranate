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
import Image from 'next/image';

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export function AudioPlayer() {
  let player = useAudioPlayer();

  if (!player.track) {
    return null;
  }

  const progress =
    player.duration > 0
      ? (player.currentTime / player.duration) * 100
      : 0;

  const numberFormatter = new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-neutral-900 bg-opacity-95 text-white h-20 border-t border-neutral-800">
      <div className="flex flex-col justify-center h-full px-4 max-w-screen-xl mx-auto">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center space-x-3 w-1/4">
            {player.track.album &&
              player.track.album.images &&
              player.track.album.images[0] && (
                <Image
                  src={player.track.album.images[0].url}
                  alt={player.track.name}
                  width={48}
                  height={48}
                  className="rounded-sm"
                />
              )}
            <div className="flex flex-col justify-center">
              <p className="font-medium text-sm truncate">
                {player.track.name}
              </p>
              <p className="text-xs text-gray-400 truncate">
                {player.track.artists
                  .map((artist) => artist.name)
                  .join(', ')}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <RewindButton player={player} />
            <div className="relative">
              <div className="absolute -inset-1 bg-pink-500 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-300"></div>
              <PlayButton player={player} />
            </div>
            <ForwardButton player={player} />
          </div>

          <div className="w-1/4 flex justify-end space-x-3">
            <PlaybackRateButton player={player} />
            <MuteButton player={player} />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-400 w-10 text-right">
            {formatTime(player.currentTime)}
          </span>
          <div className="flex-1">
            <Slider
              label="Seek time"
              maxValue={player.duration}
              step={1}
              value={[player.currentTime]}
              onChange={([value]) => player.seek(value)}
              numberFormatter={numberFormatter}
            />
          </div>
          <span className="text-xs text-gray-400 w-10">
            {formatTime(player.duration)}
          </span>
        </div>
      </div>
    </div>
  );
}
