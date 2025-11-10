import React, { useEffect, useRef, useState } from 'react';
import { usePlayer } from './PlayerContext';
import { Shuffle, SkipBack, Play, Pause, SkipForward, Repeat, Repeat1, Volume2, VolumeX, X } from 'lucide-react';

function formatTime(sec: number) {
  if (!isFinite(sec) || sec < 0) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function AudioPlayer() {
  const {
    current, isPlaying, play, pause, next, prev,
    seek, currentTime, duration,
    volume, setVolume, muted, toggleMute,
    shuffle, toggleShuffle, repeat, cycleRepeat,
  } = usePlayer();

  const [hidden, setHidden] = useState(false);
  const lastIdRef = useRef<string | null>(null);

  // Auto-unhide when playback resumes
  useEffect(() => {
    if (isPlaying) setHidden(false);
  }, [isPlaying]);

  // Auto-unhide when a NEW track is selected (id changed)
  useEffect(() => {
    const id = current?.id ?? null;
    if (id && id !== lastIdRef.current) {
      setHidden(false);
      lastIdRef.current = id;
    }
  }, [current?.id]);

  if (!current || hidden) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-neutral-200 bg-white/95 backdrop-blur dark:border-white/10 dark:bg-black/60">
      <div className="container-responsive py-3 flex items-center gap-4">
        {/* Left: cover + titles */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-12 h-12 rounded-md bg-cover bg-center flex-shrink-0" style={{ backgroundImage: `url(${current?.coverUrl || 'https://picsum.photos/seed/loop-fallback/200/200'})` }} />
          <div className="min-w-0">
            <div className="font-medium truncate">{current?.title || 'Nada reproducido'}</div>
            <div className="text-sm text-neutral-600 dark:text-white/60 truncate">{current?.artist || '—'}</div>
          </div>
        </div>

        {/* Center: controls */}
        <div className="flex-1 flex flex-col items-center gap-2">
          <div className="flex items-center gap-3">
            <button onClick={toggleShuffle} className={`p-2 rounded ${shuffle ? 'text-brand' : 'text-neutral-700 dark:text-white/80'}`} title="Aleatorio">
              <Shuffle size={20} />
            </button>
            <button onClick={prev} className="p-2" title="Anterior">
              <SkipBack size={22} />
            </button>
            {isPlaying ? (
              <button onClick={pause} className="p-2 rounded-full bg-brand text-white" title="Pausar">
                <Pause size={22} />
              </button>
            ) : (
              <button onClick={play} className="p-2 rounded-full bg-brand text-white" title="Reproducir">
                <Play size={22} />
              </button>
            )}
            <button onClick={next} className="p-2" title="Siguiente">
              <SkipForward size={22} />
            </button>
            <button onClick={cycleRepeat} className={`p-2 rounded ${repeat !== 'off' ? 'text-brand' : 'text-neutral-700 dark:text-white/80'}`} title="Repetir">
              {repeat === 'one' ? <Repeat1 size={20} /> : <Repeat size={20} />}
            </button>
          </div>
          <div className="w-full flex items-center gap-2 text-xs text-neutral-600 dark:text-white/60">
            <span className="tabular-nums w-10 text-right">{formatTime(currentTime)}</span>
            <input
              type="range"
              min={0}
              max={Math.max(1, Math.floor(duration))}
              step={1}
              value={Math.floor(currentTime)}
              onChange={(e) => seek(parseInt(e.target.value, 10))}
              className="flex-1 accent-brand"
            />
            <span className="tabular-nums w-10">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Right: controls (volume + close) */}
        <div className="hidden md:flex items-center gap-2 w-52 justify-end">
          <button onClick={toggleMute} className="p-2" title={muted ? 'Activar sonido' : 'Silenciar'}>
            {muted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={muted ? 0 : volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-36 accent-brand"
          />
          <button onClick={() => { pause(); setHidden(true); }} className="p-2" title="Cerrar reproductor">
            <X size={18} />
          </button>
        </div>
        {/* Mobile: close button */}
        <div className="flex md:hidden items-center ml-auto">
          <button onClick={() => { pause(); setHidden(true); }} className="p-2" title="Cerrar reproductor">
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

