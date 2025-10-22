# PRP Music Platform

Une plateforme musicale sécurisée permettant aux utilisateurs d'écouter de la musique en streaming avec un accès limité et sécurisé.

## 🎯 Fonctionnalités

- **Streaming sécurisé** : Écoute de musique sans téléchargement possible
- **Écoutes limitées** : Chaque morceau peut être écouté un nombre limité de fois (10 par défaut)
- **Paiement intégré** : Support pour Orange Money, Wave, Free Money et Visa via FedaPay
- **Interface moderne** : Design responsive avec Tailwind CSS
- **Sécurité avancée** : URLs signées temporaires pour l'accès aux fichiers audio

## 🏗️ Architecture

### Frontend
- **Framework** : Next.js 14 + TypeScript
- **Styling** : Tailwind CSS
- **Player** : React Player
- **État** : Context API (React)
- **HTTP Client** : Axios

### Backend
- **Framework** : Express.js + TypeScript
- **Base de données** : PostgreSQL (Supabase)
- **ORM** : Prisma
- **Stockage** : Supabase Storage
- **Authentification** : JWT + bcrypt
- **Paiements** : FedaPay API

## 🚀 Installation

### Prérequis
- Node.js 18+
- PostgreSQL (ou compte Supabase)
- Compte FedaPay

### 1. Cloner le projet
```bash
git clone <repository-url>
cd prp-platform
```

### 2. Configuration Backend

```bash
cd backend
npm install
```

Créer un fichier `.env` dans le dossier `backend` :
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/prp_database"

# JWT
JWT_SECRET="your-super-secret-jwt-key-here"
JWT_EXPIRES_IN="7d"

# Supabase
SUPABASE_URL="your-supabase-url"
SUPABASE_ANON_KEY="your-supabase-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-supabase-service-role-key"

# FedaPay
FEDAPAY_API_KEY="your-fedapay-api-key"
FEDAPAY_ENVIRONMENT="sandbox" # or "live"

# Server
PORT=3001
NODE_ENV="development"

# CORS
FRONTEND_URL="http://localhost:3000"
```

### 3. Configuration Base de données

```bash
# Générer le client Prisma
npx prisma generate

# Appliquer les migrations
npx prisma db push

# (Optionnel) Ouvrir Prisma Studio
npx prisma studio
```

### 4. Configuration Frontend

```bash
cd .. # Retour au dossier racine
npm install
```

Créer un fichier `.env.local` :
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### 5. Démarrer l'application

Terminal 1 (Backend) :
```bash
cd backend
npm run dev
```

Terminal 2 (Frontend) :
```bash
npm run dev
```

L'application sera accessible sur :
- Frontend : http://localhost:3000
- Backend API : http://localhost:3001

## 📁 Structure du projet

```
prp-platform/
├── backend/                 # API Backend
│   ├── src/
│   │   ├── controllers/     # Contrôleurs API
│   │   ├── middleware/      # Middlewares
│   │   ├── routes/          # Routes API
│   │   ├── services/        # Services (DB, Supabase, FedaPay)
│   │   ├── types/           # Types TypeScript
│   │   ├── utils/           # Utilitaires
│   │   └── index.ts         # Point d'entrée
│   ├── prisma/
│   │   └── schema.prisma    # Schéma de base de données
│   └── package.json
├── src/                     # Frontend Next.js
│   ├── app/                 # Pages App Router
│   │   ├── login/           # Page de connexion
│   │   ├── register/        # Page d'inscription
│   │   ├── dashboard/       # Tableau de bord
│   │   └── page.tsx         # Page d'accueil
│   ├── components/          # Composants React
│   │   ├── AudioPlayer.tsx  # Lecteur audio sécurisé
│   │   ├── TrackCard.tsx    # Carte de piste
│   │   └── PaymentModal.tsx # Modal de paiement
│   ├── contexts/            # Contextes React
│   │   └── AuthContext.tsx  # Contexte d'authentification
│   ├── services/            # Services API
│   │   └── api.ts           # Client API
│   └── types/               # Types TypeScript
│       └── index.ts         # Types partagés
└── README.md
```

## 🔧 Configuration Supabase

1. Créer un projet sur [Supabase](https://supabase.com)
2. Récupérer l'URL et les clés API
3. Configurer le stockage pour les fichiers audio :
   - Créer un bucket nommé `music-files`
   - Configurer les politiques de sécurité

## 💳 Configuration FedaPay

1. Créer un compte sur [FedaPay](https://fedapay.com)
2. Récupérer la clé API
3. Configurer les webhooks pour les callbacks de paiement

## 🛡️ Sécurité

- **URLs signées** : Les fichiers audio sont accessibles via des URLs signées temporaires
- **JWT** : Authentification sécurisée avec tokens JWT
- **CORS** : Configuration CORS appropriée
- **Validation** : Validation des données côté serveur
- **Hachage** : Mots de passe hachés avec bcrypt

## 📱 Fonctionnalités utilisateur

### Pages principales
- **/** : Catalogue des morceaux
- **/login** : Connexion
- **/register** : Inscription
- **/dashboard** : Tableau de bord utilisateur

### Fonctionnalités
- Parcourir le catalogue de musique
- Acheter des morceaux individuels
- Écouter avec un lecteur sécurisé
- Suivre les écoutes restantes
- Historique des paiements

## 🔄 API Endpoints

### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `GET /api/auth/profile` - Profil utilisateur

### Pistes
- `GET /api/tracks` - Liste des pistes
- `GET /api/tracks/:id` - Détails d'une piste
- `POST /api/tracks/:id/play` - Jouer une piste
- `GET /api/tracks/user/tracks` - Pistes de l'utilisateur
- `POST /api/tracks/:id/purchase` - Acheter une piste

### Paiements
- `POST /api/payments` - Créer un paiement
- `GET /api/payments/verify/:id` - Vérifier un paiement
- `GET /api/payments/status/:id` - Statut d'un paiement
- `GET /api/payments/user` - Paiements de l'utilisateur
- `POST /api/payments/callback` - Webhook FedaPay

## 🚀 Déploiement

### Backend
1. Configurer les variables d'environnement de production
2. Déployer sur un service comme Railway, Heroku, ou VPS
3. Configurer la base de données PostgreSQL

### Frontend
1. Configurer les variables d'environnement
2. Déployer sur Vercel, Netlify, ou autre service
3. Mettre à jour l'URL de l'API

## 📄 Licence

Ce projet est sous licence MIT.

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

## 📞 Support

Pour toute question ou problème, contactez l'équipe de développement.