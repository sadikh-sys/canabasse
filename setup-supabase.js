const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Configuration Supabase
const SUPABASE_URL = 'https://bzmcpicblcosyppuezhi.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ6bWNwaWNibGNvc3lwcHVlemhpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3MDYxNTEsImV4cCI6MjA3NjI4MjE1MX0.7ugFkgcTnc9W-_uPsZoC3LReOps3YsVrgs-0XWNBl_0';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function setupSupabase() {
  console.log('🔧 Configuration de Supabase...');
  
  try {
    // Vérifier la connexion
    const { data, error } = await supabase.from('_supabase_migrations').select('*').limit(1);
    
    if (error && error.code !== 'PGRST116') {
      console.error('❌ Erreur de connexion à Supabase:', error.message);
      return;
    }
    
    console.log('✅ Connexion à Supabase réussie');
    
    // Créer le bucket music-files s'il n'existe pas
    console.log('📁 Création du bucket music-files...');
    
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error('❌ Erreur lors de la récupération des buckets:', bucketsError.message);
      return;
    }
    
    const musicFilesBucket = buckets.find(bucket => bucket.name === 'music-files');
    
    if (!musicFilesBucket) {
      const { data: bucketData, error: bucketError } = await supabase.storage.createBucket('music-files', {
        public: true,
        allowedMimeTypes: ['audio/*', 'image/*'],
        fileSizeLimit: 50 * 1024 * 1024 // 50MB
      });
      
      if (bucketError) {
        console.error('❌ Erreur lors de la création du bucket:', bucketError.message);
        return;
      }
      
      console.log('✅ Bucket music-files créé');
    } else {
      console.log('✅ Bucket music-files existe déjà');
    }
    
    console.log('\n🎉 Configuration Supabase terminée !');
    console.log('\n📋 Prochaines étapes :');
    console.log('1. Récupérez votre SERVICE_ROLE_KEY dans Supabase Settings > API');
    console.log('2. Récupérez votre mot de passe de base de données');
    console.log('3. Créez le fichier backend/.env avec vos informations');
    console.log('4. Exécutez: cd backend && npx prisma db push');
    console.log('5. Exécutez: cd backend && npm run db:init');
    
  } catch (error) {
    console.error('❌ Erreur lors de la configuration:', error.message);
  }
}

setupSupabase();
