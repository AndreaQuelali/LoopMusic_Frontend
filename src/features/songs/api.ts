import { api } from '../../lib/api';

export type Song = {
  id: string;
  title: string;
  artist: string;
  coverUrl?: string | null;
  audioUrl?: string | null;
  createdAt: string;
};

export async function getSongs() {
  return api<Song[]>('/songs');
}
