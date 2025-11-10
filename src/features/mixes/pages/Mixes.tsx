import React, { useEffect, useState } from 'react';
import Navbar from '../../../components/Navbar';
import CreateMixModal from '../components/CreateMixModal';
import { getSongs, Song } from '../../songs/api';
import { getMixes, Mix, getMixSongs } from '../api';
import { usePlayer } from '../../../player/PlayerContext';
import { Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BottomPlayer from '../../../player/AudioPlayer';

export default function Mixes() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [mixes, setMixes] = useState<Mix[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { setQueueAndPlay } = usePlayer();
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const [allSongs, allMixes] = await Promise.all([getSongs(), getMixes()]);
        if (mounted) { setSongs(allSongs); setMixes(allMixes); }
      } catch (e: any) {
        if (mounted) setError(e?.message || 'Error cargando mixes');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const refreshMixes = async () => {
    try { setMixes(await getMixes()); } catch {}
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container-responsive py-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Mezclas</h2>
          <button onClick={() => setOpen(true)} className="px-4 py-2 rounded-md bg-brand text-white">Crear mezcla</button>
        </div>
        {loading && <div className="mt-4 text-neutral-600 dark:text-white/70">Cargando...</div>}
        {error && <div className="mt-4 text-red-600 dark:text-red-400">{error}</div>}
        {!loading && !error && (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {mixes.length === 0 && (
              <div className="text-neutral-600 dark:text-white/60">Aún no tienes mezclas. ¡Crea el primero!</div>
            )}
            {mixes.map(m => (
              <article key={m.id} className="rounded-xl bg-white border border-neutral-200 p-4 dark:bg-white/5 dark:border-white/10 cursor-pointer" onClick={() => navigate(`/mixes/${m.id}`)}>
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold truncate">{m.name}</h3>
                  <div className="flex items-center gap-2">
                    <button
                      className="p-2 rounded-full bg-brand text-white"
                      title="Reproducir mezcla"
                      onClick={async (e) => {
                        e.stopPropagation();
                        try {
                          const list = await getMixSongs(m.id);
                          if (list.length > 0) setQueueAndPlay(list, 0);
                        } catch (e) { /* noop */ }
                      }}
                    >
                      <Play size={18} />
                    </button>
                    <span className="text-xs px-2 py-0.5 rounded-full border border-neutral-300 dark:border-white/10">{m.isPublic ? 'Público' : 'Privado'}</span>
                  </div>
                </div>
                {m.description && <p className="mt-1 text-sm text-neutral-600 dark:text-white/60 line-clamp-2">{m.description}</p>}
                <div className="mt-3 text-sm text-neutral-600 dark:text-white/60">{m.songIds.length} canciones</div>
              </article>
            ))}
          </div>
        )}
      </main>
      <CreateMixModal open={open} onClose={() => setOpen(false)} allSongs={songs} onCreated={refreshMixes} />
      <BottomPlayer />
    </div>
  );
}
