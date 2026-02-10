# Corrections - Sites Inactifs et Calculs de Couverture

## Problèmes Corrigés

### 1. Sites Désactivés - Rayonnement
**Problème :** Les sites désactivés affichaient encore un cercle de couverture sur la carte.

**Solution :** 
- Modifié `OpenLayersMap.tsx` pour ne créer un cercle de couverture QUE si `site.isActive === true`
- Les sites inactifs affichent maintenant uniquement le point (marqueur) sans rayonnement
- Ajout de commentaires explicites dans le code pour clarifier ce comportement

**Fichier modifié :** `src/components/map/OpenLayersMap.tsx`

### 2. Couleurs de Rayonnement selon la Puissance
**Problème :** Les couleurs n'étaient pas clairement définies selon les niveaux de puissance.

**Solution :** Amélioration du code avec des commentaires clairs :
- **Site haute puissance (≥45 dBm)** : Vert foncé `#059669`
- **Site puissance normale (40-44 dBm)** : Vert `#22c55e`
- **Site puissance réduite (35-39 dBm)** : Orange `#f59e0b`
- **Site très faible (<35 dBm)** : Rouge `#ef4444`
- **Site inactif** : Gris `#6b7280`

**Fichier modifié :** `src/components/map/OpenLayersMap.tsx`

### 3. Couleurs de Couverture selon la Qualité
**Problème :** Les couleurs de couverture n'étaient pas assez distinctes.

**Solution :** Amélioration des couleurs et opacités :
- **Couverture excellente** : Vert foncé `#059669` (opacité 25%)
- **Couverture bonne** : Vert `#22c55e` (opacité 20%)
- **Couverture correcte** : Orange `#f59e0b` (opacité 18%)
- **Couverture faible** : Rouge `#ef4444` (opacité 15%)

**Fichier modifié :** `src/components/map/OpenLayersMap.tsx`

### 4. Décalages dans les Calculs en Temps Réel
**Problème :** Les statistiques de couverture utilisaient `site.coverageRadius` directement au lieu d'utiliser le service de calcul avec le modèle de propagation sélectionné.

**Solution :**
- Modifié `CoverageStats.tsx` et `SimpleCoverageStats.tsx` pour utiliser `LTECoverageService.calculateCoverageStatistics()`
- Les calculs utilisent maintenant le modèle de propagation sélectionné (Okumura-Hata, COST 231-Hata, ou 3GPP)
- Ajout du paramètre `propagationModel` aux composants de statistiques

**Fichiers modifiés :**
- `src/components/map/CoverageStats.tsx`
- `src/components/map/SimpleCoverageStats.tsx`

### 5. Couverture Totale et Rayon Moyen
**Problème :** Les valeurs affichées ne correspondaient pas aux calculs réels du modèle de propagation.

**Solution :**
- Utilisation de `LTECoverageService.calculateCoverageStatistics()` qui retourne :
  - `totalCoverage` : Surface totale calculée avec le modèle de propagation
  - `averageRadius` : Rayon moyen calculé pour les sites actifs uniquement
  - `activeSites` : Nombre de sites actifs
  - `modelUsed` : Nom du modèle utilisé
- Les sites inactifs sont maintenant correctement exclus des calculs (rayon = 0)

**Fichiers modifiés :**
- `src/components/map/CoverageStats.tsx`
- `src/components/map/SimpleCoverageStats.tsx`
- `src/services/map/lteCoverageService.ts`

### 6. Affichage du Rayon dans les Détails des Sites
**Problème :** Le rayon affiché pour chaque site ne tenait pas compte du modèle de propagation ni de l'état actif/inactif.

**Solution :**
- Utilisation de `LTECoverageService.calculateRealCoverageRadius()` pour chaque site
- Affichage de "0.0 km" pour les sites inactifs
- Calcul en temps réel avec le modèle de propagation sélectionné

**Fichiers modifiés :**
- `src/components/map/CoverageStats.tsx`
- `src/components/map/SimpleCoverageStats.tsx`

## Comportement Attendu

### Sites Actifs
- ✅ Affichent un marqueur coloré selon la puissance
- ✅ Affichent un cercle de couverture coloré selon la qualité
- ✅ Rayon calculé avec le modèle de propagation sélectionné
- ✅ Inclus dans les statistiques de couverture

### Sites Inactifs
- ✅ Affichent uniquement un marqueur gris
- ✅ **Aucun cercle de couverture** (pas de rayonnement)
- ✅ Rayon = 0 km
- ✅ Exclus des calculs de couverture totale et rayon moyen

## Tests Recommandés

1. **Test d'activation/désactivation :**
   - Créer un site actif → vérifier qu'il a un cercle de couverture
   - Désactiver le site → vérifier que le cercle disparaît
   - Réactiver le site → vérifier que le cercle réapparaît

2. **Test des couleurs :**
   - Créer des sites avec différentes puissances (35, 40, 45 dBm)
   - Vérifier que les couleurs correspondent aux niveaux définis

3. **Test des statistiques :**
   - Créer plusieurs sites actifs
   - Vérifier que "Couverture totale" et "Rayon moyen" sont cohérents
   - Désactiver un site → vérifier que les statistiques se mettent à jour
   - Vérifier que les sites inactifs ne sont pas comptés

4. **Test des modèles de propagation :**
   - Changer le modèle de propagation
   - Vérifier que les rayons et statistiques se recalculent automatiquement

## Fichiers Modifiés

1. `src/components/map/OpenLayersMap.tsx` - Affichage carte et sites
2. `src/components/map/CoverageStats.tsx` - Statistiques détaillées
3. `src/components/map/SimpleCoverageStats.tsx` - Statistiques simplifiées
4. `src/services/map/lteCoverageService.ts` - Service de calcul de couverture

## Notes Techniques

- Les calculs utilisent maintenant systématiquement le service `LTECoverageService`
- Le modèle de propagation est passé en paramètre à tous les composants de statistiques
- Les sites inactifs retournent toujours un rayon de 0 km
- Les couleurs sont définies de manière cohérente dans tout le code
