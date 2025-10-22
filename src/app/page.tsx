'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { Track, UserTrack } from '@/types';
import { tracksAPI } from '@/services/api';
import TrackCard from '@/components/TrackCard';
import PaymentModal from '@/components/PaymentModal';
import { MusicalNoteIcon, UserIcon } from '@heroicons/react/24/outline';

export default function HomePage() {
  const { user, isAuthenticated } = useAuth();
  const [tracks, setTracks] = useState<Track[]>([]);
  const [userTracks, setUserTracks] = useState<UserTrack[]>([]);
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTracks();
    if (isAuthenticated) {
      loadUserTracks();
    }
  }, [isAuthenticated]);

  const loadTracks = async () => {
    try {
      const response = await tracksAPI.getAllTracks();
      if (response.success) {
        setTracks(response.data || []);
      }
    } catch (err: any) {
      setError('Failed to load tracks');
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserTracks = async () => {
    try {
      const response = await tracksAPI.getUserTracks();
      if (response.success) {
        setUserTracks(response.data || []);
      }
    } catch (err: any) {
      console.error('Failed to load user tracks:', err);
    }
  };

  const handleTrackUpdate = () => {
    loadUserTracks();
  };

  const handlePurchaseClick = (track: Track) => {
    if (!isAuthenticated) {
      // Redirect to login
      window.location.href = '/login';
      return;
    }
    setSelectedTrack(track);
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSuccess = () => {
    loadUserTracks();
    setSelectedTrack(null);
  };

  const getUserTrack = (trackId: number): UserTrack | undefined => {
    return userTracks.find(ut => ut.trackId === trackId);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading tracks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <MusicalNoteIcon className="w-8 h-8 text-gold-600" />
            <h1 className="text-xl font-bold bg-gradient-to-r from-gold-600 to-sunset-600 bg-clip-text text-transparent">Canabasse Music</h1>
          </div>
            
            <div className="flex items-center space-x-4">
              <a href="/artist" className="flex items-center space-x-2 group">
                <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-gold-500 shadow">
                  <Image src="/canabasse.png" alt="Canabasse" width={32} height={32} className="object-cover w-full h-full" />
                </div>
                <span className="text-sm text-gray-700 group-hover:text-gold-600">Artiste</span>
              </a>
              {isAuthenticated ? (
                <div className="flex items-center space-x-2">
                  <UserIcon className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-700">{user?.name}</span>
                  <a
                    href="/dashboard"
                    className="bg-gradient-to-r from-gold-500 to-sunset-500 text-white px-4 py-2 rounded-lg hover:from-gold-600 hover:to-sunset-600 transition-all duration-300 shadow-lg"
                  >
                    Tableau de bord
                  </a>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <a
                    href="/login"
                    className="text-gray-700 hover:text-gold-600 transition-colors"
                  >
                    Connexion
                  </a>
                  <a
                    href="/register"
                    className="bg-gradient-to-r from-gold-500 to-sunset-500 text-white px-4 py-2 rounded-lg hover:from-gold-600 hover:to-sunset-600 transition-all duration-300 shadow-lg"
                  >
                    S'inscrire
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="bg-gradient-to-r from-gold-500 to-sunset-500 bg-clip-text text-transparent mb-4">
            <h2 className="text-5xl font-bold mb-2">Découvrez la Musique de Canabasse</h2>
            <p className="text-2xl font-semibold">Artiste Sénégalais</p>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Écoutez les créations musicales exclusives de Canabasse avec un accès sécurisé et limité. 
            Payez par morceau et profitez d'une musique de qualité sans téléchargement.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Tracks Grid */}
        {tracks.length === 0 ? (
          <div className="text-center py-12">
            <MusicalNoteIcon className="w-16 h-16 text-gold-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune piste disponible</h3>
            <p className="text-gray-600">Revenez plus tard pour découvrir de nouvelles créations !</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {tracks.map((track) => {
              const userTrack = getUserTrack(track.id);
              return (
                <div key={track.id} className="relative">
                  <TrackCard
                    track={track}
                    userTrack={userTrack}
                    onTrackUpdate={handleTrackUpdate}
                  />
                  
                  {/* Purchase Button for non-owned tracks */}
                  {!userTrack && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-lg">
                      <button
                        onClick={() => handlePurchaseClick(track)}
                        className="bg-gradient-to-r from-gold-500 to-sunset-500 text-white px-6 py-3 rounded-lg font-medium hover:from-gold-600 hover:to-sunset-600 transition-all duration-300 shadow-lg"
                      >
                        Acheter la piste
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Payment Modal */}
      {selectedTrack && (
        <PaymentModal
          track={selectedTrack}
          isOpen={isPaymentModalOpen}
          onClose={() => {
            setIsPaymentModalOpen(false);
            setSelectedTrack(null);
          }}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}