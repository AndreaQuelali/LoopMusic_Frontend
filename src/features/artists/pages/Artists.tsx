import React from 'react';
import Navbar from '../../../components/Navbar';

export default function Artists() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container-responsive py-6">
        <h2 className="text-2xl font-semibold">Artistas</h2>
        <p className="mt-2 text-neutral-600 dark:text-neutral-300">Explora artistas destacados (pendiente de implementación).</p>
      </main>
    </div>
  );
}
