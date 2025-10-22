const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Initializing database with sample data...');

  // Create sample tracks
  const tracks = await Promise.all([
    prisma.track.create({
      data: {
        title: 'Sunset Dreams',
        artist: 'Luna Beats',
        price: 500,
        fileUrl: 'audio/sunset-dreams.mp3',
        duration: 240, // 4 minutes
        coverUrl: 'covers/sunset-dreams.jpg',
      },
    }),
    prisma.track.create({
      data: {
        title: 'Midnight Vibes',
        artist: 'Neon Nights',
        price: 750,
        fileUrl: 'audio/midnight-vibes.mp3',
        duration: 195, // 3:15
        coverUrl: 'covers/midnight-vibes.jpg',
      },
    }),
    prisma.track.create({
      data: {
        title: 'Ocean Waves',
        artist: 'Blue Horizon',
        price: 600,
        fileUrl: 'audio/ocean-waves.mp3',
        duration: 320, // 5:20
        coverUrl: 'covers/ocean-waves.jpg',
      },
    }),
    prisma.track.create({
      data: {
        title: 'City Lights',
        artist: 'Urban Pulse',
        price: 800,
        fileUrl: 'audio/city-lights.mp3',
        duration: 180, // 3:00
        coverUrl: 'covers/city-lights.jpg',
      },
    }),
    prisma.track.create({
      data: {
        title: 'Forest Echoes',
        artist: 'Nature Sounds',
        price: 450,
        fileUrl: 'audio/forest-echoes.mp3',
        duration: 280, // 4:40
        coverUrl: 'covers/forest-echoes.jpg',
      },
    }),
  ]);

  console.log(`✅ Created ${tracks.length} sample tracks`);

  // Create a test user
  const testUser = await prisma.user.create({
    data: {
      name: 'Test User',
      email: 'test@example.com',
      password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/7Kz8K2a', // password: "password123"
      phone: '+2250701234567',
    },
  });

  console.log('✅ Created test user (email: test@example.com, password: password123)');

  // Create some user tracks for the test user
  await prisma.userTrack.createMany({
    data: [
      {
        userId: testUser.id,
        trackId: tracks[0].id,
        remainingListens: 8, // Already listened 2 times
      },
      {
        userId: testUser.id,
        trackId: tracks[1].id,
        remainingListens: 10, // Fresh track
      },
    ],
  });

  console.log('✅ Created user tracks for test user');

  // Create some sample payments
  await prisma.payment.createMany({
    data: [
      {
        userId: testUser.id,
        amount: 500,
        status: 'completed',
        transactionId: 'test_txn_001',
        trackId: tracks[0].id,
      },
      {
        userId: testUser.id,
        amount: 750,
        status: 'completed',
        transactionId: 'test_txn_002',
        trackId: tracks[1].id,
      },
    ],
  });

  console.log('✅ Created sample payments');

  console.log('\n🎉 Database initialization completed!');
  console.log('\n📋 Summary:');
  console.log(`- ${tracks.length} tracks created`);
  console.log('- 1 test user created');
  console.log('- 2 user tracks created');
  console.log('- 2 payments created');
  console.log('\n🔑 Test credentials:');
  console.log('- Email: test@example.com');
  console.log('- Password: password123');
}

main()
  .catch((e) => {
    console.error('❌ Error during initialization:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
