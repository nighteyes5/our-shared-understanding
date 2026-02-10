# Guide de la Carte LTE - Planification Géographique (Sénégal)

## 🎯 Objectif

La carte LTE est un outil pédagogique qui permet de comprendre les principes de planification des réseaux mobiles LTE au Sénégal. Elle utilise une vraie carte géographique avec OpenLayers et OpenStreetMap pour simuler le placement de sites radio et calculer leur couverture.

## 🚀 Accès à la Carte

### Depuis le Dashboard
1. Connectez-vous à votre compte
2. Allez dans le **Dashboard**
3. Cliquez sur **"Planification Géographique"**
4. Vous accédez directement à la carte complète avec OpenLayers

### URL Directe
- Carte complète : `/map`

## 🗺️ Zones Géographiques Disponibles

### Zones Urbaines
- **Dakar** : Capitale, zone urbaine dense (1,146,053 habitants)
- **Thiès** : Zone industrielle et commerciale (320,000 habitants)

### Zones Suburbaines
- **Saint-Louis** : Zone historique avec architecture coloniale (176,000 habitants)
- **Kaolack** : Centre commercial et agricole (172,305 habitants)
- **Ziguinchor** : Zone tropicale avec végétation dense (158,701 habitants)

### Zones Rurales
- **Ferlo** : Zone pastorale semi-aride du nord (25,000 habitants)

## 🗺️ Fonctionnalités de la Carte

### 1. Carte Géographique Réelle
- **OpenStreetMap** : Données cartographiques réelles du Sénégal
- **Navigation** : Zoom, déplacement, réinitialisation
- **Géolocalisation précise** : Coordonnées GPS exactes

### 2. Gestion des Sites LTE
- **Ajout de sites** : Cliquez sur "Ajouter Site" puis sur la carte
- **Configuration** : Cliquez sur un site pour le configurer
- **Activation/Désactivation** : Contrôlez l'état des sites
- **Suppression** : Supprimez les sites non nécessaires

### 3. Paramètres des Sites
- **Puissance** : 20-50 dBm (impact sur la portée)
- **Fréquence** : Bandes LTE (700-2600 MHz)
- **Hauteur d'antenne** : 10-100 mètres
- **Environnement** : Urbain, Suburbain, Rural

### 4. Visualisation de la Couverture
- **Cercles de couverture** : Zones couvertes par chaque site sur la vraie carte
- **Couleurs** : 
  - Vert : Site actif avec couverture verte
  - Gris : Site inactif
  - Bleu : Site sélectionné avec couverture bleue

### 5. Statistiques et Analyse
- **Sites actifs** : Nombre de sites opérationnels
- **Couverture totale** : Surface couverte en km²
- **Qualité globale** : Score de performance
- **Distribution des fréquences** : Répartition par bande
- **Recommandations** : Suggestions d'amélioration

## 🛠️ Outils Avancés

### Sites de Démonstration
- Génère automatiquement 5 sites optimisés pour la zone sélectionnée
- Placement intelligent selon la géographie réelle
- Paramètres adaptés au contexte sénégalais

### Export/Import
- Sauvegarde de la configuration en JSON
- Partage de scénarios entre utilisateurs
- Archivage des études de planification

### Contrôles de Navigation
- **Zoom** : Ajustez le niveau de détail sur la vraie carte
- **Réinitialisation** : Retour à la vue par défaut
- **Effacer tout** : Suppression de tous les sites

## 📊 Onglets de l'Interface

### 1. Carte
- Interface principale avec OpenLayers
- Placement et configuration des sites sur la vraie carte du Sénégal
- Visualisation de la couverture géographique réelle

### 2. Configuration
- Paramètres globaux de simulation
- Modèles de propagation adaptés au climat sénégalais
- Seuils de qualité

### 3. Statistiques
- Métriques détaillées
- Graphiques de distribution
- Recommandations d'optimisation pour le contexte local

## 🎓 Aspects Pédagogiques

### Concepts Enseignés
1. **Planification cellulaire** : Placement optimal des sites au Sénégal
2. **Modèles de propagation** : Impact du climat tropical et de la géographie
3. **Dimensionnement** : Calcul de couverture pour les zones urbaines et rurales
4. **Optimisation** : Équilibrage couverture/interférences dans le contexte sénégalais

### Exercices Suggérés
1. **Couverture de Dakar** : Optimiser la capitale avec contraintes urbaines
2. **Zone rurale du Ferlo** : Maximiser la couverture avec peu de sites
3. **Comparaison côte/intérieur** : Impact de la géographie sur la propagation
4. **Optimisation énergétique** : Minimiser la consommation dans les zones isolées

## 🌍 Spécificités du Sénégal

### Défis Géographiques
- **Zones côtières** : Propagation maritime à Dakar et Saint-Louis
- **Zones semi-arides** : Conditions particulières dans le Ferlo
- **Zones tropicales** : Végétation dense en Casamance (Ziguinchor)

### Considérations Climatiques
- **Saison sèche** : Impact sur la propagation radio
- **Saison des pluies** : Atténuation par les précipitations
- **Harmattan** : Influence des vents de sable

## 🔧 Résolution de Problèmes

### La carte ne s'affiche pas
1. Vérifiez votre connexion internet
2. Actualisez la page (F5)
3. Vérifiez que JavaScript est activé
4. Essayez un autre navigateur

### Problèmes de performance
1. Réduisez le nombre de sites
2. Utilisez un zoom plus faible
3. Fermez les autres onglets du navigateur
4. Vérifiez votre connexion internet

## 📱 Compatibilité

### Navigateurs Supportés
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Résolutions Recommandées
- Minimum : 1024x768
- Optimal : 1920x1080 ou plus
- Support mobile limité

## 🎯 Conseils d'Utilisation

### Pour les Étudiants
1. Explorez d'abord les différentes zones du Sénégal
2. Comparez les défis urbains (Dakar) et ruraux (Ferlo)
3. Testez l'impact des paramètres sur la couverture réelle
4. Utilisez les sites de démonstration comme référence

### Pour les Enseignants
1. Montrez les spécificités géographiques du Sénégal
2. Comparez les stratégies de déploiement selon les régions
3. Utilisez l'export pour partager des scénarios réalistes
4. Encouragez l'analyse des contraintes locales

---

*Guide mis à jour pour le contexte sénégalais avec OpenLayers - Février 2026*