# Configuration Supabase pour PRP Music Platform

Ce guide vous explique comment configurer Supabase pour la plateforme PRP Music.

## 1. Créer un projet Supabase

1. Allez sur [supabase.com](https://supabase.com)
2. Créez un compte ou connectez-vous
3. Cliquez sur "New Project"
4. Choisissez votre organisation
5. Nommez votre projet : `prp-music-platform`
6. Créez un mot de passe fort pour la base de données
7. Sélectionnez une région proche de vos utilisateurs
8. Cliquez sur "Create new project"

## 2. Récupérer les informations de connexion

Une fois le projet créé :

1. Allez dans **Settings** > **API**
2. Copiez les informations suivantes :
   - **Project URL** : `https://your-project-id.supabase.co`
   - **anon public** : Clé publique anonyme
   - **service_role** : Clé de service (gardez-la secrète)

## 3. Configurer la base de données

### Option A : Utiliser l'URL de connexion Supabase

1. Allez dans **Settings** > **Database**
2. Copiez la **Connection string** sous "Connection parameters"
3. Remplacez `[YOUR-PASSWORD]` par votre mot de passe de base de données
4. Utilisez cette URL dans votre fichier `.env` backend

### Option B : Utiliser les paramètres individuels

Utilisez ces informations dans votre `.env` :
```env
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-ID].supabase.co:5432/postgres"
```

## 4. Configurer le stockage des fichiers

1. Allez dans **Storage** dans le menu de gauche
2. Cliquez sur **Create a new bucket**
3. Nommez le bucket : `music-files`
4. Cochez **Public bucket** (pour les images de couverture)
5. Cliquez sur **Create bucket**

### Configurer les politiques de sécurité

1. Allez dans **Storage** > **Policies**
2. Cliquez sur **New Policy** pour le bucket `music-files`

#### Politique pour les fichiers audio (privés)
```sql
-- Politique pour permettre la lecture des fichiers audio (URLs signées)
CREATE POLICY "Allow signed URL access to audio files" ON storage.objects
FOR SELECT USING (
  bucket_id = 'music-files' 
  AND auth.role() = 'authenticated'
);
```

#### Politique pour les images de couverture (publiques)
```sql
-- Politique pour permettre la lecture publique des images de couverture
CREATE POLICY "Allow public read access to cover images" ON storage.objects
FOR SELECT USING (
  bucket_id = 'music-files' 
  AND name LIKE 'covers/%'
);
```

#### Politique pour l'upload (admin seulement)
```sql
-- Politique pour permettre l'upload de fichiers (admin seulement)
CREATE POLICY "Allow admin upload to music files" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'music-files' 
  AND auth.role() = 'service_role'
);
```

## 5. Configurer les variables d'environnement

Mettez à jour votre fichier `.env` dans le dossier `backend` :

```env
# Supabase Configuration
SUPABASE_URL="https://your-project-id.supabase.co"
SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# Database (utilisez l'URL de connexion Supabase)
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-ID].supabase.co:5432/postgres"
```

## 6. Tester la connexion

1. Dans votre terminal, allez dans le dossier `backend`
2. Exécutez : `npx prisma db push`
3. Vérifiez que les tables sont créées dans l'onglet **Table Editor** de Supabase

## 7. Uploader des fichiers de test

### Via l'interface Supabase
1. Allez dans **Storage** > **music-files**
2. Cliquez sur **Upload file**
3. Uploadez quelques fichiers audio et images de couverture

### Via l'API (recommandé)
Utilisez l'endpoint `/api/admin/upload` de votre backend pour uploader des fichiers.

## 8. Structure des fichiers recommandée

```
music-files/
├── audio/
│   ├── track-1.mp3
│   ├── track-2.mp3
│   └── ...
├── covers/
│   ├── track-1-cover.jpg
│   ├── track-2-cover.jpg
│   └── ...
└── temp/
    └── (fichiers temporaires d'upload)
```

## 9. Sécurité et bonnes pratiques

### URLs signées
- Utilisez toujours des URLs signées pour les fichiers audio
- Les URLs signées expirent automatiquement (1 heure par défaut)
- Ne partagez jamais les URLs signées publiquement

### Gestion des permissions
- Les utilisateurs authentifiés peuvent lire les fichiers audio
- Les images de couverture sont publiques
- Seul le service role peut uploader des fichiers

### Monitoring
- Surveillez l'utilisation du stockage dans le dashboard Supabase
- Configurez des alertes pour les limites de stockage
- Surveillez les logs d'accès aux fichiers

## 10. Dépannage

### Erreur de connexion à la base de données
- Vérifiez que l'URL de connexion est correcte
- Vérifiez que le mot de passe est correct
- Vérifiez que l'IP n'est pas bloquée

### Erreur d'accès aux fichiers
- Vérifiez que les politiques de sécurité sont correctement configurées
- Vérifiez que vous utilisez la bonne clé API
- Vérifiez que le bucket existe et est accessible

### Problèmes de performance
- Utilisez le CDN de Supabase pour les images
- Optimisez la taille des fichiers audio
- Configurez la mise en cache appropriée

## 11. Limites du plan gratuit

- **Base de données** : 500 MB
- **Stockage** : 1 GB
- **Bande passante** : 2 GB/mois
- **Connexions simultanées** : 60

Pour la production, considérez passer au plan Pro.

## 12. Migration vers la production

1. Créez un nouveau projet Supabase pour la production
2. Configurez les mêmes politiques de sécurité
3. Migrez vos données de test
4. Mettez à jour les variables d'environnement de production
5. Configurez les domaines autorisés pour CORS

---

Pour plus d'informations, consultez la [documentation officielle de Supabase](https://supabase.com/docs).
