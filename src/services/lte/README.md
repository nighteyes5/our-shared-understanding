# Services LTE - Logique Métier

Cette couche contient toute la logique métier pour les calculs LTE, séparée de l'interface utilisateur.

## Architecture

```
src/services/lte/
├── constants.ts           # Constantes et paramètres
├── propagationModels.ts   # Modèles de propagation radio
├── linkBudgetService.ts   # Calculs de bilan de liaison
├── coverageService.ts     # Calculs de couverture
├── calculationService.ts  # Service principal orchestrant les calculs
├── index.ts              # Point d'entrée
└── README.md             # Cette documentation
```

## Services

### 1. **PropagationModelsService**
Implémente les modèles de propagation radio :
- **Okumura-Hata** (150-1500 MHz)
- **COST 231-Hata** (1500-2000 MHz) 
- **3GPP TR 36.814** (jusqu'à 6000 MHz)

### 2. **LinkBudgetService**
Calculs de bilan de liaison :
- EIRP (Puissance Isotrope Rayonnée Équivalente)
- Gains et pertes
- Marges de sécurité

### 3. **CoverageService**
Calculs de couverture :
- Recherche de portée maximale
- Surface de cellule
- Nombre de sites nécessaires

### 4. **LTECalculationService**
Service principal qui orchestre tous les calculs et fournit l'API unifiée.

## Utilisation

```typescript
import { LTECalculationService } from '@/services/lte';

// Calcul pour un modèle spécifique
const result = LTECalculationService.calculateForModel('okumura-hata', params);

// Comparaison de tous les modèles
const comparison = LTECalculationService.compareModels(params);

// Génération de données pour graphique
const coverageData = LTECalculationService.generateCoverageData(params);
```

## Avantages de cette architecture

1. **Séparation des responsabilités** : Logique métier isolée de l'UI
2. **Testabilité** : Services facilement testables unitairement
3. **Réutilisabilité** : Services utilisables dans différents contextes
4. **Maintenabilité** : Code organisé et modulaire
5. **Extensibilité** : Facile d'ajouter de nouveaux modèles ou calculs

## Tests

Les services peuvent être testés indépendamment :

```typescript
import { PropagationModelsService } from '@/services/lte';

describe('PropagationModelsService', () => {
  it('should calculate Okumura-Hata correctly', () => {
    const result = PropagationModelsService.calculateOkumuraHata(
      900, 30, 1.5, 5, 'urban'
    );
    expect(result).toBeCloseTo(expectedValue, 2);
  });
});
```