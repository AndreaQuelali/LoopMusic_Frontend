import { api } from '../../lib/api';
import type { Song } from '../songs/api';

export async function getFavoriteIds(): Promise<string[]> {
  return api<string[]>('/favorites/ids');
}

export async function getFavoriteSongs(): Promise<Song[]> {
  return api<Song[]>('/favorites/songs');
}

export async function addFavorite(songId: string): Promise<{ ok: true }> {
  return api<{ ok: true }>(`/favorites/${songId}`, { method: 'POST' });
}

export async function removeFavorite(songId: string): Promise<{ ok: true }> {
  return api<{ ok: true }>(`/favorites/${songId}`, { method: 'DELETE' });
}
