'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UserTrack, Payment } from '@/types';
import { tracksAPI, paymentsAPI } from '@/services/api';
import TrackCard from '@/components/TrackCard';
import { 
  MusicalNoteIcon, 
  ClockIcon, 
  CurrencyDollarIcon,
  ChartBarIcon,
  PlayIcon
} from '@heroicons/react/24/outline';

export default function DashboardPage() {
  const { user, isAuthenticated, logout } = useAuth();
  const [userTracks, setUserTracks] = useState<UserTrack[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }
    loadDashboardData();
  }, [isAuthenticated]);

  const loadDashboardData = async () => {
    try {
      const [tracksResponse, paymentsResponse] = await Promise.all([
        tracksAPI.getUserTracks(),
        paymentsAPI.getUserPayments(),
      ]);

      if (tracksResponse.success) {
        setUserTracks(tracksResponse.data || []);
      }

      if (paymentsResponse.success) {
        setPayments(paymentsResponse.data || []);
      }
    } catch (err: any) {
      setError('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTrackUpdate = () => {
    loadDashboardData();
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const totalSpent = payments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalTracks = userTracks.length;
  const totalListens = userTracks.reduce((sum, ut) => sum + (10 - ut.remainingListens), 0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gold-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Chargement du tableau de bord...</p>
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
              <a href="/" className="flex items-center space-x-2 group">
                <MusicalNoteIcon className="w-8 h-8 text-gold-600 group-hover:text-sunset-600 transition-colors" />
                <h1 className="text-xl font-bold bg-gradient-to-r from-gold-600 to-sunset-600 bg-clip-text text-transparent group-hover:from-sunset-600 group-hover:to-gold-600 transition-all">Canabasse Music</h1>
              </a>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Bienvenue, {user?.name}</span>
              <a
                href="/"
                className="text-gray-700 hover:text-gold-600 transition-colors"
              >
                Catalogue
              </a>
              <button
                onClick={logout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <MusicalNoteIcon className="h-8 w-8 text-gold-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Pistes achetées
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">{totalTracks}</dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <PlayIcon className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Écoutes effectuées
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">{totalListens}</dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CurrencyDollarIcon className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total dépensé
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">{formatPrice(totalSpent)}</dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ChartBarIcon className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Moy. par piste
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {totalTracks > 0 ? Math.round(totalListens / totalTracks) : 0}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* My Tracks */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Mes pistes</h2>
          
          {userTracks.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <MusicalNoteIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Pas encore de pistes</h3>
              <p className="text-gray-600 mb-4">Commencez par acheter des pistes depuis le catalogue !</p>
              <a
                href="/"
                className="bg-gradient-to-r from-gold-500 to-sunset-500 text-white px-6 py-3 rounded-lg hover:from-gold-600 hover:to-sunset-600 transition-all duration-300 shadow-lg"
              >
                Voir le catalogue
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {userTracks.map((userTrack) => (
                <TrackCard
                  key={userTrack.id}
                  track={userTrack.track}
                  userTrack={userTrack}
                  onTrackUpdate={handleTrackUpdate}
                />
              ))}
            </div>
          )}
        </div>

        {/* Recent Payments */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Paiements récents</h2>
          
          {payments.length === 0 ? (
            <div className="text-center py-8 bg-white rounded-lg shadow">
              <CurrencyDollarIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Aucun paiement pour le moment</p>
            </div>
          ) : (
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {payments.slice(0, 10).map((payment) => (
                  <li key={payment.id} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <CurrencyDollarIcon className="h-6 w-6 text-gray-400" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {formatPrice(payment.amount)}
                          </div>
                          <div className="text-sm text-gray-500">
                            {formatDate(payment.createdAt)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          payment.status === 'completed' 
                            ? 'bg-green-100 text-green-800'
                            : payment.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {payment.status}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
