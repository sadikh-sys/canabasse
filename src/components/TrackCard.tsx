'use client';

import React, { useState } from 'react';
import { PlayIcon, CurrencyDollarIcon, ClockIcon } from '@heroicons/react/24/outline';
import { Track, UserTrack } from '@/types';
import { tracksAPI } from '@/services/api';
import AudioPlayer from './AudioPlayer';

interface TrackCardProps {
  track: Track;
  userTrack?: UserTrack;
  onTrackUpdate?: () => void;
}

const TrackCard: React.FC<TrackCardProps> = ({ track, userTrack, onTrackUpdate }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playData, setPlayData] = useState<{
    playUrl: string;
    remainingListens: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePlay = async () => {
    if (!userTrack) {
      setError('Vous devez d\'abord acheter cette piste');
      return;
    }

    if (userTrack.remainingListens <= 0) {
      setError("Vous n'avez plus d'écoutes restantes pour cette piste");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await tracksAPI.playTrack(track.id);
      
      if (response.success) {
        setPlayData({
          playUrl: response.data.playUrl,
          remainingListens: response.data.remainingListens,
        });
        setIsPlaying(true);
        onTrackUpdate?.();
      } else {
        setError("Échec de la lecture de la piste");
      }
    } catch (err: any) {
      setError(err.message || "Échec de la lecture de la piste");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlayComplete = () => {
    setIsPlaying(false);
    setPlayData(null);
  };

  const handleListenConsumed = () => {
    onTrackUpdate?.();
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return 'Inconnu';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
    }).format(price);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* Cover Image */}
      <div className="aspect-square bg-gradient-to-br from-gold-500 to-sunset-500 relative">
        {track.coverUrl ? (
          <img
            src={track.coverUrl}
            alt={`${track.title} cover`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <PlayIcon className="w-16 h-16 text-white opacity-70" />
          </div>
        )}
        
        {/* Play Button Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
          <button
            onClick={handlePlay}
            disabled={isLoading || !userTrack || userTrack.remainingListens <= 0}
            className="bg-white bg-opacity-90 text-gray-900 rounded-full p-3 hover:bg-opacity-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
            ) : (
              <PlayIcon className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Track Info */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 truncate">{track.title}</h3>
        <p className="text-gray-600 text-sm truncate">{track.artist}</p>
        
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <CurrencyDollarIcon className="w-4 h-4" />
              <span>{formatPrice(track.price)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <ClockIcon className="w-4 h-4" />
              <span>{formatDuration(track.duration)}</span>
            </div>
          </div>
        </div>

        {/* User Track Info */}
        {userTrack && (
          <div className="mt-3 p-2 bg-gold-50 rounded-lg">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gold-800">Votre piste</span>
              <span className="text-gold-700 font-medium">
                {userTrack.remainingListens} écoutes restantes
              </span>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}
      </div>

      {/* Audio Player Modal */}
      {isPlaying && playData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold">Lecture en cours</h3>
              <button
                onClick={() => setIsPlaying(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="p-4">
              <AudioPlayer
                track={track}
                playUrl={playData.playUrl}
                remainingListens={playData.remainingListens}
                onPlayComplete={handlePlayComplete}
                onListenConsumed={handleListenConsumed}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackCard;
