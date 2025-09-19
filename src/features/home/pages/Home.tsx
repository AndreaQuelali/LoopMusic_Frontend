import React from 'react';
import Navbar from '../../../components/Navbar';
import { useEffect, useState } from 'react';
import { getSongs, Song } from '../../songs/api';

export default function Home() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getSongs();
        if (mounted) setSongs(data);
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
        <h2 className="text-lg text-white/80">Bienvenid@, disfruta de miles de canciones</h2>
        <div className="mt-6 flex items-center">
          <div className="relative w-full">
            <input
              placeholder="Buscar"
              className="w-full rounded-full bg-white/5 border border-white/10 pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60">🔍</span>
          </div>
        </div>

        <section className="mt-10">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Recientemente escuchados</h3>
          </div>
          {loading && <div className="mt-4 text-white/70">Cargando canciones...</div>}
          {error && <div className="mt-4 text-red-400">{error}</div>}
          {!loading && !error && (
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {songs.length === 0 && (
                <div className="text-white/60">No hay canciones aún.</div>
              )}
              {songs.map((song) => (
                <article key={song.id} className="group bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                  <div
                    className="aspect-video bg-cover bg-center"
                    style={{ backgroundImage: `url(${song.coverUrl || 'https://picsum.photos/seed/loop-fallback/600/400' })` }}
                  />
                  <div className="p-4 flex items-center justify-between">
                    <div>
                      <div className="font-medium">{song.title}</div>
                      <div className="text-sm text-white/60">{song.artist}</div>
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

