import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import Logo from './Logo';
import { useAuth } from '../features/auth/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 rounded-md text-sm font-medium ${
      isActive ? 'text-brand' : 'text-white/80 hover:text-white'
    }`;

  return (
    <nav className="sticky top-0 z-30 backdrop-blur bg-black/30 border-b border-white/10">
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
          {!user ? (
            <>
              <Link to="/login" className="text-sm text-white/80 hover:text-white">Iniciar sesión</Link>
              <Link to="/register" className="text-sm bg-brand/90 hover:bg-brand text-white px-3 py-2 rounded-md">Registrarse</Link>
            </>
          ) : (
            <>
              <span className="text-sm text-white/80">Hola, <span className="text-white font-medium">{user.username}</span></span>
              <button onClick={logout} className="text-sm bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-md">Salir</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
