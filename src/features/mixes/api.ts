import { api } from '../../lib/api';
import type { Song } from '../songs/api';

export type Mix = {
  id: string;
  name: string;
  description?: string | null;
  isPublic: boolean;
  songIds: string[];
  createdAt: string;
};

export async function getMixes(): Promise<Mix[]> {
  return api<Mix[]>('/mixes');
}

export async function createMix(input: {
  name: string;
  description?: string;
  isPublic?: boolean;
  songIds: string[];
}): Promise<Mix> {
  return api<Mix>('/mixes', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function getMixSongs(mixId: string) {
  return api<Song[]>(`/mixes/${mixId}/songs`);
}

export async function getMix(mixId: string): Promise<Mix> {
  return api<Mix>(`/mixes/${mixId}`);
}

export async function addSongsToMix(mixId: string, songIds: string[]): Promise<Mix> {
  return api<Mix>(`/mixes/${mixId}/songs`, {
    method: 'POST',
    body: JSON.stringify({ songIds }),
  });
}

export async function removeSongFromMix(mixId: string, songId: string): Promise<Mix> {
  return api<Mix>(`/mixes/${mixId}/songs/${songId}`, { method: 'DELETE' });
}

export async function updateMixOrder(mixId: string, songIds: string[]): Promise<Mix> {
  return api<Mix>(`/mixes/${mixId}/order`, {
    method: 'PUT',
    body: JSON.stringify({ songIds }),
  });
}
