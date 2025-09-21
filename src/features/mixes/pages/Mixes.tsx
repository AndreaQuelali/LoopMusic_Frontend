import React from 'react';
import Navbar from '../../../components/Navbar';

export default function Mixes() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container-responsive py-6">
        <h2 className="text-2xl font-semibold">Mezclas</h2>
        <p className="mt-2 text-neutral-600 dark:text-neutral-300">Explora mixes y playlists (pendiente de implementación).</p>
      </main>
    </div>
  );
}
