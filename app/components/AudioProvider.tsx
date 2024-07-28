'use client';

import {
  createContext,
  useContext,
  useMemo,
  useReducer,
  useRef,
} from 'react';

import { Track } from '@/types/index';

interface PlayerState {
  playing: boolean;
  muted: boolean;
  duration: number;
  currentTime: number;
  track: Track | null;
}

interface PublicPlayerActions {
  play: (track?: Track) => void;
  pause: () => void;
  toggle: (track?: Track) => void;
  seekBy: (amount: number) => void;
  seek: (time: number) => void;
  playbackRate: (rate: number) => void;
  toggleMute: () => void;
  isPlaying: (track?: Track) => boolean;
}

export type PlayerAPI = PlayerState & PublicPlayerActions;

const enum ActionKind {
  SET_META = 'SET_META',
  PLAY = 'PLAY',
  PAUSE = 'PAUSE',
  TOGGLE_MUTE = 'TOGGLE_MUTE',
  SET_CURRENT_TIME = 'SET_CURRENT_TIME',
  SET_DURATION = 'SET_DURATION',
}

type Action =
  | { type: ActionKind.SET_META; payload: Track }
  | { type: ActionKind.PLAY }
  | { type: ActionKind.PAUSE }
  | { type: ActionKind.TOGGLE_MUTE }
  | { type: ActionKind.SET_CURRENT_TIME; payload: number }
  | { type: ActionKind.SET_DURATION; payload: number };

const AudioPlayerContext = createContext<PlayerAPI | null>(null);

function audioReducer(
  state: PlayerState,
  action: Action,
): PlayerState {
  switch (action.type) {
    case ActionKind.SET_META:
      console.log(
        'AudioProvider Reducer: Setting meta:',
        JSON.stringify(action.payload, null, 2),
      );
      return { ...state, track: action.payload };
    case ActionKind.PLAY:
      console.log('AudioProvider Reducer: Setting playing to true');
      return { ...state, playing: true };

    case ActionKind.PAUSE:
      return { ...state, playing: false };
    case ActionKind.TOGGLE_MUTE:
      return { ...state, muted: !state.muted };
    case ActionKind.SET_CURRENT_TIME:
      return { ...state, currentTime: action.payload };
    case ActionKind.SET_DURATION:
      return { ...state, duration: action.payload };
  }
}

function AudioProvider({ children }: { children: React.ReactNode }) {
  let [state, dispatch] = useReducer(audioReducer, {
    playing: false,
    muted: false,
    duration: 0,
    currentTime: 0,
    track: null,
  });
  let playerRef = useRef<HTMLAudioElement>(null);

  let actions = useMemo<PublicPlayerActions>(() => {
    return {
      play(track?: Track) {
        console.log(
          'AudioProvider: Play action called with track:',
          JSON.stringify(track),
        );
        if (track) {
          console.log('AudioProvider: Setting new track in state');
          dispatch({ type: ActionKind.SET_META, payload: track });
        } else if (state.track) {
          console.log(
            'AudioProvider: Using existing track from state',
          );
          track = state.track;
        } else {
          console.error('AudioProvider: No track to play');
          return;
        }

        if (playerRef.current) {
          console.log(
            'AudioProvider: Current audio src:',
            playerRef.current.src,
          );
          console.log(
            'AudioProvider: New track preview_url:',
            track.preview_url,
          );

          if (playerRef.current.src !== track.preview_url) {
            console.log('AudioProvider: Setting new track URL');
            playerRef.current.src = track.preview_url;
            playerRef.current.load();
          }
        }

        console.log('AudioProvider: Attempting to play audio');
        playerRef.current
          ?.play()
          .then(() => {
            console.log(
              'AudioProvider: Audio playback started successfully',
            );
            dispatch({ type: ActionKind.PLAY });
          })
          .catch((error) => {
            console.error(
              'AudioProvider: Error playing audio:',
              error,
            );
          });
      },
      pause() {
        playerRef.current?.pause();
      },
      toggle(track) {
        this.isPlaying(track) ? actions.pause() : actions.play(track);
      },
      seekBy(amount) {
        if (playerRef.current) {
          playerRef.current.currentTime += amount;
        }
      },
      seek(time) {
        if (playerRef.current) {
          playerRef.current.currentTime = time;
        }
      },
      playbackRate(rate) {
        if (playerRef.current) {
          playerRef.current.playbackRate = rate;
        }
      },
      toggleMute() {
        dispatch({ type: ActionKind.TOGGLE_MUTE });
      },
      isPlaying(track) {
        return track
          ? state.playing &&
              playerRef.current?.src === track.preview_url
          : state.playing;
      },
    };
  }, [state.playing]);

  let api = useMemo<PlayerAPI>(
    () => ({ ...state, ...actions }),
    [state, actions],
  );

  return (
    <>
      <AudioPlayerContext.Provider value={api}>
        {children}
      </AudioPlayerContext.Provider>
      <audio
        ref={playerRef}
        onPlay={() => dispatch({ type: ActionKind.PLAY })}
        onPause={() => dispatch({ type: ActionKind.PAUSE })}
        onTimeUpdate={(event) => {
          dispatch({
            type: ActionKind.SET_CURRENT_TIME,
            payload: Math.floor(event.currentTarget.currentTime),
          });
        }}
        onDurationChange={(event) => {
          dispatch({
            type: ActionKind.SET_DURATION,
            payload: Math.floor(event.currentTarget.duration),
          });
        }}
        muted={state.muted}
      />
    </>
  );
}

function useAudioPlayer() {
  let player = useContext(AudioPlayerContext);

  if (!player) {
    throw new Error(
      'useAudioPlayer must be used within an AudioProvider',
    );
  }

  return player;
}
export { AudioProvider, useAudioPlayer };
