import React, { useEffect, useRef, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import Logo from './Logo';
import { useAuth } from '../features/auth/AuthContext';
import { useTheme } from '../theme/ThemeContext';
import { Sun, Moon, User } from 'lucide-react';
import ProfileModal from '../features/auth/components/ProfileModal';
import ChangePasswordModal from '../features/auth/components/ChangePasswordModal';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 rounded-md text-sm font-medium ${
      isActive
        ? 'text-brand'
        : 'text-neutral-700 hover:text-neutral-900 dark:text-white/80 dark:hover:text-white'
    }`;

  return (
    <nav className="sticky top-0 z-30 backdrop-blur bg-white/60 dark:bg-black/30 border-b border-neutral-200 dark:border-white/10">
      <div className="container-responsive flex items-center justify-between h-14">
        <Link to="/" className="flex items-center gap-3">
          <Logo />
        </Link>
        <div className="hidden md:flex items-center gap-1">
          <NavLink className={linkClass} to="/">Inicio</NavLink>
          <NavLink className={linkClass} to="/genres">Géneros</NavLink>
          <NavLink className={linkClass} to="/artists">Artistas</NavLink>
          <NavLink className={linkClass} to="/mixes">Mezclas</NavLink>
          <NavLink className={linkClass} to="/favorites">Favoritos</NavLink>
        </div>
        <div className="flex items-center gap-3 relative">
          <button onClick={toggle} aria-label="Cambiar tema"
            className="text-sm px-3 py-2 rounded-md border border-neutral-300 text-neutral-700 hover:bg-neutral-100 dark:border-white/10 dark:text-white/80 dark:hover:bg-white/10">
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          {!user ? (
            <>
              <Link to="/login" className="text-sm text-neutral-700 hover:text-neutral-900 dark:text-white/80 dark:hover:text-white">Iniciar sesión</Link>
              <Link to="/register" className="text-sm bg-brand/90 hover:bg-brand text-white px-3 py-2 rounded-md">Registrarse</Link>
            </>
          ) : (
            <ProfileMenu onLogout={logout} />
          )}
        </div>
      </div>
    </nav>
  );
}

function ProfileMenu({ onLogout }: { onLogout: () => void }) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDoc);
    window.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDoc); window.removeEventListener('keydown', onKey); };
  }, []);

  const initials = (user?.username || user?.email || '?').slice(0, 1).toUpperCase();

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-white/10 flex items-center justify-center text-neutral-800 dark:text-white"
        aria-label="Perfil"
      >
        <span className="hidden sm:inline">{initials}</span>
        <span className="sm:hidden"><User size={16} /></span>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-48 rounded-md border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900 shadow-md overflow-hidden z-50">
          <button onClick={() => { setShowProfile(true); setOpen(false); }} className="w-full text-left px-3 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-white/5">Perfil</button>
          <button onClick={() => { setShowPassword(true); setOpen(false); }} className="w-full text-left px-3 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-white/5">Cambiar contraseña</button>
          <button onClick={() => { setOpen(false); onLogout(); }} className="w-full text-left px-3 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-white/5">Cerrar sesión</button>
        </div>
      )}
      <ProfileModal open={showProfile} onClose={() => setShowProfile(false)} />
      <ChangePasswordModal open={showPassword} onClose={() => setShowPassword(false)} />
    </div>
  );
}
