# Guide du Panneau de Configuration avec Scroll

## 🎯 Fonctionnalité

Le panneau de configuration du site dispose maintenant d'un **scroll interne indépendant**. Cela signifie que :

- ✅ Seul le panneau de configuration défile
- ✅ La carte reste fixe et visible
- ✅ Le header du panneau reste en place
- ✅ Vous pouvez accéder à tous les paramètres sans faire défiler toute la page

## 📐 Caractéristiques Techniques

### Hauteur Fixe
Le panneau a une hauteur calculée dynamiquement :
```tsx
className="h-[calc(100vh-20rem)]"
```
- `100vh` = hauteur totale de la fenêtre
- `-20rem` = espace pour le header et les marges

### Scroll Personnalisé
Une scrollbar stylisée avec les couleurs de votre palette :
- **Largeur** : 8px (discrète mais visible)
- **Couleur** : Bleu LTE avec transparence
- **Hover** : Plus opaque au survol
- **Track** : Couleur muted pour le fond

### Structure Flex
```tsx
<Card className="w-full h-full flex flex-col">
  <CardHeader className="flex-shrink-0">
    {/* Header fixe */}
  </CardHeader>
  
  <CardContent className="flex-1 overflow-y-auto custom-scrollbar">
    {/* Contenu scrollable */}
  </CardContent>
</Card>
```

## 🎨 Personnalisation

### Modifier la Hauteur
Dans `src/pages/MapPlanning.tsx` :
```tsx
// Plus petit panneau
<div className="h-[calc(100vh-25rem)]">

// Plus grand panneau
<div className="h-[calc(100vh-15rem)]">

// Hauteur fixe en pixels
<div className="h-[600px]">
```

### Modifier le Style de Scrollbar
Dans `src/index.css` :
```css
.custom-scrollbar::-webkit-scrollbar {
  width: 12px; /* Plus large */
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: hsl(var(--accent)); /* Couleur différente */
  border-radius: 8px; /* Plus arrondi */
}
```

### Ajouter un Indicateur de Scroll
Pour montrer visuellement qu'il y a du contenu en dessous :
```tsx
<CardContent className="flex-1 overflow-y-auto custom-scrollbar scroll-shadow">
```

## 💡 Bonnes Pratiques

### 1. Padding en Bas
Toujours ajouter un padding en bas du contenu scrollable :
```tsx
<TabsContent value="config" className="space-y-6 mt-6 pb-6">
```
Cela évite que le dernier élément soit collé au bord.

### 2. Header Sticky
Les onglets restent visibles pendant le scroll :
```tsx
<TabsList className="sticky top-0 z-10 bg-background">
```

### 3. Padding à Droite
Ajouter un peu d'espace pour la scrollbar :
```tsx
<CardContent className="pr-2">
```

## 🔧 Utilisation dans d'Autres Composants

Pour appliquer le même comportement ailleurs :

```tsx
// 1. Conteneur avec hauteur fixe
<div className="h-[500px] overflow-hidden">
  
  // 2. Composant avec flex column
  <Card className="h-full flex flex-col">
    
    // 3. Header fixe
    <CardHeader className="flex-shrink-0">
      Titre
    </CardHeader>
    
    // 4. Contenu scrollable
    <CardContent className="flex-1 overflow-y-auto custom-scrollbar pr-2">
      {/* Votre contenu long ici */}
      <div className="pb-6">
        {/* ... */}
      </div>
    </CardContent>
  </Card>
</div>
```

## 📱 Responsive

Le scroll fonctionne sur tous les écrans :

- **Desktop** : Scrollbar visible et stylisée
- **Tablet** : Scrollbar adaptée
- **Mobile** : Scroll natif du système

## 🎯 Avantages

1. **Meilleure UX** : La carte reste toujours visible
2. **Navigation facile** : Accès rapide à tous les paramètres
3. **Pas de confusion** : Seul le panneau défile, pas toute la page
4. **Visuel clair** : Scrollbar stylisée selon votre palette
5. **Performance** : Pas de re-render de la carte lors du scroll

## 🐛 Dépannage

### Le scroll ne fonctionne pas
- Vérifiez que le conteneur parent a une hauteur fixe
- Vérifiez que `overflow-y-auto` est bien appliqué
- Vérifiez que le contenu est plus grand que le conteneur

### La scrollbar n'est pas visible
- Vérifiez que la classe `custom-scrollbar` est appliquée
- Vérifiez que les styles CSS sont bien chargés
- Sur certains navigateurs, la scrollbar n'apparaît que lors du hover

### Le contenu est coupé
- Ajoutez `pb-6` au contenu pour un padding en bas
- Vérifiez que `flex-1` est bien sur le CardContent
- Vérifiez que `flex-shrink-0` est sur le CardHeader

## 🎨 Exemple Complet

```tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ScrollablePanel() {
  return (
    <div className="h-[calc(100vh-20rem)] overflow-hidden">
      <Card className="h-full flex flex-col bg-card">
        <CardHeader className="flex-shrink-0 border-b">
          <CardTitle>Configuration</CardTitle>
        </CardHeader>
        
        <CardContent className="flex-1 overflow-y-auto custom-scrollbar pr-2">
          <div className="space-y-4 pb-6">
            {/* Votre contenu ici */}
            <div className="p-4 bg-muted rounded">Section 1</div>
            <div className="p-4 bg-muted rounded">Section 2</div>
            <div className="p-4 bg-muted rounded">Section 3</div>
            {/* ... plus de contenu ... */}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

Cette approche garantit une expérience utilisateur fluide et professionnelle ! 🚀
