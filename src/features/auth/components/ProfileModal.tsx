import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useAuth } from '../AuthContext';
import { updateUsername } from '../api';

export default function ProfileModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { user, updateUser } = useAuth();
  const [username, setUsername] = useState(user?.username || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const onSave = async () => {
    setSaving(true); setError(null);
    try {
      const res = await updateUsername(username.trim());
      updateUser(res.user);
      onClose();
    } catch (e: any) {
      setError(e?.message || 'No se pudo actualizar');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[50] bg-black/50 grid place-items-center">
      <div className="w-full max-w-md rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Perfil</h3>
          <button onClick={onClose} aria-label="Cerrar" className="p-2 rounded-md hover:bg-neutral-100 dark:hover:bg-white/10">
            <X size={18} />
          </button>
        </div>
        <div className="space-y-3">
          <div>
            <div className="text-sm text-neutral-600 dark:text-white/60">Email</div>
            <div className="font-mono text-sm">{user?.email}</div>
          </div>
          <div>
            <label className="text-sm text-neutral-600 dark:text-white/60">Nombre de usuario</label>
            <input
              value={username}
              onChange={(e)=>setUsername(e.target.value)}
              className="mt-1 w-full px-3 py-2 rounded-md border border-neutral-300 dark:border-white/10 bg-white dark:bg-white/5"
            />
          </div>
          {error && <div className="text-sm text-red-600 dark:text-red-400">{error}</div>}
          <div className="flex justify-end gap-2 pt-2">
            <button onClick={onClose} className="px-3 py-2 rounded-md border border-neutral-300 dark:border-white/10">Cancelar</button>
            <button onClick={onSave} disabled={saving || !username.trim()} className="px-3 py-2 rounded-md bg-brand text-white disabled:opacity-60">{saving ? 'Guardando...' : 'Guardar'}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
