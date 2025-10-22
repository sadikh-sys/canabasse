'use client';

import React, { useState, useRef, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { PlayIcon, PauseIcon, SpeakerWaveIcon, SpeakerXMarkIcon } from '@heroicons/react/24/solid';

interface AudioPlayerProps {
  track: {
    id: number;
    title: string;
    artist: string;
    duration?: number;
    coverUrl?: string;
  };
  playUrl: string;
  remainingListens: number;
  onPlayComplete?: () => void;
  onListenConsumed?: () => void;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({
  track,
  playUrl,
  remainingListens,
  onPlayComplete,
  onListenConsumed,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [played, setPlayed] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const playerRef = useRef<ReactPlayer>(null);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlay = () => {
    if (remainingListens <= 0) {
      alert("Vous n'avez plus d'écoutes pour cette piste");
      return;
    }

    if (!hasStarted) {
      setHasStarted(true);
      onListenConsumed?.();
    }

    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setPlayed(0);
    onPlayComplete?.();
  };

  const handleProgress = (state: { played: number; playedSeconds: number }) => {
    setPlayed(state.playedSeconds);
  };

  const handleDuration = (duration: number) => {
    setDuration(duration);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seekTo = parseFloat(e.target.value);
    setPlayed(seekTo);
    playerRef.current?.seekTo(seekTo);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      setVolume(0.8);
    } else {
      setIsMuted(true);
      setVolume(0);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
      {/* Track Info */}
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-gray-900">{track.title}</h3>
        <p className="text-gray-600">{track.artist}</p>
        {track.coverUrl && (
          <img
            src={track.coverUrl}
            alt={`${track.title} cover`}
            className="w-32 h-32 mx-auto mt-4 rounded-lg object-cover"
          />
        )}
      </div>

      {/* Remaining Listens */}
      <div className="text-center mb-4">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gold-100 text-gold-800">
          {remainingListens} écoutes restantes
        </span>
      </div>

      {/* Hidden ReactPlayer */}
      <div className="hidden">
        <ReactPlayer
          ref={playerRef}
          url={playUrl}
          playing={isPlaying}
          onEnded={handleEnded}
          onProgress={handleProgress}
          onDuration={handleDuration}
          volume={isMuted ? 0 : volume}
          config={{
            file: {
              attributes: {
                controlsList: 'nodownload nofullscreen noremoteplayback',
                disablePictureInPicture: true,
              },
            },
          }}
        />
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <input
          type="range"
          min={0}
          max={duration || 0}
          value={played}
          onChange={handleSeek}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
        />
        <div className="flex justify-between text-sm text-gray-500 mt-1">
          <span>{formatTime(played)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center space-x-4">
        <button
          onClick={isPlaying ? handlePause : handlePlay}
          disabled={remainingListens <= 0}
          className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-gold-500 to-sunset-500 text-white rounded-full hover:from-gold-600 hover:to-sunset-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isPlaying ? (
            <PauseIcon className="w-6 h-6" />
          ) : (
            <PlayIcon className="w-6 h-6 ml-1" />
          )}
        </button>

        <button
          onClick={toggleMute}
          className="flex items-center justify-center w-10 h-10 text-gray-600 hover:text-gray-800 transition-colors"
        >
          {isMuted ? (
            <SpeakerXMarkIcon className="w-6 h-6" />
          ) : (
            <SpeakerWaveIcon className="w-6 h-6" />
          )}
        </button>

        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Volume</span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.1}
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="w-20 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>
      </div>

      {/* Security Notice */}
      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-xs text-yellow-800 text-center">
          🔒 Piste protégée. Téléchargement et partage désactivés.
        </p>
      </div>
    </div>
  );
};

export default AudioPlayer;
