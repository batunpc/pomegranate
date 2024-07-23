'use client';

import { AudioPlayer } from '@/components/player/AudioPlayer';

export function BottomPlayer() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <AudioPlayer />
    </div>
  );
}
