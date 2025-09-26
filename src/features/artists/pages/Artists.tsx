import React, { useEffect, useMemo, useState } from 'react';
import Navbar from '../../../components/Navbar';
import BottomPlayer from '../../../player/AudioPlayer';
import { getSongs, type Song } from '../../songs/api';
import { usePlayer } from '../../../player/PlayerContext';
import { useFavorites } from '../../favorites/FavoritesContext';
import { Heart, Play, Search } from 'lucide-react';

type ArtistInfo = { name: string; count: number };

export default function Artists() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [q, setQ] = useState('');
  const { setQueueAndPlay, current, isPlaying } = usePlayer();
  const { isFavorite, toggleFavorite } = useFavorites();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const list = await getSongs();
        if (mounted) setSongs(list);
      } catch (e: any) {
        if (mounted) setError(e?.message || 'Error cargando artistas');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const artists: ArtistInfo[] = useMemo(() => {
    const counts = new Map<string, number>();
    for (const s of songs) {
      const name = (s.artist || '').trim();
      if (!name) continue;
      counts.set(name, (counts.get(name) || 0) + 1);
    }
    return Array.from(counts.entries()).map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [songs]);

  useEffect(() => {
    if (!selected && artists.length > 0) setSelected(artists[0].name);
  }, [artists, selected]);

  const currentSongs = useMemo(() => {
    const artist = selected?.toLowerCase() || '';
    const qq = q.trim().toLowerCase();
    return songs.filter(s => {
      const matchArtist = (s.artist || '').toLowerCase() === artist;
      if (!matchArtist) return false;
      if (!qq) return true;
      const t = (s.title || '').toLowerCase();
      return t.includes(qq);
    });
  }, [songs, selected, q]);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container-responsive py-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <h2 className="text-2xl font-semibold">Artistas</h2>
          <div className="relative w-full max-w-md">
            <input
              placeholder="Buscar por título"
              value={q}
              onChange={(e)=>setQ(e.target.value)}
              className="w-full rounded-full bg-white border border-neutral-200 pl-12 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand dark:bg-white/5 dark:border-white/10"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 dark:text-white/60"><Search size={16} /></span>
          </div>
        </div>

        {/* Artist chips */}
        <div className="mt-4 flex items-center gap-2 overflow-auto custom-scroll pb-2">
          {artists.map(a => (
            <button
              key={a.name}
              onClick={() => setSelected(a.name)}
              className={`px-3 py-1.5 rounded-full border text-sm whitespace-nowrap ${selected === a.name ? 'bg-brand text-white border-brand' : 'border-neutral-300 dark:border-white/10 hover:bg-neutral-100 dark:hover:bg-white/10'}`}
              title={`${a.count} canciones`}
            >
              {a.name} <span className="opacity-70">({a.count})</span>
            </button>
          ))}
        </div>

        {loading && <div className="mt-6 text-neutral-600 dark:text-white/70">Cargando artistas...</div>}
        {error && <div className="mt-6 text-red-600 dark:text-red-400">{error}</div>}

        {!loading && !error && selected && (
          <section className="mt-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">{selected}</h3>
            </div>
            {currentSongs.length === 0 && (
              <div className="mt-4 text-neutral-600 dark:text-white/60">No hay canciones para este artista.</div>
            )}
            {currentSongs.length > 0 && (
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
                {currentSongs.map((song, idx) => (
                  <article key={song.id} className="group relative bg-white border border-neutral-200 rounded-xl overflow-hidden dark:bg-white/5 dark:border-white/10">
                    <div className="absolute top-2 right-2 z-40 flex items-center gap-2">
                      <button
                        aria-label={isFavorite(song.id) ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                        onClick={() => toggleFavorite(song)}
                        className={`p-2 rounded-md ${isFavorite(song.id) ? 'bg-brand text-white' : 'bg-black/50 text-white hover:bg-black/60'}`}
                      >
                        <Heart size={16} fill={isFavorite(song.id) ? 'currentColor' : 'transparent'} />
                      </button>
                    </div>
                    <button onClick={() => setQueueAndPlay(currentSongs, idx)} className="block w-full text-left">
                      <div className="aspect-square bg-cover bg-center" style={{ backgroundImage: `url(${song.coverUrl || 'https://picsum.photos/seed/artist/400/400'})` }} />
                    </button>
                    {current?.id === song.id && isPlaying && (
                      <div className="absolute left-2 bottom-14">
                        <div className="eq-bars"><span></span><span></span><span></span></div>
                      </div>
                    )}
                    <button
                      aria-label="Reproducir"
                      onClick={() => setQueueAndPlay(currentSongs, idx)}
                      className="absolute right-2 bottom-14 p-2 rounded-full bg-brand text-white shadow-md hover:brightness-110"
                    >
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
        )}
      </main>
      <BottomPlayer />
    </div>
  );
}
