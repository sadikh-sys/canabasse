import { PrismaClient } from '@prisma/client';

class DatabaseService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
    });
  }

  // User operations
  async createUser(userData: {
    name: string;
    email: string;
    password: string;
    phone?: string;
  }) {
    return await this.prisma.user.create({
      data: userData,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findUserByEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findUserById(id: number) {
    return await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        createdAt: true,
        updatedAt: true,
        tracks: {
          include: {
            track: true,
          },
        },
        payments: true,
      },
    });
  }

  // Track operations
  async createTrack(trackData: {
    title: string;
    artist: string;
    price: number;
    fileUrl: string;
    duration?: number;
    coverUrl?: string;
  }) {
    return await this.prisma.track.create({
      data: trackData,
    });
  }

  async getAllTracks() {
    return await this.prisma.track.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async getTrackById(id: number) {
    return await this.prisma.track.findUnique({
      where: { id },
    });
  }

  // UserTrack operations
  async createUserTrack(userId: number, trackId: number) {
    return await this.prisma.userTrack.create({
      data: {
        userId,
        trackId,
        remainingListens: 10,
      },
      include: {
        track: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async getUserTrack(userId: number, trackId: number) {
    return await this.prisma.userTrack.findUnique({
      where: {
        userId_trackId: {
          userId,
          trackId,
        },
      },
      include: {
        track: true,
      },
    });
  }

  async getUserTracks(userId: number) {
    return await this.prisma.userTrack.findMany({
      where: { userId },
      include: {
        track: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async decrementRemainingListens(userId: number, trackId: number) {
    return await this.prisma.userTrack.updateMany({
      where: {
        userId,
        trackId,
        remainingListens: {
          gt: 0,
        },
      },
      data: {
        remainingListens: {
          decrement: 1,
        },
      },
    });
  }

  // Payment operations
  async createPayment(paymentData: {
    userId: number;
    amount: number;
    status: string;
    transactionId: string;
    trackId?: number;
  }) {
    return await this.prisma.payment.create({
      data: paymentData,
    });
  }

  async updatePaymentStatus(transactionId: string, status: string) {
    return await this.prisma.payment.update({
      where: { transactionId },
      data: { status },
    });
  }

  async getUserPayments(userId: number) {
    return await this.prisma.payment.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Cleanup operations
  async disconnect() {
    await this.prisma.$disconnect();
  }
}

export default new DatabaseService();
