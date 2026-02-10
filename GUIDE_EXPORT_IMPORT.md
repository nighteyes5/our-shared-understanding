# Guide d'Export et Import Complet

## 🎯 Fonctionnalité

Système complet d'**export et import** de votre planification LTE. Sauvegardez tous vos sites avec leurs paramètres et restaurez-les en un clic !

## 📦 Contenu de l'Export

### Données Complètes Exportées

L'export inclut **TOUT** :

```json
{
  "version": "1.0",
  "exportDate": "2024-01-15T10:30:00Z",
  
  "sites": [
    {
      "id": "site-001",
      "name": "Site Dakar Centre",
      "position": { "lat": 14.6928, "lng": -17.4467 },
      "power": 43,
      "frequency": 1800,
      "antennaHeight": 30,
      "coverageRadius": 2.5,
      "environment": "urban",
      "isActive": true,
      "createdAt": "2024-01-15T10:00:00Z",
      "propagationModel": "cost231-hata"
    }
  ],
  
  "globalPropagationModel": "cost231-hata",
  
  "location": {
    "type": "predefined",
    "id": "dakar",
    "name": "Dakar",
    "center": { "lat": 14.6928, "lng": -17.4467 },
    "zoom": 12
  },
  
  "statistics": {
    "totalSites": 5,
    "activeSites": 5,
    "coverage": {
      "totalCoverage": 125.5,
      "averageRadius": 3.2,
      "activeSites": 5,
      "modelUsed": "COST 231-Hata"
    },
    "modelDistribution": {
      "okumura-hata": 2,
      "cost231-hata": 2,
      "3gpp": 1
    }
  }
}
```

### Détails des Données

| Catégorie | Contenu |
|-----------|---------|
| **Sites** | Tous les sites avec TOUS leurs paramètres |
| **Modèles** | Modèle de propagation de chaque site |
| **Zone** | Location (prédéfinie ou personnalisée) |
| **Position** | Coordonnées GPS exactes |
| **Configuration** | Puissance, fréquence, hauteur, environnement |
| **État** | Sites actifs/inactifs |
| **Statistiques** | Couverture, distribution des modèles |

## 📤 Export

### Comment Exporter

1. **Cliquez sur "Exporter"** dans la barre d'outils
2. Le fichier JSON se télécharge automatiquement
3. Nom du fichier : `lte-planning-[zone]-[date].json`

```
┌─────────────────────────────────────────┐
│ [📥 Exporter]                           │
└─────────────────────────────────────────┘
         ↓
Téléchargement: lte-planning-dakar-2024-01-15.json
```

### Exemple de Nom de Fichier

```
lte-planning-dakar-2024-01-15.json
lte-planning-thies-2024-01-15.json
lte-planning-paris-2024-01-15.json
```

### Notification

```
┌─────────────────────────────────────────┐
│ ✓ Export réussi                         │
│ 5 sites exportés avec tous les          │
│ paramètres                               │
└─────────────────────────────────────────┘
```

## 📥 Import

### Comment Importer

1. **Cliquez sur "Importer"** dans la barre d'outils
2. Sélectionnez votre fichier JSON
3. Tout est restauré automatiquement !

```
┌─────────────────────────────────────────┐
│ [📤 Importer]                           │
└─────────────────────────────────────────┘
         ↓
Sélection du fichier .json
         ↓
Restauration complète
```

### Ce qui est Restauré

✅ **Tous les sites** avec leurs positions exactes  
✅ **Modèles de propagation** de chaque site  
✅ **Paramètres radio** (puissance, fréquence, hauteur)  
✅ **Environnements** (urbain, suburbain, rural)  
✅ **État des sites** (actif/inactif)  
✅ **Zone géographique** (prédéfinie ou personnalisée)  
✅ **Modèle global** par défaut  
✅ **Rayons de couverture** calculés  

### Notification

```
┌─────────────────────────────────────────┐
│ ✓ Import réussi                         │
│ 5 sites importés avec tous leurs        │
│ paramètres                               │
└─────────────────────────────────────────┘
```

## 🔄 Workflow Complet

### Scénario 1 : Sauvegarde de Travail

```
1. Planifier réseau à Dakar
   ├─ Ajouter 10 sites
   ├─ Configurer chaque site
   └─ Ajuster les modèles

2. Exporter
   ├─ Clic sur "Exporter"
   └─ Fichier: lte-planning-dakar-2024-01-15.json

3. Continuer plus tard
   ├─ Clic sur "Importer"
   ├─ Sélectionner le fichier
   └─ Tout est restauré !
```

### Scénario 2 : Partage avec Équipe

```
1. Ingénieur A planifie
   ├─ Crée 15 sites
   └─ Exporte: projet-dakar.json

2. Partage le fichier
   └─ Email, Drive, etc.

3. Ingénieur B importe
   ├─ Ouvre l'application
   ├─ Importe projet-dakar.json
   └─ Voit exactement la même configuration
```

### Scénario 3 : Versions Multiples

```
1. Version 1 - Configuration initiale
   └─ Export: dakar-v1.json

2. Version 2 - Optimisation
   └─ Export: dakar-v2.json

3. Version 3 - Configuration finale
   └─ Export: dakar-v3.json

4. Comparer les versions
   ├─ Importer v1
   ├─ Noter les différences
   ├─ Importer v2
   └─ Choisir la meilleure
```

## 💡 Cas d'Usage

### Backup Régulier

