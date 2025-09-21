import React from 'react';
import Navbar from '../../../components/Navbar';

export default function Genres() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container-responsive py-6">
        <h2 className="text-2xl font-semibold">Géneros</h2>
        <p className="mt-2 text-neutral-600 dark:text-neutral-300">Muy pronto podrás explorar los géneros musicales.</p>
      </main>
    </div>
  );
}
