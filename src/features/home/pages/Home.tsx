import React from 'react';
import Navbar from '../../../components/Navbar';
import { useEffect, useState } from 'react';
import { getSongs, getTopSongs, Song } from '../../songs/api';
import BottomPlayer from '../../../player/AudioPlayer';
import { usePlayer } from '../../../player/PlayerContext';
import { Play, MoreVertical, Search } from 'lucide-react';
import CreateMixModal from '../../mixes/components/CreateMixModal';
import { useAuth } from '../../auth/AuthContext';

export default function Home() {
   const { user, logout } = useAuth();
  const [songs, setSongs] = useState<Song[]>([]);
  const [top, setTop] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [q, setQ] = useState('');
  const { setQueueAndPlay, current, isPlaying } = usePlayer();
  const [openMix, setOpenMix] = useState(false);
  const [presetSongId, setPresetSongId] = useState<string | null>(null);
  const [menuSongId, setMenuSongId] = useState<string | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuSongId(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const filteredTop = top.filter(s => {
    const t = (s.title || '').toLowerCase();
    const a = (s.artist || '').toLowerCase();
    const qq = q.trim().toLowerCase();
    if (!qq) return true;
    return t.includes(qq) || a.includes(qq);
  });
  const filteredRecent = songs.filter(s => {
    const t = (s.title || '').toLowerCase();
    const a = (s.artist || '').toLowerCase();
    const qq = q.trim().toLowerCase();
    if (!qq) return true;
    return t.includes(qq) || a.includes(qq);
  });

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [recent, top10] = await Promise.all([getSongs(), getTopSongs()]);
        if (mounted) {
          setSongs(recent);
          setTop(top10);
        }
      } catch (e: any) {
        if (mounted) setError(e?.message || 'Error cargando canciones');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container-responsive py-6">
        <h2 className="text-lg text-neutral-600 dark:text-white/80">Bienvenid@ {user?.username}, disfruta de miles de canciones</h2>
        <div className="mt-6 flex items-center">
          <div className="relative w-full">
            <input
              placeholder="Buscar canciones o artistas"
              value={q}
              onChange={(e)=>setQ(e.target.value)}
              className="w-full rounded-full bg-white border border-neutral-200 pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand dark:bg-white/5 dark:border-white/10"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 dark:text-white/60"><Search size={16} /></span>
          </div>
        </div>

        {/* Top 10 Canciones */}
        <section className="mt-10">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Top 10 • Canciones</h3>
          </div>
          {loading && <div className="mt-4 text-neutral-700 dark:text-white/70">Cargando top...</div>}
          {error && <div className="mt-4 text-red-600 dark:text-red-400">{error}</div>}
          {!loading && !error && (
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
              {filteredTop.slice(0, 10).map((song, idx) => (
                <article key={song.id} className="group relative bg-white border border-neutral-200 rounded-xl overflow-hidden dark:bg-white/5 dark:border-white/10" onClick={() => setMenuSongId(null)}>
                  <button
                    onClick={() => setQueueAndPlay(filteredTop, idx)}
                    className="block w-full text-left">
                    <div
                      className="aspect-square bg-cover bg-center"
                      style={{ backgroundImage: `url(${song.coverUrl || 'https://picsum.photos/seed/loop-fallback/400/400' })` }}
                    />
                  </button>
                  {/* Card actions */}
                  <div className="absolute top-2 right-2 z-40">
                    <button
                      aria-label="Opciones"
                      onClick={(e) => { e.stopPropagation(); setMenuSongId(prev => prev === String(song.id) ? null : String(song.id)); }}
                      className="p-2 rounded-md bg-black/50 text-white hover:bg-black/60">
                      <MoreVertical size={16} />
                    </button>
                    {menuSongId === String(song.id) && (
                      <div className="absolute right-0 top-full mt-2 z-50 w-44 rounded-md border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900 shadow-md overflow-hidden">
                        <button
                          className="w-full text-left px-3 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-white/5"
                          onClick={(e) => { e.stopPropagation(); setPresetSongId(String(song.id)); setOpenMix(true); setMenuSongId(null); }}>
                          Crear mezcla
                        </button>
                      </div>
                    )}
                  </div>
                  {current?.id === song.id && isPlaying && (
                    <div className="absolute left-2 bottom-14">
                      <div className="eq-bars"><span></span><span></span><span></span></div>
                    </div>
                  )}
                  {/* Rank badge */}
                  <div className="absolute left-2 top-2 size-9 rounded-md grid place-items-center font-bold text-white bg-black/60 dark:bg-black/60">
                    {idx + 1}
                  </div>
                  <button
                    aria-label="Reproducir"
                    onClick={() => setQueueAndPlay(top, idx)}
                    className="absolute right-2 bottom-14 p-2 rounded-full bg-brand text-white shadow-md hover:brightness-110">
                    <Play size={20} />
                  </button>
                  <div className="p-3">
                    <div className="font-medium truncate">{song.title}</div>
                    <div className="text-sm text-neutral-600 dark:text-white/60 truncate">{song.artist}</div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="mt-10">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Recientemente escuchados</h3>
          </div>
          {loading && <div className="mt-4 text-white/70">Cargando canciones...</div>}
          {error && <div className="mt-4 text-red-400">{error}</div>}
          {!loading && !error && (
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {songs.length === 0 && (
                <div className="text-neutral-600 dark:text-white/60">No hay canciones aún.</div>
              )}
              {filteredRecent.map((song, idx) => (
                <article key={song.id} className="group relative bg-white border border-neutral-200 rounded-xl overflow-hidden dark:bg-white/5 dark:border-white/10">
                  <button onClick={() => setQueueAndPlay(songs, idx)} className="block w-full text-left">
                    <div
                      className="aspect-video bg-cover bg-center"
                      style={{ backgroundImage: `url(${song.coverUrl || 'https://picsum.photos/seed/loop-fallback/600/400' })` }}
                    />
                  </button>
                  {/* Card actions */}
                  <div className="absolute top-2 right-2 z-40">
                    <button
                      aria-label="Opciones"
                      onClick={(e) => { e.stopPropagation(); setMenuSongId(prev => prev === String(song.id) ? null : String(song.id)); }}
                      className="p-2 rounded-md bg-black/50 text-white hover:bg-black/60">
                      <MoreVertical size={16} />
                    </button>
                    {menuSongId === String(song.id) && (
                      <div className="absolute right-0 top-full mt-2 z-50 w-44 rounded-md border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900 shadow-md overflow-hidden">
                        <button
                          className="w-full text-left px-3 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-white/5"
                          onClick={(e) => { e.stopPropagation(); setPresetSongId(String(song.id)); setOpenMix(true); setMenuSongId(null); }}>
                          Crear mezcla
                        </button>
                      </div>
                    )}
                  </div>
                  {current?.id === song.id && isPlaying && (
                    <div className="absolute left-3 top-3">
                      <div className="eq-bars"><span></span><span></span><span></span></div>
                    </div>
                  )}
                  <div className="p-4 flex items-center justify-between">
                    <div>
                      <div className="font-medium">{song.title}</div>
                      <div className="text-sm text-neutral-600 dark:text-white/60">{song.artist}</div>
                    </div>
                    <button aria-label="Reproducir" onClick={() => setQueueAndPlay(filteredRecent, idx)} className="p-2 rounded-full bg-brand text-white hover:brightness-110">
                      <Play size={20} />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
      <BottomPlayer />
      <CreateMixModal open={openMix} onClose={() => setOpenMix(false)} allSongs={[...top, ...songs]} presetSongId={presetSongId || undefined} />
    </div>
  );
}

