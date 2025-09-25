import React, { useEffect, useMemo, useRef, useState } from 'react';
import Navbar from '../../../components/Navbar';
import BottomPlayer from '../../../player/AudioPlayer';
import { useParams, useNavigate } from 'react-router-dom';
import { getMix, getMixSongs, addSongsToMix, removeSongFromMix, updateMixOrder } from '../api';
import { getSongs, type Song } from '../../songs/api';
import { usePlayer } from '../../../player/PlayerContext';
import { Play, Plus, Trash2, ArrowLeft, GripVertical } from 'lucide-react';
import AddToMixModal from '../components/AddToMixModal';

export default function MixDetail() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const { setQueueAndPlay } = usePlayer();
  const [mix, setMix] = useState<{ id: string; name: string; description?: string | null; isPublic: boolean; songIds: string[] } | null>(null);
  const [songs, setSongs] = useState<Song[]>([]);
  const [allSongs, setAllSongs] = useState<Song[]>([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const dragIndex = useRef<number | null>(null);
  const overIndex = useRef<number | null>(null);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  const refresh = async () => {
    try {
      setLoading(true);
      const [m, list] = await Promise.all([getMix(id), getMixSongs(id)]);
      setMix(m);
      setSongs(list);
    } catch (e: any) {
      setError(e?.message || 'Error cargando mezcla');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        await refresh();
        const all = await getSongs();
        if (mounted) setAllSongs(all);
      } catch {}
    })();
    return () => { mounted = false; };
  }, [id]);

  const availableToAdd = useMemo(() => {
    const inMix = new Set((mix?.songIds || []).map(String));
    return allSongs.filter(s => !inMix.has(String(s.id)));
  }, [allSongs, mix]);

  const onAddConfirm = async (ids: string[]) => {
    await addSongsToMix(id, ids);
    await refresh();
  };

  const removeFromMix = async (songId: string) => {
    await removeSongFromMix(id, songId);
    await refresh();
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container-responsive py-6">
        <button onClick={() => navigate('/mixes')} className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:underline dark:text-white/70"><ArrowLeft size={20} /></button>
        {loading && <div className="mt-6 text-neutral-600 dark:text-white/70">Cargando mezcla...</div>}
        {error && <div className="mt-6 text-red-600 dark:text-red-400">{error}</div>}
        {mix && (
          <header className="mt-4 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold">{mix.name}</h2>
              {mix.description && <p className="text-neutral-600 dark:text-white/60 mt-1">{mix.description}</p>}
            </div>
            <div className="flex items-center gap-2">
              <button
                className="px-4 py-2 rounded-md bg-brand text-white inline-flex items-center gap-2"
                onClick={() => { if (songs.length) setQueueAndPlay(songs, 0); }}
                title="Reproducir todo"
              >
                <Play size={18} /> Reproducir
              </button>
              <button
                className="px-4 py-2 rounded-md border border-neutral-300 dark:border-white/10 inline-flex items-center gap-2"
                onClick={() => setOpenAdd(true)}
                title="Agregar canciones"
              >
                <Plus size={18} /> Agregar canciones
              </button>
            </div>
          </header>
        )}

        {!loading && songs.length === 0 && (
          <div className="mt-6 text-neutral-600 dark:text-white/60">Este mix aún no tiene canciones.</div>
        )}

        {!loading && songs.length > 0 && (
          <div className="mt-6 divide-y divide-neutral-200 dark:divide-white/10 rounded-xl overflow-hidden border border-neutral-200 dark:border-white/10 bg-white dark:bg-white/5">
            {songs.map((s, idx) => (
              <div
                key={s.id}
                className={`flex items-center justify-between px-4 py-3 select-none transition-colors ${hoverIdx === idx ? 'bg-neutral-50 dark:bg-white/5' : ''}`}
                draggable
                onDragStart={() => { dragIndex.current = idx; document.body.classList.add('cursor-grabbing'); }}
                onDragOver={(e) => { e.preventDefault(); overIndex.current = idx; setHoverIdx(idx); }}
                onDragEnter={() => { overIndex.current = idx; setHoverIdx(idx); }}
                onDragLeave={() => { setHoverIdx(null); }}
                onDragEnd={() => { setHoverIdx(null); document.body.classList.remove('cursor-grabbing'); dragIndex.current = null; overIndex.current = null; }}
                onDrop={async () => {
                  const from = dragIndex.current; const to = overIndex.current;
                  dragIndex.current = null; overIndex.current = null;
                  setHoverIdx(null);
                  document.body.classList.remove('cursor-grabbing');
                  if (from == null || to == null || from === to) return;
                  // reorder locally
                  setSongs(prev => {
                    const arr = prev.slice();
                    const [moved] = arr.splice(from, 1);
                    arr.splice(to, 0, moved);
                    return arr;
                  });
                  // persist order
                  try {
                    const ids = (songs.slice()).map(x => String(x.id));
                    const [moved] = ids.splice(from, 1);
                    ids.splice(to, 0, moved);
                    await updateMixOrder(id, ids);
                  } catch {}
                }}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-neutral-400 dark:text-white/40 cursor-grab active:cursor-grabbing" title="Arrastrar para reordenar">
                    <GripVertical size={16} />
                  </span>
                  <div className="w-12 h-12 rounded bg-cover bg-center" style={{ backgroundImage: `url(${s.coverUrl || 'https://picsum.photos/seed/mixsong/100/100'})` }} />
                  <div className="min-w-0">
                    <div className="font-medium truncate">{s.title}</div>
                    <div className="text-xs text-neutral-600 dark:text-white/60 truncate">{s.artist}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 rounded-full bg-brand text-white" title="Reproducir desde aquí" onClick={() => setQueueAndPlay(songs, idx)}>
                    <Play size={16} />
                  </button>
                  <button className="p-2 rounded-md border border-neutral-300 dark:border-white/10" title="Eliminar del mix" onClick={() => removeFromMix(String(s.id))}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <BottomPlayer />

      <AddToMixModal
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        allSongs={availableToAdd}
        onConfirm={onAddConfirm}
      />
    </div>
  );
}
