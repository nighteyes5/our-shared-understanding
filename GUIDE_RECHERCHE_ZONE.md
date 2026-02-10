# Guide de Recherche de Zone Géographique

## 🎯 Fonctionnalité

Vous pouvez maintenant **rechercher n'importe quelle zone géographique** dans le monde pour planifier votre réseau LTE ! Plus besoin d'être limité aux zones prédéfinies.

## 🔍 Comment Utiliser

### Étape 1 : Ouvrir la Recherche

Dans la page de planification, à côté du sélecteur de zone :

```
┌─────────────────────────────────────────┐
│ Zone géographique                       │
│ ┌─────────────────────────────────────┐ │
│ │ Dakar (Sénégal)                  ▼ │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ [🔍 Rechercher une zone]                │
└─────────────────────────────────────────┘
```

Cliquez sur **"Rechercher une zone"**

### Étape 2 : Entrer le Nom

Une fenêtre s'ouvre :

```
┌─────────────────────────────────────────┐
│ Rechercher une zone géographique        │
├─────────────────────────────────────────┤
│ Nom de la zone                          │
│ ┌─────────────────────────────────────┐ │
│ │ Ex: Dakar, Paris, New York...      │ │
│ └─────────────────────────────────────┘ │
│                          [Rechercher]   │
└─────────────────────────────────────────┘
```

Entrez le nom de la zone recherchée

### Étape 3 : Sélectionner le Résultat

Les résultats s'affichent :

```
┌─────────────────────────────────────────┐
│ Résultats de recherche                  │
├─────────────────────────────────────────┤
│ 📍 Paris                    [France]    │
│    Paris, Île-de-France, France         │
│    Lat: 48.8566  Lng: 2.3522  [city]   │
├─────────────────────────────────────────┤
│ 📍 Paris                    [USA]       │
│    Paris, Texas, United States          │
│    Lat: 33.6609  Lng: -95.5555  [city] │
└─────────────────────────────────────────┘
```

Cliquez sur le résultat souhaité

### Étape 4 : Carte Centrée

La carte se centre automatiquement sur la zone sélectionnée avec le niveau de zoom approprié !

## 🌍 Exemples de Recherche

### Villes
```
Recherche: "Thiès"
Résultat: Thiès, Sénégal
Zoom: 12 (niveau ville)
```

### Régions
```
Recherche: "Casamance"
Résultat: Casamance, Sénégal
Zoom: 8 (niveau région)
```

### Pays
```
Recherche: "Sénégal"
Résultat: République du Sénégal
Zoom: 6 (niveau pays)
```

### Quartiers
```
Recherche: "Plateau, Dakar"
Résultat: Plateau, Dakar, Sénégal
Zoom: 15 (niveau quartier)
```

### Lieux Spécifiques
```
Recherche: "Aéroport Blaise Diagne"
Résultat: AIBD, Diass, Sénégal
Zoom: 14
```

## 💡 Conseils de Recherche

### Soyez Précis
❌ Mauvais : "centre"
✅ Bon : "Centre-ville de Dakar"

### Incluez le Pays si Nécessaire
❌ Ambigu : "Paris"
✅ Précis : "Paris, France"

### Utilisez les Noms Locaux
✅ "Thiès, Sénégal"
✅ "Saint-Louis, Sénégal"
✅ "Touba, Sénégal"

### Variez les Termes
Si pas de résultat, essayez :
- Nom complet : "Ziguinchor, Casamance, Sénégal"
- Nom court : "Ziguinchor"
- Nom alternatif : "Ziginchor"

## 🎨 Interface

### Fenêtre de Recherche

```
┌──────────────────────────────────────────────────┐
│ Rechercher une zone géographique                 │
│ Recherchez n'importe quelle ville, région ou     │
│ pays dans le monde                               │
├──────────────────────────────────────────────────┤
│                                                  │
│ Nom de la zone                                   │
│ ┌──────────────────────────────────┬──────────┐ │
│ │ Ex: Dakar, Paris, New York...    │ 🔍 Rech. │ │
│ └──────────────────────────────────┴──────────┘ │
│                                                  │
│ ┌────────────────────────────────────────────┐  │
│ │ 💡 Comment rechercher ?                    │  │
│ │ • Entrez le nom d'une ville, région ou pays│  │
│ │ • Soyez aussi précis que possible          │  │
│ │ • Vous pouvez inclure le pays              │  │
│ │ • Appuyez sur Entrée ou cliquez            │  │
│ └────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────┘
```

