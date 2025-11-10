import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { Song } from '../songs/api';
import { useAuth } from '../auth/AuthContext';
import { addFavorite, getFavoriteIds, removeFavorite } from './api';

const LS_KEY = 'loop_favorites_v1';

type Ctx = {
  favorites: Set<string>;
  isFavorite: (id: string | number) => boolean;
  toggleFavorite: (song: Song) => void;
  setFavorites: (ids: string[]) => void;
};

const FavoritesContext = createContext<Ctx | undefined>(undefined);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFav] = useState<Set<string>>(new Set());
  const { token } = useAuth();

  useEffect(() => {
    const load = async () => {
      try {
        if (token) {
          const ids = await getFavoriteIds();
          setFav(new Set(ids.map(String)));
        } else {
          const raw = localStorage.getItem(LS_KEY);
          if (raw) setFav(new Set(JSON.parse(raw)));
        }
      } catch {
        // fallback local if backend fails
        const raw = localStorage.getItem(LS_KEY);
        if (raw) setFav(new Set(JSON.parse(raw)));
      }
    };
    load();
  }, [token]);

  useEffect(() => {
    if (!token) {
      try {
        localStorage.setItem(LS_KEY, JSON.stringify(Array.from(favorites)));
      } catch {}
    }
  }, [favorites, token]);

  const isFavorite = (id: string | number) => favorites.has(String(id));

  const toggleFavorite = async (song: Song) => {
    const id = String(song.id);
    // optimistic update
    setFav(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
    try {
      if (token) {
        if (favorites.has(id)) {
          await removeFavorite(id);
        } else {
          await addFavorite(id);
        }
      }
    } catch {
      // revert on failure when using backend
      if (token) {
        setFav(prev => {
          const next = new Set(prev);
          if (next.has(id)) next.delete(id); else next.add(id);
          return next;
        });
      }
    }
  };

  const setFavorites = (ids: string[]) => setFav(new Set(ids.map(String)));

  const value = useMemo(() => ({ favorites, isFavorite, toggleFavorite, setFavorites }), [favorites]);

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavorites must be used within FavoritesProvider');
  return ctx;
}
