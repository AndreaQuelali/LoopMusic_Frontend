import React, { useEffect, useState } from 'react';
import type { Song } from '../../songs/api';
import { X } from 'lucide-react';

type Props = {
  open: boolean;
  onClose: () => void;
  allSongs: Song[];
  presetSelected?: string[];
  onConfirm: (songIds: string[]) => Promise<void> | void;
};

export default function AddToMixModal({ open, onClose, allSongs, presetSelected = [], onConfirm}: Props) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setSelected(new Set(presetSelected.map(String)));
      setError(null);
      setLoading(false);
    }
  }, [open, presetSelected]);

  if (!open) return null;

  const toggle = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ids = Array.from(selected);
    if (ids.length === 0) { setError('Selecciona al menos una canción'); return; }
    setLoading(true);
    setError(null);
    try {
      await onConfirm(ids);
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Error al agregar canciones');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute inset-0 p-4 flex items-center justify-center">
        <div className="w-full max-w-2xl rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 shadow-xl max-h-[85vh] overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-white/10">
            <h3 className="text-lg font-semibold">Agregar canciones</h3>
            <button onClick={onClose} className="p-2" aria-label="Cerrar"><X size={18} /></button>
          </div>
          <form onSubmit={handleSubmit} className="p-4 space-y-4 overflow-auto custom-scroll">
            <div className="max-h-80 overflow-auto custom-scroll rounded-md border border-neutral-200 dark:border-white/10 divide-y divide-neutral-200 dark:divide-white/10">
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
            {error && <div className="text-sm text-red-600 dark:text-red-400">{error}</div>}
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={onClose} className="px-4 py-2 rounded-md border border-neutral-300 dark:border-white/10">Cancelar</button>
              <button disabled={loading} type="submit" className="px-4 py-2 rounded-md bg-brand text-white disabled:opacity-60">{loading ? 'Agregando...' : 'Agregar'}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
