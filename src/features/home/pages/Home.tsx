import React from 'react';
import Navbar from '../../../components/Navbar';
import { useEffect, useState } from 'react';
import { getSongs, getTopSongs, Song } from '../../songs/api';

export default function Home() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [top, setTop] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        <h2 className="text-lg text-neutral-600 dark:text-white/80">Bienvenid@, disfruta de miles de canciones</h2>
        <div className="mt-6 flex items-center">
          <div className="relative w-full">
            <input
              placeholder="Buscar"
              className="w-full rounded-full bg-white border border-neutral-200 pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand dark:bg-white/5 dark:border-white/10"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 dark:text-white/60">🔍</span>
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
              {top.slice(0, 10).map((song, idx) => (
                <article key={song.id} className="group relative bg-white border border-neutral-200 rounded-xl overflow-hidden dark:bg-white/5 dark:border-white/10">
                  <div
                    className="aspect-square bg-cover bg-center"
                    style={{ backgroundImage: `url(${song.coverUrl || 'https://picsum.photos/seed/loop-fallback/400/400' })` }}
                  />
                  {/* Rank badge */}
                  <div className="absolute left-2 top-2 size-9 rounded-md grid place-items-center font-bold text-white bg-black/60 dark:bg-black/60">
                    {idx + 1}
                  </div>
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
              {songs.map((song) => (
                <article key={song.id} className="group bg-white border border-neutral-200 rounded-xl overflow-hidden dark:bg-white/5 dark:border-white/10">
                  <div
                    className="aspect-video bg-cover bg-center"
                    style={{ backgroundImage: `url(${song.coverUrl || 'https://picsum.photos/seed/loop-fallback/600/400' })` }}
                  />
                  <div className="p-4 flex items-center justify-between">
                    <div>
                      <div className="font-medium">{song.title}</div>
                      <div className="text-sm text-neutral-600 dark:text-white/60">{song.artist}</div>
                    </div>
                    <button className="size-10 rounded-full bg-brand/90 hover:bg-brand text-white grid place-items-center">▶</button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

