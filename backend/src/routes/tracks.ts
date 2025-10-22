import { Router } from 'express';
import {
  getAllTracks,
  getTrackById,
  playTrack,
  getUserTracks,
  purchaseTrack,
} from '../controllers/trackController';
import { authenticateToken, optionalAuth } from '../middleware/auth';
import { validateTrackId } from '../middleware/validation';

const router = Router();

// Public routes
router.get('/', optionalAuth, getAllTracks);
router.get('/:id', validateTrackId, optionalAuth, getTrackById);

// Protected routes
router.get('/user/tracks', authenticateToken, getUserTracks);
router.post('/:id/play', authenticateToken, validateTrackId, playTrack);
router.post('/:id/purchase', authenticateToken, validateTrackId, purchaseTrack);

export default router;
