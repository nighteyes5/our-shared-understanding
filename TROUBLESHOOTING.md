# Guide de Dépannage - Système d'Authentification

## 🔧 Problèmes Résolus s

### 1. Conflit de noms de méthodes
**Problème :** Méthodes `getUsers()` en conflit dans `authService.ts`
**Solution :** Renommé la méthode privée en `getStoredUsers()`

### 2. Boucle infinie dans userDataService
**Problème :** Méthode `getUserCalculations()` s'appelait elle-même
**Solution :** Renommé la méthode privée en `getStoredCalculations()`

### 3. Redirection après connexion
**Problème :** Redirection non fonctionnelle après connexion
**Solution :** Ajout d'un délai et simplification de la logique de redirection

## 🧪 Comment Tester le Système

### 1. Page de Test d'Authentification
Accédez à : `http://localhost:8080/auth-test`

Cette page affiche :
- État de connexion
- Informations utilisateur
- Boutons de navigation

### 2. Test Manuel

#### Étape 1 : Connexion Admin
1. Aller sur `/login`
2. Utiliser : `admin@lte-app.com` / `admin123`
3. Vérifier la redirection vers `/admin`

#### Étape 2 : Création d'un Étudiant
1. Dans l'interface admin, onglet "Utilisateurs"
2. Cliquer "Nouvel utilisateur"
3. Créer un étudiant avec une classe

#### Étape 3 : Test Étudiant
1. Se déconnecter
2. Se connecter avec le compte étudiant
3. Vérifier la redirection vers `/dashboard`

### 3. Tests de Console
Dans la page de connexion, utiliser les boutons :
- **Test Service** : Affiche l'état du service dans la console
- **Clear Data** : Nettoie le localStorage

## 🐛 Problèmes Courants

### Problème : "Utilisateur non trouvé"
**Cause :** localStorage vide ou corrompu
**Solution :**
```javascript
// Dans la console du navigateur
localStorage.clear();
window.location.reload();
```

### Problème : Redirection infinie
**Cause :** Conflit entre les logiques de redirection
**Solution :** Vérifier que l'utilisateur est bien défini avant redirection

### Problème : "Cannot read properties of null"
**Cause :** Accès à `user` avant initialisation
**Solution :** Toujours vérifier `user` et `isLoading`

## 🔍 Débogage

### 1. Vérifier le localStorage
```javascript
// Dans la console du navigateur
console.log('Users:', localStorage.getItem('lte_app_users'));
console.log('Current User:', localStorage.getItem('lte_app_current_user'));
console.log('Session Token:', localStorage.getItem('lte_app_session_token'));
```

### 2. Vérifier l'état du contexte
```javascript
// Dans un composant
const { user, isAuthenticated, isLoading } = useAuth();
console.log({ user, isAuthenticated, isLoading });
```

### 3. Tester le service directement
```javascript
import { authService } from '@/services/auth/authService';

// Test de connexion
authService.login({
  email: 'admin@lte-app.com',
  password: 'admin123'
}).then(console.log).catch(console.error);
```

## 🛠️ Commandes Utiles

### Redémarrer le serveur de développement
```bash
npm run dev
```

### Nettoyer et redémarrer
```bash
# Arrêter le serveur (Ctrl+C)
# Nettoyer le cache
rm -rf node_modules/.vite
npm run dev
```

### Vérifier les erreurs TypeScript
```bash
npx tsc --noEmit
```

## 📋 Checklist de Vérification

- [ ] L'application démarre sans erreurs
- [ ] La page `/login` s'affiche correctement
- [ ] La connexion admin fonctionne
- [ ] La redirection vers `/admin` fonctionne
- [ ] La création d'utilisateur fonctionne
- [ ] La connexion étudiant fonctionne
- [ ] La redirection vers `/dashboard` fonctionne
- [ ] La déconnexion fonctionne
- [ ] Les routes protégées bloquent l'accès non autorisé

## 🔧 Réparations d'Urgence

### Réinitialiser complètement le système
```javascript
// Dans la console du navigateur
localStorage.clear();
sessionStorage.clear();
window.location.href = '/login';
```

### Créer manuellement un admin
```javascript
// Dans la console du navigateur
const adminUser = {
  id: 'admin-1',
  email: 'admin@lte-app.com',
  firstName: 'Admin',
  lastName: 'System',
  role: 'admin',
  isActive: true,
  createdAt: new Date().toISOString(),
  passwordHash: btoa('admin123' + 'salt_key_lte_app')
};

localStorage.setItem('lte_app_users', JSON.stringify([adminUser]));
window.location.reload();
```

## 📞 Support

Si les problèmes persistent :

1. Vérifier la console du navigateur pour les erreurs
2. Vérifier l'onglet Network pour les requêtes échouées
3. Tester avec un navigateur en mode incognito
4. Vérifier que tous les composants UI sont bien installés

## 🎯 URLs de Test

- **Login :** `http://localhost:8080/login`
- **Test Auth :** `http://localhost:8080/auth-test`
- **Dashboard :** `http://localhost:8080/dashboard`
- **Admin :** `http://localhost:8080/admin`
- **Calculateur :** `http://localhost:8080/`

---

*Ce guide sera mis à jour au fur et à mesure des découvertes de nouveaux problèmes.*