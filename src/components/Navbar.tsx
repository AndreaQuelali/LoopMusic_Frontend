import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import Logo from './Logo';
import { useAuth } from '../features/auth/AuthContext';
import { useTheme } from '../theme/ThemeContext';
import { Sun, Moon } from 'lucide-react';

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
        <div className="flex items-center gap-3">
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
            <>
              <button onClick={logout} className="text-sm bg-neutral-200 hover:bg-neutral-300 text-neutral-900 dark:bg-white/10 dark:hover:bg-white/20 dark:text-white px-3 py-2 rounded-md">Cerrar sesión</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

