import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../../../components/Logo';
import { register } from '../api';
import { useAuth } from '../AuthContext';

export default function Register() {
  const navigate = useNavigate();
  const { setAuth } = useAuth();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await register({ email, username, password });
      setAuth(res);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="min-h-screen grid md:grid-cols-2">
      <div className="hidden md:block bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=2069&auto=format&fit=crop)' }} />
      <div className="bg-black/70 md:bg-transparent backdrop-blur flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-6">
          <Logo className="mb-6" />
          <h1 className="text-2xl font-bold">Crear cuenta</h1>
          {error && <div className="text-sm text-red-400">{error}</div>}
          <form className="space-y-4" onSubmit={onSubmit}>
            <div>
              <label className="block text-sm mb-1">Nombre de usuario</label>
              <input value={username} onChange={(e)=>setUsername(e.target.value)} type="text" className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand" placeholder="Ingresa tu nickname" required />
            </div>
            <div>
              <label className="block text-sm mb-1">Correo electrónico</label>
              <input value={email} onChange={(e)=>setEmail(e.target.value)} type="email" className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand" placeholder="Ingresa tu correo electrónico" required />
            </div>
            <div>
              <label className="block text-sm mb-1">Contraseña</label>
              <input value={password} onChange={(e)=>setPassword(e.target.value)} type="password" className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand" placeholder="Ingresa tu contraseña" required />
            </div>
            <button disabled={loading} type="submit" className="w-full bg-brand/90 hover:bg-brand text-white rounded-md px-4 py-2 font-medium disabled:opacity-60">{loading ? 'Registrando...' : 'Registrarse'}</button>
          </form>
          <p className="text-sm text-white/70">¿Ya tienes una cuenta? <Link className="text-brand" to="/login">Inicia sesión</Link></p>
        </div>
      </div>
    </div>
  );
}
