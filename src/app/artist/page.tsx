'use client';

import React from 'react';
import Image from 'next/image';
import { MusicalNoteIcon } from '@heroicons/react/24/outline';

export default function ArtistPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <a href="/" className="flex items-center space-x-2 group">
                <MusicalNoteIcon className="w-8 h-8 text-gold-600 group-hover:text-sunset-600 transition-colors" />
                <h1 className="text-xl font-bold bg-gradient-to-r from-gold-600 to-sunset-600 bg-clip-text text-transparent group-hover:from-sunset-600 group-hover:to-gold-600 transition-all">Canabasse Music</h1>
              </a>
            </div>
            <nav className="flex items-center space-x-4">
              <a href="/" className="text-gray-700 hover:text-gold-600">Accueil</a>
              <a href="/dashboard" className="text-gray-700 hover:text-gold-600">Tableau de bord</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-gold-600 to-sunset-600 bg-clip-text text-transparent mb-4">Canabasse</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Artiste sénégalais, Canabasse propose une musique urbaine aux sonorités modernes, 
              mêlant rap, mélodies et textes engagés. Retrouvez ici ses créations exclusives à écouter en streaming sécurisé.
            </p>
            <div className="mt-6 flex items-center space-x-3">
              <a href="/" className="bg-gradient-to-r from-gold-500 to-sunset-500 text-white px-5 py-2 rounded-lg hover:from-gold-600 hover:to-sunset-600 transition-all shadow-lg">Voir le catalogue</a>
              <a href="/register" className="text-gray-700 hover:text-gold-600">S'inscrire</a>
            </div>
          </div>
          <div className="relative w-full h-64 md:h-96 rounded-2xl overflow-hidden shadow-hard">
            <img 
              src="/canabasse.png" 
              alt="Canabasse" 
              className="w-full h-full object-cover"
              onError={(e) => {
                console.log('Image error:', e);
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        </div>
      </section>

      {/* Info cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-soft p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Écoute sécurisée</h3>
            <p className="text-gray-600">Accès limité par piste, sans téléchargement ni partage, avec URLs signées.</p>
          </div>
          <div className="bg-white rounded-xl shadow-soft p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Paiement simple</h3>
            <p className="text-gray-600">Payez par mobile money ou carte avec FedaPay (Orange, Wave, Visa...).</p>
          </div>
          <div className="bg-white rounded-xl shadow-soft p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Qualité</h3>
            <p className="text-gray-600">Streaming fluide et responsive pour profiter des titres de Canabasse.</p>
          </div>
        </div>
      </section>
    </div>
  );
}


