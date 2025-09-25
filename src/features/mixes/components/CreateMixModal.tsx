import React, { useEffect, useMemo, useState } from 'react';
import { createMix } from '../api';
import type { Song } from '../../songs/api';
import { X } from 'lucide-react';

type Props = {
  open: boolean;
  onClose: () => void;
  allSongs: Song[];
  presetSongId?: string | null;
  onCreated?: () => void;
};

export default function CreateMixModal({ open, onClose, allSongs, presetSongId, onCreated }: Props) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setName('');
      setDescription('');
      setIsPublic(false);
      const s = new Set<string>();
      if (presetSongId) s.add(presetSongId);
      setSelected(s);
      setError(null);
    }
  }, [open, presetSongId]);

  const toggle = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setError('El nombre es requerido'); return; }
    const songIds = Array.from(selected);
    if (songIds.length === 0) { setError('Selecciona al menos una canción'); return; }
    setLoading(true);
    setError(null);
    try {
      await createMix({ name: name.trim(), description: description.trim(), isPublic, songIds });
      onClose();
      onCreated?.();
    } catch (err: any) {
      setError(err?.message || 'Error creando el mix');
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute inset-0 p-4 flex items-center justify-center">
        <div className="w-full max-w-2xl rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 shadow-xl max-h-[85vh] overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-white/10">
            <h3 className="text-lg font-semibold">Crear mezcla</h3>
            <button onClick={onClose} className="p-2" aria-label="Cerrar"><X size={18} /></button>
          </div>
          <form onSubmit={onSubmit} className="p-4 space-y-4 max-h-[70vh] overflow-auto custom-scroll">
            <div>
              <label className="block text-sm mb-1">Nombre</label>
              <input value={name} onChange={(e)=>setName(e.target.value)} className="w-full rounded-md border border-neutral-300 dark:border-white/10 bg-white dark:bg-white/5 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand" placeholder="Ingresa nombre de mezcla" />
            </div>
            <div>
              <label className="block text-sm mb-1">Descripción</label>
              <textarea value={description} onChange={(e)=>setDescription(e.target.value)} className="w-full rounded-md border border-neutral-300 dark:border-white/10 bg-white dark:bg-white/5 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand" rows={3} placeholder="Ingresa descripción de la mezcla" />
            </div>
            <div className="flex items-center gap-2">
              <input className="chk-brand w-4 h-4" id="public" type="checkbox" checked={isPublic} onChange={(e)=>setIsPublic(e.target.checked)} />
              <label htmlFor="public">Público</label>
            </div>

            <div>
              <label className="block text-sm mb-2">Canciones</label>
              <div className="max-h-64 overflow-auto custom-scroll rounded-md border border-neutral-200 dark:border-white/10 divide-y divide-neutral-200 dark:divide-white/10">
                {allSongs.map(s => (
                  <label key={s.id} className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-neutral-50 dark:hover:bg-white/5">
                    <input className="chk-brand w-4 h-4" type="checkbox" checked={selected.has(String(s.id))} onChange={()=>toggle(String(s.id))} />
                    <div className="w-10 h-10 rounded bg-cover bg-center" style={{ backgroundImage: `url(${s.coverUrl || 'https://picsum.photos/seed/mix/100/100'})` }} />
                    <div className="min-w-0">
                      <div className="font-medium truncate">{s.title}</div>
                      <div className="text-xs text-neutral-600 dark:text-white/60 truncate">{s.artist}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {error && <div className="text-sm text-red-600 dark:text-red-400">{error}</div>}
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={onClose} className="px-4 py-2 rounded-md border border-neutral-300 dark:border-white/10">Cancelar</button>
              <button disabled={loading} type="submit" className="px-4 py-2 rounded-md bg-brand text-white disabled:opacity-60">{loading ? 'Creando...' : 'Crear mezcla'}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