```
Fréquence: Quotidienne
Action: Exporter à la fin de chaque session
Nom: projet-[date].json
Stockage: Cloud, Drive, Backup local
```

### Migration de Projet

```
Source: Ordinateur A
Export: projet-complet.json
Transfert: USB, Email, Cloud
Destination: Ordinateur B
Import: Restauration complète
```

### Archivage

```
Projet terminé
├─ Export final
├─ Nom: projet-final-[date].json
├─ Documentation
└─ Archivage long terme
```

### Collaboration

```
Équipe distribuée
├─ Membre 1: Planification initiale
├─ Export et partage
├─ Membre 2: Révision et ajustements
├─ Export version 2
└─ Membre 3: Validation finale
```

## 🎨 Format du Fichier

### Structure JSON

```json
{
  "version": "1.0",
  "exportDate": "ISO 8601 timestamp",
  "sites": [
    {
      "id": "unique-id",
      "name": "Site name",
      "position": { "lat": number, "lng": number },
      "power": number,
      "frequency": number,
      "antennaHeight": number,
      "coverageRadius": number,
      "environment": "urban|suburban|rural",
      "isActive": boolean,
      "createdAt": "ISO 8601 timestamp",
      "propagationModel": "okumura-hata|cost231-hata|3gpp"
    }
  ],
  "globalPropagationModel": "okumura-hata|cost231-hata|3gpp",
  "location": {
    "type": "predefined|custom",
    "id": "location-id (if predefined)",
    "name": "Location name",
    "center|position": { "lat": number, "lng": number },
    "zoom": number
  },
  "statistics": {
    "totalSites": number,
    "activeSites": number,
    "coverage": { ... },
    "modelDistribution": { ... }
  }
}
```

### Validation

Le fichier est validé lors de l'import :
- ✅ Format JSON valide
- ✅ Champ `sites` présent et tableau
- ✅ Structure des sites correcte
- ✅ Coordonnées GPS valides

## 🔒 Sécurité et Intégrité

### Données Locales

- Pas d'envoi vers un serveur
- Tout reste sur votre machine
- Vous contrôlez vos fichiers

### Validation

```javascript
// Validation automatique à l'import
if (!importData.sites || !Array.isArray(importData.sites)) {
  throw new Error('Format invalide');
}
```

### Gestion d'Erreurs

```
Fichier corrompu
├─ Détection automatique
├─ Message d'erreur clair
└─ Aucune modification des données existantes
```

## 📊 Statistiques Exportées

### Informations Incluses

```json
"statistics": {
  "totalSites": 5,
  "activeSites": 5,
  "coverage": {
    "totalCoverage": 125.5,
    "averageRadius": 3.2,
    "activeSites": 5,
    "modelUsed": "COST 231-Hata"
  },
  "modelDistribution": {
    "okumura-hata": 2,
    "cost231-hata": 2,
    "3gpp": 1
  }
}
```

### Utilité

- **Audit** : Vérifier la configuration
- **Reporting** : Générer des rapports
- **Analyse** : Comparer différentes versions
- **Documentation** : Archiver les détails

## 🐛 Résolution de Problèmes

### Import Échoue

**Problème** : "Le fichier est invalide ou corrompu"

**Solutions** :
1. Vérifier que c'est un fichier .json
2. Ouvrir le fichier dans un éditeur de texte
3. Vérifier la structure JSON
4. Réexporter depuis l'application source

### Sites Non Visibles

**Problème** : Sites importés mais pas sur la carte

**Solutions** :
1. Vérifier la zone géographique
2. Zoomer/dézoomer sur la carte
3. Vérifier que les sites sont actifs
4. Recharger la page

### Modèles Non Appliqués

**Problème** : Modèles de propagation incorrects

**Solutions** :
1. Vérifier le champ `propagationModel` dans le JSON
2. Réimporter le fichier
3. Reconfigurer manuellement si nécessaire

### Coordonnées Incorrectes

**Problème** : Sites mal positionnés

**Solutions** :
1. Vérifier les coordonnées dans le JSON
2. Format attendu : `{ "lat": number, "lng": number }`
3. Latitude : -90 à 90
4. Longitude : -180 à 180

## ⚡ Bonnes Pratiques

### Nommage des Fichiers

```
✅ Bon:
- lte-planning-dakar-2024-01-15.json
- projet-senegal-v2.json
- backup-daily-2024-01-15.json

❌ Mauvais:
- export.json
- fichier.json
- 123.json
```

### Organisation

```
Dossier Projet/
├── exports/
│   ├── dakar-v1-2024-01-10.json
│   ├── dakar-v2-2024-01-12.json
│   └── dakar-final-2024-01-15.json
├── backups/
│   ├── backup-2024-01-10.json
│   └── backup-2024-01-15.json
└── archives/
    └── projet-termine-2024-01-15.json
```

### Fréquence de Sauvegarde

- **Travail actif** : Toutes les heures
- **Fin de session** : Systématique
- **Modifications majeures** : Immédiatement
- **Versions** : À chaque étape importante

## 🎯 Résultat

✅ **Export complet** - Tous les paramètres sauvegardés  
✅ **Import facile** - Restauration en un clic  
✅ **Partage simple** - Fichier JSON standard  
✅ **Versioning** - Plusieurs versions possibles  
✅ **Backup sécurisé** - Données protégées  
✅ **Collaboration** - Travail d'équipe facilité  

Votre planification LTE est maintenant sauvegardable et partageable en toute simplicité ! 📦✨
