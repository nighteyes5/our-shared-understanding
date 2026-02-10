# Guide d'Authentification - Calculateur LTE

## Vue d'ensemble

Ce système d'authentification moderne et sécurisé permet la gestion multi-utilisateurs avec des rôles distincts pour l'application de calcul LTE.

## Fonctionnalités

### 🔐 Authentification Sécurisée
- Connexion par email/mot de passe
- Validation des formulaires avec Zod
- Gestion des sessions sécurisées
- Protection des routes selon les rôles

### 👥 Gestion des Rôles

#### Administrateur
- **Accès complet** à l'interface d'administration
- **Création/désactivation** des comptes étudiants
- **Gestion des classes** et regroupements
- **Visualisation** des résultats de tous les étudiants
- **Statistiques** d'utilisation de la plateforme

#### Étudiant
- **Accès personnel** aux calculs LTE
- **Sauvegarde** de ses propres calculs
- **Visualisation** uniquement de ses données
- **Tableau de bord** personnalisé

### 🏫 Gestion des Classes
- Regroupement par classe/promotion
- Statistiques par classe
- Gestion des étudiants par classe

## Structure du Système

### Types et Interfaces (`src/types/auth.ts`)
```typescript
- User: Interface utilisateur complète
- UserRole: Énumération des rôles (ADMIN, STUDENT)
- AuthState: État d'authentification
- LoginCredentials: Données de connexion
- CreateUserData: Données de création d'utilisateur
- Class: Interface des classes
```

### Services

#### Service d'Authentification (`src/services/auth/authService.ts`)
- Gestion des utilisateurs et sessions
- Hashage sécurisé des mots de passe
- CRUD des utilisateurs et classes
- Validation des permissions

#### Service de Données Utilisateur (`src/services/userDataService.ts`)
- Isolation des données par utilisateur
- Sauvegarde des calculs personnels
- Statistiques d'utilisation

### Contexte React (`src/contexts/AuthContext.tsx`)
- État global d'authentification
- Hooks pour l'accès aux données utilisateur
- Gestion des sessions

## Pages et Composants

### Pages Principales
- **Login** (`/login`) - Connexion utilisateur
- **Dashboard** (`/dashboard`) - Tableau de bord personnel
- **Admin** (`/admin`) - Interface d'administration (admin uniquement)
- **Index** (`/`) - Calculateur LTE (protégé)

### Composants d'Administration
- **UserManagement** - Gestion des utilisateurs
- **ClassManagement** - Gestion des classes
- **ProtectedRoute** - Protection des routes

## Comptes par Défaut

### Administrateur
- **Email**: `admin@lte-app.com`
- **Mot de passe**: `admin123`
- **Permissions**: Accès complet

### Classes par Défaut
- Télécommunications 2024
- Réseaux 2024

## Sécurité

### Mesures Implémentées
- ✅ Hashage des mots de passe
- ✅ Validation côté client et serveur
- ✅ Protection des routes par rôle
- ✅ Isolation des données utilisateur
- ✅ Gestion sécurisée des sessions

### Recommandations pour la Production
- Utiliser une vraie base de données
- Implémenter JWT avec refresh tokens
- Ajouter la validation 2FA
- Utiliser HTTPS obligatoire
- Implémenter le rate limiting
- Ajouter des logs d'audit

## Utilisation

### Pour les Administrateurs

1. **Connexion**
   ```
   Email: admin@lte-app.com
   Mot de passe: admin123
   ```

2. **Créer un étudiant**
   - Aller dans l'interface d'administration
   - Onglet "Utilisateurs"
   - Cliquer "Nouvel utilisateur"
   - Remplir les informations et assigner une classe

3. **Gérer les classes**
   - Onglet "Classes"
   - Créer de nouvelles classes
   - Visualiser les étudiants par classe

### Pour les Étudiants

1. **Connexion**
   - Utiliser les identifiants fournis par l'administrateur

2. **Utiliser le calculateur**
   - Accéder au calculateur LTE depuis le tableau de bord
   - Effectuer des calculs
   - Sauvegarder les résultats

3. **Gérer ses calculs**
   - Visualiser l'historique dans le tableau de bord
   - Supprimer les anciens calculs

## Développement

### Ajout de Nouvelles Fonctionnalités

1. **Nouveau rôle**
   - Modifier `UserRole` dans `src/types/auth.ts`
   - Adapter les services et composants

2. **Nouvelles permissions**
   - Modifier `ProtectedRoute`
   - Ajouter les vérifications dans les services

3. **Nouvelles données utilisateur**
   - Étendre l'interface `User`
   - Adapter les formulaires et services

## API Future

Le système est conçu pour être facilement adapté à une API REST :

```typescript
// Exemples d'endpoints
POST /api/auth/login
POST /api/auth/logout
GET /api/users
POST /api/users
PUT /api/users/:id
DELETE /api/users/:id
GET /api/classes
POST /api/classes
GET /api/calculations
POST /api/calculations
```

## Support

Pour toute question ou problème :
1. Vérifier les logs dans la console du navigateur
2. Vérifier les données dans localStorage (développement)
3. Contacter l'administrateur système

---

*Ce système d'authentification garantit la sécurité et l'isolation des données tout en offrant une expérience utilisateur moderne et intuitive.*