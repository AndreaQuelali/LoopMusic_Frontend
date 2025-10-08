import { api } from '../../lib/api';
import type { Song } from '../songs/api';

export async function getRecentlySongs(): Promise<Song[]> {
  return api<Song[]>('/recently/songs');
}

export async function addRecently(songId: string): Promise<{ ok: true }> {
  return api<{ ok: true }>(`/recently/${songId}`, { method: 'POST' });
}