### Résultats Détaillés

Chaque résultat affiche :
- 📍 **Icône de localisation**
- **Nom principal** en gras
- **Badge du pays**
- **Nom complet** (adresse complète)
- **Coordonnées GPS** (Latitude, Longitude)
- **Type de lieu** (city, town, village, region, etc.)

## 🔧 Fonctionnement Technique

### API de Géocodage

Utilise **Nominatim** (OpenStreetMap) :
- Base de données mondiale
- Gratuit et open source
- Données à jour
- Multilingue

### Zoom Automatique

Le niveau de zoom s'adapte au type de lieu :

| Type | Zoom | Usage |
|------|------|-------|
| Pays | 6 | Vue d'ensemble nationale |
| Région/État | 8 | Vue régionale |
| Ville | 12 | Vue urbaine |
| Village | 14 | Vue locale |
| Quartier | 15 | Vue détaillée |

### Sélection dans la Liste

Une fois une zone personnalisée sélectionnée :
- Elle apparaît dans le sélecteur avec **(Personnalisée)**
- Elle reste active jusqu'à ce que vous changiez
- Vous pouvez revenir aux zones prédéfinies à tout moment

```
┌─────────────────────────────────────────┐
│ Zone géographique                       │
│ ┌─────────────────────────────────────┐ │
│ │ Paris (Personnalisée)            ▼ │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ Options:                                │
│ • Paris (Personnalisée)                 │
│ • Dakar (Sénégal)                       │
│ • Thiès (Sénégal)                       │
│ • Saint-Louis (Sénégal)                 │
└─────────────────────────────────────────┘
```

## 🌐 Cas d'Usage

### Planification Internationale

```
Projet: Réseau LTE en Côte d'Ivoire
1. Rechercher "Abidjan"
2. Placer les sites
3. Configurer selon les paramètres locaux
```

### Zones Rurales

```
Projet: Couverture rurale au Sénégal
1. Rechercher "Ferlo, Sénégal"
2. Utiliser modèle Okumura-Hata
3. Sites avec grande portée
```

### Zones Urbaines Denses

```
Projet: Densification urbaine
1. Rechercher "Plateau, Dakar"
2. Utiliser modèle 3GPP
3. Sites avec petite portée, haute capacité
```

### Zones Côtières

```
Projet: Couverture côtière
1. Rechercher "Petite Côte, Sénégal"
2. Adapter les paramètres pour zone maritime
3. Tenir compte de la propagation sur l'eau
```

## ⚡ Avantages

✅ **Flexibilité totale** - N'importe quelle zone dans le monde  
✅ **Recherche rapide** - Résultats en quelques secondes  
✅ **Précision GPS** - Coordonnées exactes  
✅ **Zoom adaptatif** - Niveau de zoom optimal automatique  
✅ **Données à jour** - Base OpenStreetMap actualisée  
✅ **Multilingue** - Recherche dans plusieurs langues  

## 🐛 Résolution de Problèmes

### Aucun Résultat Trouvé

**Problème** : "Aucun résultat trouvé"

**Solutions** :
- Vérifiez l'orthographe
- Essayez un nom plus général
- Ajoutez le pays : "Ville, Pays"
- Utilisez le nom en anglais

### Mauvais Résultat

**Problème** : Le résultat ne correspond pas

**Solutions** :
- Soyez plus précis dans la recherche
- Ajoutez des détails : "Ville, Région, Pays"
- Vérifiez les coordonnées GPS affichées

### Erreur de Recherche

**Problème** : "Erreur lors de la recherche"

**Solutions** :
- Vérifiez votre connexion internet
- Réessayez dans quelques secondes
- Utilisez une zone prédéfinie temporairement

## 📱 Workflow Complet

### Exemple : Planifier un Réseau à Touba

1. **Ouvrir la recherche**
   - Cliquer sur "Rechercher une zone"

2. **Rechercher**
   - Entrer "Touba, Sénégal"
   - Cliquer sur "Rechercher"

3. **Sélectionner**
   - Choisir "Touba, Diourbel, Sénégal"
   - La carte se centre automatiquement

4. **Planifier**
   - Ajouter des sites LTE
   - Configurer les paramètres
   - Calculer la couverture

5. **Exporter**
   - Exporter les sites avec la zone personnalisée

## 🎯 Résultat

Vous pouvez maintenant planifier des réseaux LTE **partout dans le monde** avec une recherche simple et rapide ! 🌍📡✨
