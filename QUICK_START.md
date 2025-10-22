# 🚀 Guide de Démarrage Rapide - PRP Music Platform

Ce guide vous permet de démarrer la plateforme PRP Music en quelques minutes.

## ⚡ Démarrage Ultra-Rapide (5 minutes)

### 1. Prérequis
- Node.js 18+ installé
- Un compte Supabase (gratuit)
- Un compte FedaPay (gratuit)

### 2. Installation
```bash
# Cloner et installer
git clone <repository-url>
cd prp-platform

# Installer les dépendances
npm install
cd backend && npm install && cd ..
```

### 3. Configuration Supabase (2 minutes)
1. Créez un projet sur [supabase.com](https://supabase.com)
2. Allez dans **Settings** > **API**
3. Copiez l'URL et les clés
4. Créez un bucket `music-files` dans **Storage**

### 4. Configuration FedaPay (1 minute)
1. Créez un compte sur [fedapay.com](https://fedapay.com)
2. Allez dans **Développement** > **Clés API**
3. Copiez la clé API Sandbox

### 5. Configuration des variables d'environnement

Créez `backend/.env` :
```env
# Database
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-ID].supabase.co:5432/postgres"

# JWT
JWT_SECRET="your-super-secret-jwt-key-here"
JWT_EXPIRES_IN="7d"

# Supabase
SUPABASE_URL="https://[PROJECT-ID].supabase.co"
SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# FedaPay
FEDAPAY_API_KEY="your-fedapay-api-key"
FEDAPAY_ENVIRONMENT="sandbox"

# Server
PORT=3001
NODE_ENV="development"
FRONTEND_URL="http://localhost:3000"
```

Créez `.env.local` :
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### 6. Initialisation de la base de données
```bash
cd backend
npx prisma generate
npx prisma db push
npm run db:init
```

### 7. Démarrage
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd ..
npm run dev
```

### 8. Test
- Ouvrez http://localhost:3000
- Créez un compte ou connectez-vous avec `test@example.com` / `password123`
- Explorez la plateforme !

## 🎯 Fonctionnalités Testables

### Compte de test inclus
- **Email** : test@example.com
- **Mot de passe** : password123
- **Pistes incluses** : 2 pistes déjà achetées

### Scénarios de test
1. **Parcourir le catalogue** : Voir les 5 pistes de démonstration
2. **Acheter une piste** : Tester le processus de paiement
3. **Écouter de la musique** : Utiliser le lecteur sécurisé
4. **Vérifier les écoutes** : Voir les écoutes restantes diminuer
5. **Dashboard** : Consulter l'historique et les statistiques

## 🔧 Configuration Avancée

### Ajouter vos propres pistes
1. Uploadez des fichiers audio dans Supabase Storage (`music-files/audio/`)
2. Uploadez des images de couverture (`music-files/covers/`)
3. Ajoutez les pistes via l'API ou directement en base :

```sql
INSERT INTO tracks (title, artist, price, fileUrl, duration, coverUrl) 
VALUES ('Ma Piste', 'Mon Artiste', 1000, 'audio/ma-piste.mp3', 180, 'covers/ma-piste.jpg');
```

### Personnaliser l'interface
- Modifiez les couleurs dans `src/app/globals.css`
- Ajoutez des composants dans `src/components/`
- Personnalisez les pages dans `src/app/`

## 🐛 Dépannage Rapide

### Erreur de connexion à la base de données
```bash
# Vérifiez l'URL de connexion
cd backend
npx prisma db push
```

### Erreur CORS
- Vérifiez que `FRONTEND_URL` est correct dans `backend/.env`
- Redémarrez le serveur backend

### Erreur de paiement
- Vérifiez que la clé FedaPay est correcte
- Vérifiez que vous êtes en mode sandbox

### Fichiers audio non accessibles
- Vérifiez que le bucket `music-files` existe dans Supabase
- Vérifiez les politiques de sécurité du bucket

## 📱 Test sur Mobile

1. Trouvez l'IP de votre machine : `ipconfig` (Windows) ou `ifconfig` (Mac/Linux)
2. Mettez à jour `FRONTEND_URL` dans `backend/.env` avec votre IP
3. Redémarrez le backend
4. Accédez à `http://[VOTRE-IP]:3000` depuis votre mobile

## 🚀 Déploiement Rapide

### Vercel (Frontend)
1. Connectez votre repo GitHub à Vercel
2. Configurez `NEXT_PUBLIC_API_URL` avec votre URL de production
3. Déployez !

### Railway (Backend)
1. Connectez votre repo à Railway
2. Configurez les variables d'environnement
3. Déployez !

## 📊 Monitoring

### Logs en temps réel
```bash
# Backend
cd backend && npm run dev

# Frontend
npm run dev
```

### Base de données
```bash
cd backend
npx prisma studio
```

## 🎵 Ajout de Contenu

### Via l'interface (recommandé)
1. Connectez-vous en tant qu'admin
2. Utilisez l'interface d'upload (à implémenter)

### Via l'API
```bash
curl -X POST http://localhost:3001/api/admin/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@track.mp3" \
  -F "title=Mon Titre" \
  -F "artist=Mon Artiste" \
  -F "price=1000"
```

## 🔐 Sécurité

### En développement
- Les URLs signées expirent en 1 heure
- Les fichiers ne sont pas téléchargeables
- Les écoutes sont limitées et tracées

### En production
- Utilisez HTTPS
- Configurez des domaines autorisés
- Surveillez les logs d'accès

## 📞 Support

- **Documentation complète** : Voir `README.md`
- **Configuration Supabase** : Voir `SUPABASE_SETUP.md`
- **Configuration FedaPay** : Voir `FEDAPAY_SETUP.md`
- **Issues** : Ouvrez une issue sur GitHub

---

🎉 **Félicitations !** Votre plateforme PRP Music est maintenant opérationnelle !

Pour des fonctionnalités avancées, consultez la documentation complète dans `README.md`.
