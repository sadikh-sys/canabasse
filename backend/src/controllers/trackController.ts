import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../types';
import databaseService from '../services/database';
import supabaseService from '../services/supabase';

export const getAllTracks = async (req: Request, res: Response) => {
  try {
    const tracks = await databaseService.getAllTracks();
    
    res.json({
      success: true,
      data: tracks,
    });
  } catch (error) {
    console.error('Get tracks error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch tracks',
    });
  }
};

export const getTrackById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const trackId = parseInt(id);

    const track = await databaseService.getTrackById(trackId);
    if (!track) {
      return res.status(404).json({
        success: false,
        message: 'Track not found',
      });
    }

    res.json({
      success: true,
      data: track,
    });
  } catch (error) {
    console.error('Get track error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch track',
    });
  }
};

export const playTrack = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const trackId = parseInt(id);
    const userId = req.user!.id;

    // Check if track exists
    const track = await databaseService.getTrackById(trackId);
    if (!track) {
      return res.status(404).json({
        success: false,
        message: 'Track not found',
      });
    }

    // Check if user has access to this track
    let userTrack = await databaseService.getUserTrack(userId, trackId);
    
    if (!userTrack) {
      // User doesn't have access, they need to purchase it
      return res.status(403).json({
        success: false,
        message: 'You need to purchase this track to listen to it',
        data: {
          trackId,
          price: track.price,
        },
      });
    }

    // Check if user has remaining listens
    if (userTrack.remainingListens <= 0) {
      return res.status(403).json({
        success: false,
        message: 'You have no remaining listens for this track',
        data: {
          trackId,
          remainingListens: 0,
        },
      });
    }

    // Generate signed URL for secure access
    const signedUrlResult = await supabaseService.getSignedUrl(
      'music-files',
      track.fileUrl,
      3600 // 1 hour expiry
    );

    if (signedUrlResult.error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to generate secure access URL',
      });
    }

    // Decrement remaining listens
    await databaseService.decrementRemainingListens(userId, trackId);

    // Get updated user track data
    const updatedUserTrack = await databaseService.getUserTrack(userId, trackId);

    res.json({
      success: true,
      data: {
        track: {
          id: track.id,
          title: track.title,
          artist: track.artist,
          duration: track.duration,
          coverUrl: track.coverUrl,
        },
        playUrl: signedUrlResult.data!.signedUrl,
        remainingListens: updatedUserTrack!.remainingListens,
      },
    });
  } catch (error) {
    console.error('Play track error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to play track',
    });
  }
};

export const getUserTracks = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const userTracks = await databaseService.getUserTracks(userId);

    res.json({
      success: true,
      data: userTracks,
    });
  } catch (error) {
    console.error('Get user tracks error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user tracks',
    });
  }
};

export const purchaseTrack = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const trackId = parseInt(id);
    const userId = req.user!.id;

    // Check if track exists
    const track = await databaseService.getTrackById(trackId);
    if (!track) {
      return res.status(404).json({
        success: false,
        message: 'Track not found',
      });
    }

    // Check if user already has this track
    const existingUserTrack = await databaseService.getUserTrack(userId, trackId);
    if (existingUserTrack) {
      return res.status(409).json({
        success: false,
        message: 'You already own this track',
      });
    }

    // Create user track (this would typically be done after successful payment)
    const userTrack = await databaseService.createUserTrack(userId, trackId);

    res.json({
      success: true,
      message: 'Track purchased successfully',
      data: userTrack,
    });
  } catch (error) {
    console.error('Purchase track error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to purchase track',
    });
  }
};
