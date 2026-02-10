# Guide - Changement de Mot de Passe et Suppression d'Utilisateurs

## 🔐 Nouvelles Fonctionnalités Ajoutées

### ✅ **Changement de Mot de Passe**
- **Tous les utilisateurs** peuvent changer leur mot de passe
- **Validation sécurisée** de l'ancien mot de passe
- **Interface intuitive** avec masquage/affichage des mots de passe

### ✅ **Suppression d'Utilisateurs (Admin)**
- **Suppression complète** des comptes utilisateurs
- **Protection** : impossible de supprimer le dernier admin
- **Confirmation** obligatoire avant suppression

### ✅ **Réinitialisation de Mot de Passe (Admin)**
- **Réinitialisation forcée** par l'administrateur
- **Nouveau mot de passe** défini directement

## 🎯 **Comment Tester**

### **1. Changement de Mot de Passe (Utilisateur)**

#### **Méthode 1 : Depuis le Dashboard**
1. Se connecter avec `admin@lte-app.com` / `admin123`
2. Aller sur le **Dashboard**
3. Dans la carte "Mon Profil", cliquer **"Changer le mot de passe"**
4. Remplir le formulaire :
   - Mot de passe actuel : `admin123`
   - Nouveau mot de passe : `nouveaumotdepasse`
   - Confirmer le nouveau mot de passe
5. Cliquer **"Modifier"**

#### **Méthode 2 : Depuis le Header**
1. Cliquer sur l'**avatar utilisateur** (en haut à droite)
2. Sélectionner **"Changer le mot de passe"**
3. Suivre la même procédure

#### **Méthode 3 : Page Profil**
1. Aller sur `/profile`
2. Utiliser le bouton **"Changer le mot de passe"**

### **2. Suppression d'Utilisateurs (Admin)**

#### **Étape 1 : Créer un utilisateur de test**
1. Se connecter en tant qu'admin
2. Aller dans **Administration** → **Utilisateurs**
3. Cliquer **"Nouvel utilisateur"**
4. Créer un étudiant de test :
   - Prénom : `Test`
   - Nom : `Étudiant`
   - Email : `test@example.com`
   - Mot de passe : `test123`
   - Rôle : `Étudiant`

#### **Étape 2 : Supprimer l'utilisateur**
1. Dans la liste des utilisateurs
2. Trouver l'utilisateur de test
3. Cliquer sur l'icône **poubelle** (🗑️)
4. Confirmer la suppression dans la boîte de dialogue
5. Vérifier que l'utilisateur a disparu de la liste

### **3. Réinitialisation de Mot de Passe (Admin)**

#### **Procédure**
1. Dans **Administration** → **Utilisateurs**
2. Trouver un utilisateur existant
3. Cliquer sur l'icône **clé** (🔑)
4. Définir un nouveau mot de passe
5. Confirmer le mot de passe
6. Cliquer **"Réinitialiser"**

## 🔧 **Fonctionnalités Techniques**

### **Sécurité du Changement de Mot de Passe**
- ✅ Vérification de l'ancien mot de passe
- ✅ Validation de la complexité (minimum 6 caractères)
- ✅ Confirmation du nouveau mot de passe
- ✅ Hashage sécurisé du nouveau mot de passe

### **Sécurité de la Suppression**
- ✅ Confirmation obligatoire
- ✅ Protection du dernier administrateur
- ✅ Suppression des données associées
- ✅ Mise à jour des statistiques de classe

### **Interface Utilisateur**
- ✅ Boutons d'action avec icônes explicites
- ✅ Tooltips informatifs
- ✅ Messages de confirmation/erreur
- ✅ Formulaires avec validation en temps réel

## 📍 **Emplacements des Fonctionnalités**

### **Changement de Mot de Passe**
- **Dashboard** : Carte "Mon Profil"
- **Header** : Menu déroulant utilisateur
- **Page Profil** : `/profile`

### **Gestion des Utilisateurs (Admin)**
- **Administration** : `/admin` → Onglet "Utilisateurs"
- **Actions disponibles** :
  - 👁️ Activer/Désactiver
  - 🔑 Réinitialiser mot de passe
  - 🗑️ Supprimer utilisateur

## 🧪 **Tests de Sécurité**

### **Test 1 : Ancien mot de passe incorrect**
1. Essayer de changer le mot de passe avec un ancien mot de passe incorrect
2. **Résultat attendu** : Erreur "Mot de passe actuel incorrect"

### **Test 2 : Mots de passe non identiques**
1. Saisir des mots de passe différents dans "nouveau" et "confirmer"
2. **Résultat attendu** : Erreur "Les mots de passe ne correspondent pas"

### **Test 3 : Suppression du dernier admin**
1. Essayer de supprimer le dernier administrateur
2. **Résultat attendu** : Erreur "Impossible de supprimer le dernier administrateur"

### **Test 4 : Mot de passe trop court**
1. Essayer un mot de passe de moins de 6 caractères
2. **Résultat attendu** : Erreur de validation

## 🎉 **Fonctionnalités Complètes**

✅ **Authentification sécurisée**  
✅ **Gestion des rôles**  
✅ **Changement de mot de passe utilisateur**  
✅ **Suppression d'utilisateurs (admin)**  
✅ **Réinitialisation de mot de passe (admin)**  
✅ **Interface d'administration complète**  
✅ **Protection contre les suppressions dangereuses**  
✅ **Validation et sécurité renforcées**  

---

**Le système d'authentification est maintenant complet avec toutes les fonctionnalités de gestion des utilisateurs !** 🚀