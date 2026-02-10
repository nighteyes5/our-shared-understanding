# Guide des Modèles de Propagation par Site

## 🎯 Fonctionnalité

Chaque site LTE peut maintenant avoir **son propre modèle de propagation** ! Cela permet une planification plus précise et adaptée aux conditions spécifiques de chaque emplacement.

## 📋 Modèles Disponibles

| Modèle | Fréquence | Usage Recommandé |
|--------|-----------|------------------|
| **Okumura-Hata** | 150-1500 MHz | Basses fréquences (700-900 MHz) |
| **COST 231-Hata** | 1500-2000 MHz | Fréquences moyennes (1800 MHz) |
| **3GPP TR 36.814** | 2000-6000 MHz | Hautes fréquences (2100-2600 MHz) |

## 🔧 Comment ça fonctionne

### Utilisation

1. **Cliquez sur un site** sur la carte
2. Le panneau de configuration s'ouvre
3. Dans la section **"Paramètres radio"**
4. Sélectionnez le **"Modèle de propagation"**
5. Le rayon se recalcule **automatiquement**
6. Cliquez sur **"Sauvegarder"**

### Interface

```
┌─────────────────────────────────────────┐
│ Paramètres radio                        │
├─────────────────────────────────────────┤
│ Modèle de propagation                   │
│ ┌─────────────────────────────────────┐ │
│ │ COST 231-Hata                    ▼ │ │
│ │ 1500-2000 MHz                      │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

## 💡 Cas d'Usage

### Scénario : Zone Mixte avec Différentes Fréquences

```
Site 1 (Bande 800 MHz)
├─ Modèle: Okumura-Hata
├─ Environnement: Rural
└─ Rayon: 8.5 km

Site 2 (Bande 1800 MHz)
├─ Modèle: COST 231-Hata
├─ Environnement: Urbain
└─ Rayon: 2.5 km

Site 3 (Bande 2600 MHz)
├─ Modèle: 3GPP TR 36.814
├─ Environnement: Urbain dense
└─ Rayon: 1.8 km
```

## 🔄 Calculs Automatiques

### Recalcul en Temps Réel

Quand vous changez le modèle :
1. Le rayon de couverture est **recalculé immédiatement**
2. Un **aperçu** s'affiche avant sauvegarde
3. La **surface couverte** est mise à jour
4. Le **modèle utilisé** est affiché

### Indicateur de Modèle

```
┌─────────────────────────────────────────┐
│ Modèle utilisé : COST 231-Hata          │
└─────────────────────────────────────────┘
```

## 📊 Stockage des Données

### Structure du Site

```typescript
interface LTESite {
  id: string;
  name: string;
  position: MapPosition;
  power: number;
  frequency: number;
  antennaHeight: number;
  coverageRadius: number;
  environment: 'urban' | 'suburban' | 'rural';
  isActive: boolean;
  createdAt: string;
  propagationModel: 'okumura-hata' | 'cost231-hata' | '3gpp';
}
```

### Exemple JSON

```json
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
  "createdAt": "2024-01-15T10:30:00Z",
  "propagationModel": "cost231-hata"
}
```

## 🎯 Avantages

✅ **Précision** - Chaque site utilise le modèle le plus adapté  
✅ **Flexibilité** - Mélanger différents modèles dans un réseau  
✅ **Optimisation** - Adapter selon fréquence et environnement  
✅ **Temps réel** - Aperçu immédiat des modifications  
✅ **Simplicité** - Interface intuitive et guidée  

## 🎨 Recommandations

### Par Fréquence

| Fréquence | Modèle Recommandé |
|-----------|-------------------|
| 700-900 MHz | Okumura-Hata |
| 1800 MHz | COST 231-Hata |
| 2100-2600 MHz | 3GPP TR 36.814 |

### Par Environnement

| Environnement | Modèle Recommandé |
|---------------|-------------------|
| Urbain dense | COST 231-Hata ou 3GPP |
| Suburbain | COST 231-Hata |
| Rural | Okumura-Hata |

## 🔍 Migration Automatique

Les sites existants sans modèle reçoivent automatiquement :
- **Okumura-Hata** si fréquence ≤ 1500 MHz
- **3GPP** si fréquence ≥ 2100 MHz
- **COST 231-Hata** pour les autres

Votre planification LTE est maintenant ultra-flexible avec des modèles de propagation individualisés par site ! 📡✨

## 🎨 Interface

### Sélecteur de Modèle

Dans le panneau de configuration du site :

```
┌─────────────────────────────────────────┐
│ Paramètres radio                        │
├─────────────────────────────────────────┤
│ Modèle de propagation                   │
│ ┌─────────────────────────────────────┐ │
│ │ COST 231-Hata                    ▼ │ │
│ │ 1500-2000 MHz, extension urbaine   │ │
│ └─────────────────────────────────────┘ │
│ Chaque site peut avoir son propre       │
│ modèle de propagation                   │
└─────────────────────────────────────────┘
```

### Indicateur de Modèle

Dans la section "Calculs en temps réel" :

```
┌─────────────────────────────────────────┐
│ Modèle utilisé : COST 231-Hata          │
└─────────────────────────────────────────┘
```

## 💡 Cas d'Usage

### Scénario 1 : Zone Mixte Urbaine/Rurale

```
Site 1 (Centre-ville Dakar)
├─ Modèle: COST 231-Hata
├─ Fréquence: 1800 MHz
└─ Rayon: 2.5 km

Site 2 (Périphérie)
├─ Modèle: Okumura-Hata
├─ Fréquence: 900 MHz
└─ Rayon: 5.2 km

