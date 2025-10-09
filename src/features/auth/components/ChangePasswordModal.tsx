import React, { useState } from 'react';
import { X } from 'lucide-react';
import { changePassword } from '../api';

export default function ChangePasswordModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const valid = newPassword.length >= 6 && newPassword === confirm;

  if (!open) return null;

  const onSave = async () => {
    if (!valid) return;
    setSaving(true); setError(null);
    try {
      await changePassword(currentPassword, newPassword);
      onClose();
    } catch (e: any) {
      setError(e?.message || 'No se pudo cambiar la contraseña');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[50] bg-black/50 grid place-items-center">
      <div className="w-full max-w-md rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Cambiar contraseña</h3>
          <button onClick={onClose} aria-label="Cerrar" className="p-2 rounded-md hover:bg-neutral-100 dark:hover:bg-white/10">
            <X size={18} />
          </button>
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-sm text-neutral-600 dark:text-white/60">Contraseña actual</label>
            <input type="password" value={currentPassword} onChange={(e)=>setCurrentPassword(e.target.value)} className="mt-1 w-full px-3 py-2 rounded-md border border-neutral-300 dark:border-white/10 bg-white dark:bg-white/5" />
          </div>
          <div>
            <label className="text-sm text-neutral-600 dark:text-white/60">Nueva contraseña</label>
            <input type="password" value={newPassword} onChange={(e)=>setNewPassword(e.target.value)} className="mt-1 w-full px-3 py-2 rounded-md border border-neutral-300 dark:border-white/10 bg-white dark:bg-white/5" />
          </div>
          <div>
            <label className="text-sm text-neutral-600 dark:text-white/60">Confirmar contraseña</label>
            <input type="password" value={confirm} onChange={(e)=>setConfirm(e.target.value)} className="mt-1 w-full px-3 py-2 rounded-md border border-neutral-300 dark:border-white/10 bg-white dark:bg-white/5" />
          </div>
          {error && <div className="text-sm text-red-600 dark:text-red-400">{error}</div>}
          <div className="flex justify-end gap-2 pt-2">
            <button onClick={onClose} className="px-3 py-2 rounded-md border border-neutral-300 dark:border-white/10">Cancelar</button>
            <button onClick={onSave} disabled={saving || !valid} className="px-3 py-2 rounded-md bg-brand text-white disabled:opacity-60">{saving ? 'Guardando...' : 'Guardar'}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
