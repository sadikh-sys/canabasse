import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import axios from 'axios';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Payment API is running',
    timestamp: new Date().toISOString()
  });
});

// Créer un paiement FedaPay
app.post('/api/payment/create', async (req, res) => {
  try {
    const { amount, trackId, userId, paymentMethod, phone } = req.body;

    // Validation
    if (!amount || !userId || !paymentMethod) {
      return res.status(400).json({
        success: false,
        message: 'Paramètres manquants'
      });
    }

    // Créer la transaction FedaPay
    const fedapayResponse = await axios.post('https://api.fedapay.com/v1/transactions', {
      amount: Math.round(amount * 100), // Convertir en centimes
      currency: 'XOF',
      description: `Paiement piste ${trackId || 'Canabasse Music'}`,
      callback_url: `${process.env.FRONTEND_URL}/payment-callback`,
      customer: {
        email: phone ? `${phone}@canabasse.com` : 'user@canabasse.com',
        phone: phone || undefined
      }
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.FEDAPAY_SECRET_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const transaction = fedapayResponse.data.data;

    // Enregistrer le paiement dans Supabase
    const { data: payment, error } = await supabase
      .from('payments')
      .insert({
        user_id: userId,
        amount: amount,
        status: 'pending',
        transaction_id: transaction.id,
        track_id: trackId || null
      })
      .select()
      .single();

    if (error) {
      console.error('Erreur Supabase:', error);
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de l\'enregistrement du paiement'
      });
    }

    res.json({
      success: true,
      data: {
        paymentId: payment.id,
        transactionId: transaction.id,
        amount: amount,
        status: 'pending',
        paymentUrl: transaction.hosted_url,
        trackId: trackId
      }
    });

  } catch (error) {
    console.error('Erreur paiement:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création du paiement'
    });
  }
});

// Vérifier le statut d'un paiement
app.post('/api/payment/verify', async (req, res) => {
  try {
    const { transactionId } = req.body;

    if (!transactionId) {
      return res.status(400).json({
        success: false,
        message: 'Transaction ID manquant'
      });
    }

    // Vérifier avec FedaPay
    const fedapayResponse = await axios.get(`https://api.fedapay.com/v1/transactions/${transactionId}`, {
      headers: {
        'Authorization': `Bearer ${process.env.FEDAPAY_SECRET_KEY}`
      }
    });

    const transaction = fedapayResponse.data.data;
    const status = transaction.status === 'approved' ? 'completed' : 'failed';

    // Mettre à jour dans Supabase
    const { error } = await supabase
      .from('payments')
      .update({ status })
      .eq('transaction_id', transactionId);

    if (error) {
      console.error('Erreur mise à jour:', error);
    }

    // Si le paiement est validé, ajouter la piste à l'utilisateur
    if (status === 'completed') {
      const { data: payment } = await supabase
        .from('payments')
        .select('user_id, track_id')
        .eq('transaction_id', transactionId)
        .single();

      if (payment && payment.track_id) {
        await supabase
          .from('user_tracks')
          .upsert({
            user_id: payment.user_id,
            track_id: payment.track_id,
            remaining_listens: 10
          });
      }
    }

    res.json({
      success: true,
      data: {
        status,
        transactionId
      }
    });

  } catch (error) {
    console.error('Erreur vérification:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la vérification du paiement'
    });
  }
});

// Obtenir les paiements d'un utilisateur
app.get('/api/payments/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const { data: payments, error } = await supabase
      .from('payments')
      .select(`
        *,
        tracks (
          id,
          title,
          artist,
          cover_url
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erreur Supabase:', error);
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des paiements'
      });
    }

    res.json({
      success: true,
      data: payments
    });

  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Payment API running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`💳 Payment routes: http://localhost:${PORT}/api/payment`);
});

export default app;
