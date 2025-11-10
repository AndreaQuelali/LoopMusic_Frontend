import React, { useEffect, useMemo, useState } from 'react';
import Navbar from '../../../components/Navbar';
import BottomPlayer from '../../../player/AudioPlayer';
import { useFavorites } from '../FavoritesContext';
import { getSongs, type Song } from '../../songs/api';
import { usePlayer } from '../../../player/PlayerContext';
import { Heart, Play } from 'lucide-react';
import { getFavoriteSongs } from '../api';
import { useAuth } from '../../auth/AuthContext';

export default function Favorites() {
  const { favorites, isFavorite, toggleFavorite } = useFavorites();
  const { setQueueAndPlay } = usePlayer();
  const { token } = useAuth();
  const [allSongs, setAllSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        if (token) {
          const list = await getFavoriteSongs();
          if (mounted) setAllSongs(list);
        } else {
          const list = await getSongs();
          if (mounted) setAllSongs(list);
        }
      } catch (e: any) {
        if (mounted) setError(e?.message || 'Error cargando canciones');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [token]);

  const favList = useMemo(() => {
    if (token) return allSongs;
    const set = favorites;
    return allSongs.filter(s => set.has(String(s.id)));
  }, [allSongs, favorites, token]);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container-responsive py-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Favoritos</h2>
        </div>
        {loading && <div className="mt-4 text-neutral-600 dark:text-white/70">Cargando...</div>}
        {error && <div className="mt-4 text-red-600 dark:text-red-400">{error}</div>}
        {!loading && !error && favList.length === 0 && (
          <div className="mt-6 text-neutral-600 dark:text-white/60">Aún no tienes canciones en favoritos. Explora y marca con el corazón.</div>
        )}
        {!loading && !error && favList.length > 0 && (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favList.map((song, idx) => (
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
                <div className="block w-full">
                  <div
                    className="aspect-video bg-cover bg-center"
                    style={{ backgroundImage: `url(${song.coverUrl || 'https://picsum.photos/seed/fav/600/400'})` }}
                  />
                </div>
                <div className="p-4 flex items-center justify-between">
                  <div>
                    <div className="font-medium">{song.title}</div>
                    <div className="text-sm text-neutral-600 dark:text-white/60">{song.artist}</div>
                  </div>
                  <button
                    aria-label="Reproducir"
                    onClick={() => setQueueAndPlay(favList, idx)}
                    className="p-2 rounded-full bg-brand text-white hover:brightness-110">
                    <Play size={20} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
      <BottomPlayer />
    </div>
  );
}
