'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import api from '../services/api';
import { Track } from '../types';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  track: Track | null;
  onPaymentSuccess: () => void;
}

export default function PaymentModal({
  isOpen,
  onClose,
  track,
  onPaymentSuccess,
}: PaymentModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('OM'); // Orange Money par défaut

  useEffect(() => {
    if (isOpen) {
      setError(null);
      setPhoneNumber('');
      setPaymentMethod('OM');
    }
  }, [isOpen]);

  const handlePayment = async () => {
    if (!track) return;
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post('/payment', {
        trackId: track.id,
        amount: track.price,
        phoneNumber,
        paymentMethod,
      });

      if (response.data.success) {
        // FedaPay redirection logic would go here
        // For now, simulate success
        alert('Paiement initié avec succès ! Suivez les instructions sur votre téléphone.');
        onPaymentSuccess();
        onClose();
      } else {
        setError(response.data.message || 'Échec de l\'initiation du paiement.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de l\'initiation du paiement.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
    }).format(price);
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-75" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 flex justify-between items-center"
                >
                  Acheter "{track?.title}"
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-500"
                    onClick={onClose}
                  >
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Vous êtes sur le point d'acheter la piste "{track?.title}" de {track?.artist} pour{' '}
                    <span className="font-bold text-gold-600">{formatPrice(track?.price || 0)}</span>.
                    Vous obtiendrez 10 écoutes pour cette piste.
                  </p>
                </div>

                {error && (
                  <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
                    {error}
                  </div>
                )}

                <div className="mt-4">
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                    Numéro de téléphone (pour le paiement)
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="phoneNumber"
                      id="phoneNumber"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-gold-500 focus:ring-gold-500 sm:text-sm"
                      placeholder="Ex: 771234567"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700">
                    Méthode de paiement
                  </label>
                  <div className="mt-1">
                    <select
                      id="paymentMethod"
                      name="paymentMethod"
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-gold-500 focus:ring-gold-500 sm:text-sm"
                    >
                      <option value="OM">Orange Money</option>
                      <option value="Wave">Wave</option>
                      <option value="FreeMoney">Free Money</option>
                      <option value="Visa">Carte Bancaire (Visa/Mastercard)</option>
                    </select>
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:ring-offset-2"
                    onClick={onClose}
                  >
                    Annuler
                  </button>
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-gradient-to-r from-gold-500 to-sunset-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:from-gold-600 hover:to-sunset-600 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handlePayment}
                    disabled={isLoading || !phoneNumber || !paymentMethod}
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      'Payer maintenant'
                    )}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}