Site 3 (Zone rurale)
├─ Modèle: Egli
├─ Fréquence: 800 MHz
└─ Rayon: 8.7 km
```

### Scénario 2 : Différentes Bandes de Fréquence

```
Site A (Bande 800 MHz)
├─ Modèle: Okumura-Hata
└─ Meilleure pénétration, longue portée

Site B (Bande 1800 MHz)
├─ Modèle: COST 231-Hata
└─ Capacité élevée, portée moyenne

Site C (Bande 2600 MHz)
├─ Modèle: SUI
└─ Très haute capacité, courte portée
```

## 🔄 Calculs Automatiques

### Recalcul en Temps Réel

Quand vous changez le modèle :
1. Le rayon de couverture est **recalculé immédiatement**
2. Un **aperçu** s'affiche avant sauvegarde
3. La **surface couverte** est mise à jour
4. Le **modèle utilisé** est affiché

### Aperçu des Modifications

```
┌─────────────────────────────────────────────────┐
│ Aperçu des modifications :                      │
│ Le rayon sera recalculé selon le modèle        │
│ Ericsson 9999 avec les nouveaux paramètres :   │
│ puissance 43 dBm, fréquence 1800 MHz,          │
│ hauteur 30 m, environnement urban.             │
└─────────────────────────────────────────────────┘
```

## 📊 Stockage des Données

### Structure du Site

```typescript
interface LTESite {
  id: string;
  name: string;
  position: MapPosition;
  power: number;
  frequency: number;
  antennaHeight: number;
  coverageRadius: number;
  environment: 'urban' | 'suburban' | 'rural';
  isActive: boolean;
  createdAt: string;
  propagationModel: PropagationModel; // ✨ Nouveau champ
}
```

### Exemple JSON

```json
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
  "createdAt": "2024-01-15T10:30:00Z",
  "propagationModel": "cost231-hata"
}
```

## 🎯 Avantages

### 1. Précision Améliorée
- Chaque site utilise le modèle le plus adapté
- Calculs plus réalistes selon les conditions locales
- Meilleure estimation de la couverture

### 2. Flexibilité
- Mélanger différents modèles dans un même réseau
- Adapter le modèle selon la fréquence du site
- Optimiser selon le type de zone

### 3. Planification Optimale
- Zones urbaines : COST 231-Hata
- Zones rurales : Egli ou Okumura-Hata
- Hautes fréquences : SUI
- Basses fréquences : Okumura-Hata

## 🔍 Détails Techniques

### Service de Sites

```typescript
// Création avec modèle spécifique
static addSite(
  position: MapPosition, 
  name?: string, 
  propagationModel: PropagationModel = 'cost231-hata'
): LTESite {
  const newSite: LTESite = {
    // ...
    propagationModel: propagationModel // Stocké dans le site
  };
  
  // Calcul avec le modèle du site
  newSite.coverageRadius = LTECoverageService.calculateRealCoverageRadius(
    newSite, 
    newSite.propagationModel
  );
  
  return newSite;
}
```

### Mise à Jour

```typescript
// Le modèle peut être changé
static updateSite(siteId: string, updates: Partial<LTESite>): LTESite | null {
  const updatedSite = { ...sites[siteIndex], ...updates };
  
  // Recalcul si le modèle a changé
  if (updates.propagationModel !== undefined) {
    updatedSite.coverageRadius = LTECoverageService.calculateRealCoverageRadius(
      updatedSite, 
      updatedSite.propagationModel
    );
  }
  
  return updatedSite;
}
```

### Affichage sur la Carte

```typescript
// Chaque site utilise son propre modèle
sites.forEach((site) => {
  const siteModel = site.propagationModel || propagationModel;
  const realRadius = LTECoverageService.calculateRealCoverageRadius(
    site, 
    siteModel
  );
  // Affichage avec le rayon calculé
});
```

## 📱 Workflow Complet

### Étape 1 : Ajouter un Site
```
Clic sur "Ajouter Site" → Clic sur la carte
↓
Site créé avec modèle global par défaut
```

### Étape 2 : Configurer le Site
```
Clic sur le site → Panneau de configuration
↓
Sélection du modèle de propagation
↓
Ajustement des paramètres (puissance, fréquence, etc.)
```

### Étape 3 : Aperçu
```
Modification des paramètres
↓
Calcul en temps réel du nouveau rayon
↓
Affichage de l'aperçu
```

### Étape 4 : Sauvegarde
```
Clic sur "Sauvegarder"
↓
Rayon recalculé avec le nouveau modèle
↓
Carte mise à jour avec la nouvelle couverture
```

## 🎨 Recommandations

### Par Fréquence

| Fréquence | Modèle Recommandé |
|-----------|-------------------|
| 700-900 MHz | Okumura-Hata ou Egli |
| 1800 MHz | COST 231-Hata |
| 2100 MHz | COST 231-Hata ou SUI |
| 2600 MHz | SUI |

### Par Environnement

| Environnement | Modèle Recommandé |
|---------------|-------------------|
| Urbain dense | COST 231-Hata |
| Suburbain | Okumura-Hata |
| Rural | Egli ou Okumura-Hata |
| Espace libre | Free Space |

### Par Objectif

| Objectif | Modèle Recommandé |
|----------|-------------------|
| Couverture maximale | Egli (basse fréquence) |
| Capacité élevée | SUI (haute fréquence) |
| Équilibre | COST 231-Hata |
| Étude théorique | Free Space |

## 🚀 Résultat

✅ Chaque site a son propre modèle de propagation  
✅ Calculs individualisés et précis  
✅ Interface intuitive pour changer le modèle  
✅ Aperçu en temps réel des modifications  
✅ Flexibilité maximale pour la planification  
✅ Optimisation selon les conditions locales  

Votre planification LTE est maintenant ultra-flexible et précise ! 📡✨
