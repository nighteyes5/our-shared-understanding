# Guide des Statistiques d'Utilisation Admin

## Vue d'ensemble

L'onglet "Statistiques" dans l'interface d'administration fournit une vue complète de l'activité sur la plateforme LTE.

## Accès

1. Connectez-vous en tant qu'administrateur
2. Accédez à la page Administration
3. Cliquez sur l'onglet "Statistiques"

## Sections disponibles

### 1. Cartes principales (4 métriques clés)

- **Utilisateurs totaux** : Nombre total d'utilisateurs inscrits
- **Utilisateurs actifs** : Utilisateurs connectés dans les 30 derniers jours
- **Calculs totaux** : Nombre total de calculs LTE effectués
- **Sites LTE** : Nombre de sites placés sur la carte

### 2. Moyennes

- **Calculs par utilisateur** : Moyenne des calculs effectués par utilisateur
- **Taux d'activité** : Pourcentage d'utilisateurs actifs sur 30 jours

### 3. Répartition par environnement

Visualisation des calculs par type d'environnement :
- Urbain (bleu)
- Suburbain (vert)
- Rural (orange)

Affichage avec barres de progression et compteurs.

### 4. Fréquences LTE utilisées

Liste des fréquences LTE utilisées dans les calculs avec le nombre d'utilisations pour chaque fréquence.

### 5. Top 10 utilisateurs

Classement des utilisateurs les plus actifs par nombre de calculs effectués.
- Badge spécial pour le top 3
- Affichage du nom et du nombre de calculs

### 6. Activité récente

Tableau des 20 dernières actions sur la plateforme :
- Nom de l'utilisateur
- Action effectuée (nom du calcul)
- Date et heure complète (format : JJ/MM/AAAA HH:MM)

## Mise à jour des données

Les statistiques sont chargées automatiquement à l'ouverture de l'onglet. Pour actualiser les données, rechargez la page ou changez d'onglet puis revenez sur "Statistiques".

## Sources de données

Les statistiques sont calculées à partir de :
- Base d'utilisateurs (localStorage : `lte_users`)
- Calculs enregistrés par utilisateur (localStorage : `lte_calculations_[userId]`)
- Sites LTE (localStorage : `lte_sites`)

## Fichiers concernés

- `src/components/admin/UsageStatistics.tsx` : Composant des statistiques
- `src/pages/Admin.tsx` : Page d'administration avec intégration
