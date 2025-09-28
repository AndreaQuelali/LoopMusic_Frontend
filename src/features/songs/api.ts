import { api } from '../../lib/api';

export type Song = {
  id: string;
  title: string;
  artist: string;
  coverUrl?: string | null;
  audioUrl?: string | null;
  createdAt: string;
  playCount?: number;
};

export async function getSongs() {
  return api<Song[]>('/songs');
}

export async function getTopSongs() {
  return api<Song[]>('/songs/top');
}

export async function incrementPlay(songId: string) {
  return api<{ ok: true }>(`/songs/${songId}/play`, { method: 'POST' });
}
