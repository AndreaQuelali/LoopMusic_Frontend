import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { Song } from '../features/songs/api';

export type RepeatMode = 'off' | 'one' | 'all';

type PlayerContextValue = {
  queue: Song[];
  index: number;
  current: Song | null;
  isPlaying: boolean;
  shuffle: boolean;
  repeat: RepeatMode;
  volume: number; // 0..1
  muted: boolean;
  currentTime: number; // seconds
  duration: number; // seconds
  // actions
  setQueueAndPlay: (songs: Song[], startIndex: number) => void;
  play: () => void;
  pause: () => void;
  next: () => void;
  prev: () => void;
  seek: (time: number) => void;
  setVolume: (v: number) => void;
  toggleMute: () => void;
  toggleShuffle: () => void;
  cycleRepeat: () => void;
};

const PlayerContext = createContext<PlayerContextValue | undefined>(undefined);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [queue, setQueue] = useState<Song[]>([]);
  const [index, setIndex] = useState<number>(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState<RepeatMode>('off');
  const [volume, setVolumeState] = useState<number>(() => {
    const v = localStorage.getItem('player:volume');
    return v ? Math.min(1, Math.max(0, parseFloat(v))) : 0.8;
  });
  const [muted, setMuted] = useState<boolean>(() => localStorage.getItem('player:muted') === '1');
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Lazy create audio element once
  if (!audioRef.current) {
    audioRef.current = new Audio();
  }
  const audio = audioRef.current!;

  // Apply volume/muted
  useEffect(() => {
    audio.volume = muted ? 0 : volume;
  }, [audio, volume, muted]);

  useEffect(() => {
    const onTime = () => setCurrentTime(audio.currentTime || 0);
    const onLoaded = () => setDuration(audio.duration || 0);
    const onEnded = () => {
      if (repeat === 'one') {
        audio.currentTime = 0;
        audio.play();
        return;
      }
      next();
    };
    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('loadedmetadata', onLoaded);
    audio.addEventListener('ended', onEnded);
    return () => {
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('loadedmetadata', onLoaded);
      audio.removeEventListener('ended', onEnded);
    };
  }, [audio, repeat]);

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target && (e.target as HTMLElement).tagName === 'INPUT') return;
      if (e.code === 'Space') { e.preventDefault(); isPlaying ? pause() : play(); }
      if (e.code === 'ArrowRight') { seek(Math.min(duration, currentTime + 5)); }
      if (e.code === 'ArrowLeft') { seek(Math.max(0, currentTime - 5)); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isPlaying, currentTime, duration]);

  const loadAndPlay = useCallback(async (song: Song) => {
    if (!song?.audioUrl) return;
    audio.src = song.audioUrl;
    try {
      await audio.play();
      setIsPlaying(true);
    } catch (e) {
      console.warn('Audio play error:', e);
      setIsPlaying(false);
    }
  }, [audio]);

  const play = useCallback(async () => {
    try { await audio.play(); setIsPlaying(true); } catch {}
  }, [audio]);

  const pause = useCallback(() => { audio.pause(); setIsPlaying(false); }, [audio]);

  const next = useCallback(() => {
    if (queue.length === 0) return;
    let nextIndex = index;
    if (shuffle) {
      if (queue.length === 1) return;
      do {
        nextIndex = Math.floor(Math.random() * queue.length);
      } while (nextIndex === index);
    } else {
      nextIndex = index + 1;
      if (nextIndex >= queue.length) {
        if (repeat === 'all') nextIndex = 0; else { setIsPlaying(false); return; }
      }
    }
    setIndex(nextIndex);
    loadAndPlay(queue[nextIndex]);
  }, [queue, index, shuffle, repeat, loadAndPlay]);

  const prev = useCallback(() => {
    if (queue.length === 0) return;
    let prevIndex = index - 1;
    if (prevIndex < 0) prevIndex = 0;
    setIndex(prevIndex);
    loadAndPlay(queue[prevIndex]);
  }, [queue, index, loadAndPlay]);

  const seek = useCallback((time: number) => {
    audio.currentTime = time;
    setCurrentTime(time);
  }, [audio]);

  const setVolume = useCallback((v: number) => {
    const clamped = Math.min(1, Math.max(0, v));
    setVolumeState(clamped);
    localStorage.setItem('player:volume', String(clamped));
  }, []);

  const toggleMute = useCallback(() => {
    setMuted((m) => {
      const next = !m; localStorage.setItem('player:muted', next ? '1' : '0'); return next;
    });
  }, []);

  const toggleShuffle = useCallback(() => setShuffle(s => !s), []);
  const cycleRepeat = useCallback(() => setRepeat(r => r === 'off' ? 'all' : r === 'all' ? 'one' : 'off'), []);

  const setQueueAndPlay = useCallback((songs: Song[], startIndex: number) => {
    setQueue(songs);
    const idx = Math.max(0, Math.min(songs.length - 1, startIndex));
    setIndex(idx);
    loadAndPlay(songs[idx]);
  }, [loadAndPlay]);

  const value = useMemo<PlayerContextValue>(() => ({
    queue, index, current: index >= 0 ? queue[index] ?? null : null,
    isPlaying, shuffle, repeat, volume, muted, currentTime, duration,
    setQueueAndPlay, play, pause, next, prev, seek, setVolume, toggleMute, toggleShuffle, cycleRepeat,
  }), [queue, index, isPlaying, shuffle, repeat, volume, muted, currentTime, duration, setQueueAndPlay, play, pause, next, prev, seek, setVolume, toggleMute, toggleShuffle, cycleRepeat]);

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error('usePlayer must be used within PlayerProvider');
  return ctx;
}
