# Configuration FedaPay pour PRP Music Platform

Ce guide vous explique comment configurer FedaPay pour les paiements dans la plateforme PRP Music.

## 1. Créer un compte FedaPay

1. Allez sur [fedapay.com](https://fedapay.com)
2. Cliquez sur **S'inscrire** ou **Sign Up**
3. Remplissez le formulaire d'inscription
4. Vérifiez votre email
5. Connectez-vous à votre compte

## 2. Configuration du compte

### Informations de base
1. Allez dans **Paramètres** > **Informations du compte**
2. Remplissez toutes les informations requises :
   - Nom de l'entreprise
   - Adresse
   - Numéro de téléphone
   - Site web (optionnel)

### Vérification d'identité
1. Allez dans **Vérification** > **Identité**
2. Uploadez les documents requis :
   - Pièce d'identité (CNI, Passeport)
   - Justificatif de domicile
   - Document de l'entreprise (si applicable)

## 3. Configuration des clés API

### Mode Sandbox (Test)
1. Allez dans **Développement** > **Clés API**
2. Copiez la **Clé API Sandbox**
3. Notez l'**URL de base** : `https://api-sandbox.fedapay.com/v1`

### Mode Production
1. Une fois votre compte vérifié, allez dans **Production** > **Clés API**
2. Copiez la **Clé API Production**
3. Notez l'**URL de base** : `https://api.fedapay.com/v1`

## 4. Configuration des webhooks

### Créer un webhook
1. Allez dans **Développement** > **Webhooks** (ou **Production** > **Webhooks**)
2. Cliquez sur **Créer un webhook**
3. Configurez :
   - **URL** : `https://votre-domaine.com/api/payments/callback`
   - **Événements** : Sélectionnez tous les événements de paiement
   - **Description** : "PRP Music Platform Payment Callbacks"

### Tester le webhook
1. Utilisez un service comme [ngrok](https://ngrok.com) pour exposer votre localhost
2. Mettez à jour l'URL du webhook avec votre URL ngrok
3. Testez un paiement pour vérifier que le webhook fonctionne

## 5. Configuration des méthodes de paiement

### Orange Money
- **Activation** : Automatique
- **Frais** : Voir la grille tarifaire FedaPay
- **Configuration** : Aucune configuration supplémentaire requise

### Wave
- **Activation** : Automatique
- **Frais** : Voir la grille tarifaire FedaPay
- **Configuration** : Aucune configuration supplémentaire requise

### Free Money
- **Activation** : Automatique
- **Frais** : Voir la grille tarifaire FedaPay
- **Configuration** : Aucune configuration supplémentaire requise

### Visa/Mastercard
- **Activation** : Peut nécessiter une configuration supplémentaire
- **Frais** : Voir la grille tarifaire FedaPay
- **Configuration** : Contactez le support FedaPay si nécessaire

## 6. Configuration des variables d'environnement

Mettez à jour votre fichier `.env` dans le dossier `backend` :

```env
# FedaPay Configuration
FEDAPAY_API_KEY="your-fedapay-api-key"
FEDAPAY_ENVIRONMENT="sandbox" # ou "live" pour la production

# URL de callback (même URL que le webhook)
CALLBACK_URL="https://votre-domaine.com/api/payments/callback"
```

## 7. Tester les paiements

### Mode Sandbox
1. Utilisez les numéros de test fournis par FedaPay
2. Testez différents scénarios :
   - Paiement réussi
   - Paiement échoué
   - Paiement annulé
   - Timeout de paiement

### Numéros de test Orange Money
- **Succès** : `+2250701234567`
- **Échec** : `+2250701234568`
- **Annulation** : `+2250701234569`

### Numéros de test Wave
- **Succès** : `+221701234567`
- **Échec** : `+221701234568`
- **Annulation** : `+221701234569`

## 8. Gestion des erreurs

### Erreurs communes
- **401 Unauthorized** : Vérifiez votre clé API
- **400 Bad Request** : Vérifiez les paramètres de la requête
- **500 Internal Server Error** : Contactez le support FedaPay

### Logs et monitoring
1. Allez dans **Développement** > **Logs** (ou **Production** > **Logs**)
2. Surveillez les transactions
3. Vérifiez les webhooks reçus

## 9. Passage en production

### Checklist avant la mise en production
- [ ] Compte vérifié et approuvé
- [ ] Clés API de production configurées
- [ ] Webhooks configurés avec l'URL de production
- [ ] Tests complets effectués
- [ ] Monitoring configuré
- [ ] Plan de rollback préparé

### Configuration de production
```env
FEDAPAY_API_KEY="your-production-api-key"
FEDAPAY_ENVIRONMENT="live"
CALLBACK_URL="https://votre-domaine-production.com/api/payments/callback"
```

## 10. Sécurité

### Bonnes pratiques
- Ne commitez jamais vos clés API dans le code
- Utilisez des variables d'environnement
- Implémentez la validation des webhooks
- Loggez toutes les transactions
- Implémentez des timeouts appropriés

### Validation des webhooks
```javascript
// Exemple de validation de webhook
const crypto = require('crypto');

function validateWebhook(payload, signature, secret) {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}
```

## 11. Monitoring et alertes

### Métriques importantes
- Taux de succès des paiements
- Temps de réponse moyen
- Nombre de transactions par jour
- Montant total des transactions

### Alertes recommandées
- Taux d'échec > 10%
- Temps de réponse > 30s
- Aucune transaction pendant 24h (si normalement actif)
- Erreurs de webhook

## 12. Support et documentation

### Ressources utiles
- [Documentation API FedaPay](https://docs.fedapay.com)
- [SDK JavaScript](https://github.com/fedapay/fedapay-js)
- [Support technique](https://fedapay.com/support)

### Contact support
- **Email** : support@fedapay.com
- **Téléphone** : Voir le site web
- **Chat** : Disponible sur le dashboard

## 13. Limites et quotas

### Limites par défaut
- **Transactions par jour** : 1000 (sandbox), 10000 (production)
- **Montant par transaction** : 1,000,000 XOF
- **Montant total par jour** : 10,000,000 XOF

### Demande d'augmentation
1. Allez dans **Paramètres** > **Limites**
2. Cliquez sur **Demander une augmentation**
3. Justifiez votre demande
4. Attendez l'approbation

## 14. Dépannage

### Problèmes courants
1. **Webhook non reçu** : Vérifiez l'URL et la configuration
2. **Paiement en attente** : Vérifiez le statut dans le dashboard
3. **Erreur de validation** : Vérifiez les paramètres requis
4. **Timeout** : Augmentez le timeout de la requête

### Outils de débogage
- **Logs FedaPay** : Dashboard > Logs
- **Logs de votre application** : Vérifiez vos logs serveur
- **Test de webhook** : Utilisez des outils comme webhook.site

---

Pour plus d'informations, consultez la [documentation officielle de FedaPay](https://docs.fedapay.com).
