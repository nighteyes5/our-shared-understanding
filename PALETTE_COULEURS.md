# Palette de Couleurs LTE/RF - Guide d'Utilisation

## 🎨 Palette Principale

### Couleurs de Base

| Usage | Couleur | Hex | Classe Tailwind |
|-------|---------|-----|-----------------|
| **Background principal** | Bleu très clair | `#F6F9FC` | `bg-background` ou `bg-lte-bg` |
| **Cartes / Panels** | Blanc pur | `#FFFFFF` | `bg-card` ou `bg-lte-card` |
| **Header / Sidebar** | Bleu nuit | `#0B1F33` | `bg-sidebar` ou `bg-lte-header` |
| **Texte principal** | Gris foncé | `#1F2937` | `text-foreground` ou `text-lte-text` |
| **Texte secondaire** | Gris | `#6B7280` | `text-muted-foreground` ou `text-lte-text-secondary` |

### Couleurs Techniques (Immersives)

| Usage | Couleur | Hex | Classe Tailwind |
|-------|---------|-----|-----------------|
| **Primaire (actions)** | Bleu LTE | `#2563EB` | `bg-primary` ou `bg-tech-primary` |
| **Secondaire (hover)** | Bleu clair | `#3B82F6` | `bg-secondary` ou `bg-tech-secondary` |
| **Accent data / stats** | Cyan radio | `#06B6D4` | `bg-accent` ou `bg-tech-cyan` |
| **Succès / OK** | Vert soft | `#16A34A` | `bg-success` ou `bg-tech-success` |
| **Alerte / pertes** | Orange RF | `#F59E0B` | `bg-warning` ou `bg-tech-warning` |
| **Erreur critique** | Rouge | `#DC2626` | `bg-destructive` ou `bg-tech-error` |

## 📋 Utilisation dans le Code

### Interface Principale

```tsx
// Page avec background bleu très clair
<div className="min-h-screen bg-background text-foreground">
  
  {/* Header / Navigation - Bleu nuit */}
  <header className="bg-lte-header text-white p-4">
    <nav className="flex gap-4">
      <a className="hover:text-tech-cyan transition-colors">Accueil</a>
      <a className="hover:text-tech-cyan transition-colors">Carte LTE</a>
    </nav>
  </header>

  {/* Contenu principal */}
  <main className="container mx-auto p-6">
    {/* Carte blanche */}
    <Card className="bg-card shadow-lg">
      <CardHeader>
        <CardTitle className="text-lte-text">Calculs LTE</CardTitle>
        <CardDescription className="text-lte-text-secondary">
          Paramètres de couverture radio
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Contenu */}
      </CardContent>
    </Card>
  </main>
</div>
```

### Boutons et Actions

```tsx
// Bouton principal - Bleu LTE
<Button className="bg-primary hover:bg-primary/90">
  Calculer la couverture
</Button>

// Bouton secondaire - Bleu clair
<Button variant="secondary" className="hover:bg-secondary/90">
  Réinitialiser
</Button>

// Bouton avec accent cyan (stats/data)
<Button className="bg-accent hover:bg-accent/90">
  Voir les statistiques
</Button>

// Bouton destructif
<Button variant="destructive">
  Supprimer
</Button>
```

### Indicateurs de Statut

```tsx
// Succès - Vert soft
<Badge className="bg-success text-white">
  Signal OK
</Badge>

// Alerte - Orange RF
<Badge className="bg-warning text-white">
  Pertes élevées
</Badge>

// Erreur - Rouge
<Badge className="bg-destructive text-white">
  Erreur critique
</Badge>

// Info - Cyan radio
<Badge className="bg-info text-white">
  Données disponibles
</Badge>
```

### Statistiques et Données RF

```tsx
// Carte de statistiques avec accent cyan
<Card className="bg-card border-l-4 border-tech-cyan">
  <CardHeader>
    <CardTitle className="text-tech-cyan">RSRP Moyen</CardTitle>
  </CardHeader>
  <CardContent>
    <p className="text-3xl font-bold text-lte-text">-85 dBm</p>
    <p className="text-lte-text-secondary">Excellent signal</p>
  </CardContent>
</Card>

// Indicateur de couverture
<div className="space-y-2">
  <div className="flex justify-between text-sm">
    <span className="text-lte-text">Couverture</span>
    <span className="text-tech-success font-semibold">95%</span>
  </div>
  <Progress value={95} className="bg-muted">
    <div className="bg-tech-success h-full" style={{width: '95%'}} />
  </Progress>
</div>
```

### Formulaires

```tsx
<form className="space-y-4 bg-card p-6 rounded-lg shadow">
  <div>
    <Label className="text-lte-text">Fréquence (MHz)</Label>
    <Input 
      type="number"
      className="bg-input border-border focus:ring-primary focus:border-primary"
      placeholder="2600"
    />
  </div>
  
  <div>
    <Label className="text-lte-text">Puissance (dBm)</Label>
    <Input 
      type="number"
      className="bg-input border-border focus:ring-primary focus:border-primary"
      placeholder="46"
    />
  </div>

  <Button className="w-full bg-primary hover:bg-primary/90">
    Lancer le calcul
  </Button>
</form>
```

### Alertes et Notifications

```tsx
// Succès
<Alert className="border-success bg-success/10">
  <CheckCircle className="h-4 w-4 text-success" />
  <AlertTitle className="text-success">Calcul terminé</AlertTitle>
  <AlertDescription className="text-lte-text-secondary">
    La couverture a été calculée avec succès
  </AlertDescription>
</Alert>

// Avertissement
<Alert className="border-warning bg-warning/10">
  <AlertTriangle className="h-4 w-4 text-warning" />
  <AlertTitle className="text-warning">Pertes RF élevées</AlertTitle>
  <AlertDescription className="text-lte-text-secondary">
    Les pertes dépassent 140 dB dans certaines zones
  </AlertDescription>
</Alert>

// Erreur
<Alert className="border-destructive bg-destructive/10">
  <XCircle className="h-4 w-4 text-destructive" />
  <AlertTitle className="text-destructive">Erreur de calcul</AlertTitle>
  <AlertDescription className="text-lte-text-secondary">
    Paramètres invalides détectés
  </AlertDescription>
</Alert>
```

## 🎯 Recommandations d'Usage

### Hiérarchie Visuelle

1. **Actions principales** → `bg-primary` (Bleu LTE #2563EB)
2. **Actions secondaires** → `bg-secondary` (Bleu clair #3B82F6)
3. **Données/Stats** → `bg-accent` ou `text-tech-cyan` (Cyan #06B6D4)
4. **Statuts positifs** → `bg-success` (Vert #16A34A)
5. **Alertes** → `bg-warning` (Orange #F59E0B)
6. **Erreurs** → `bg-destructive` (Rouge #DC2626)

### Contraste et Lisibilité

- **Sur fond clair** (`bg-background` ou `bg-card`) → Utilisez `text-lte-text` pour le texte principal
- **Sur fond foncé** (`bg-lte-header`) → Utilisez `text-white` ou `text-sidebar-foreground`
- **Texte secondaire** → Toujours `text-lte-text-secondary` ou `text-muted-foreground`

### Cohérence Thématique

- **Navigation/Header** → Toujours `bg-lte-header` (Bleu nuit)
- **Cartes de contenu** → Toujours `bg-card` (Blanc pur)
- **Background page** → Toujours `bg-background` (Bleu très clair)
- **Boutons CTA** → Toujours `bg-primary` (Bleu LTE)

## 🌓 Mode Sombre

Le mode sombre adapte automatiquement les couleurs pour un environnement immersif :

```tsx
// Activer le mode sombre
<html className="dark">
```

En mode sombre :
- Background devient bleu nuit profond
- Les cartes sont légèrement plus claires que le background
- Les couleurs techniques restent vibrantes pour la lisibilité
- Le contraste est optimisé pour les longues sessions

## ✨ Exemples Complets

### Dashboard LTE

```tsx
<div className="min-h-screen bg-background">
  <header className="bg-lte-header text-white p-4 shadow-lg">
    <h1 className="text-2xl font-bold">Planification LTE</h1>
  </header>

  <main className="container mx-auto p-6 space-y-6">
    {/* Statistiques */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="bg-card border-l-4 border-tech-cyan">
        <CardContent className="pt-6">
          <p className="text-sm text-lte-text-secondary">Sites actifs</p>
          <p className="text-3xl font-bold text-tech-cyan">142</p>
        </CardContent>
      </Card>
      
      <Card className="bg-card border-l-4 border-tech-success">
        <CardContent className="pt-6">
          <p className="text-sm text-lte-text-secondary">Couverture</p>
          <p className="text-3xl font-bold text-tech-success">94.5%</p>
        </CardContent>
      </Card>
      
      <Card className="bg-card border-l-4 border-tech-warning">
        <CardContent className="pt-6">
          <p className="text-sm text-lte-text-secondary">Alertes</p>
          <p className="text-3xl font-bold text-tech-warning">3</p>
        </CardContent>
      </Card>
    </div>

    {/* Formulaire de calcul */}
    <Card className="bg-card">
      <CardHeader>
        <CardTitle className="text-lte-text">Nouveau calcul</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <Input placeholder="Fréquence" className="bg-input" />
          <Button className="bg-primary hover:bg-primary/90 w-full">
            Calculer
          </Button>
        </form>
      </CardContent>
    </Card>
  </main>
</div>
```

## 🔧 Variables CSS

Toutes les couleurs sont définies dans `src/index.css` en format HSL pour faciliter les variations :

```css
:root {
  --primary: 217 91% 60%;    /* Bleu LTE */
  --accent: 189 94% 43%;     /* Cyan radio */
  --success: 142 71% 45%;    /* Vert soft */
  --warning: 38 92% 50%;     /* Orange RF */
  --destructive: 0 72% 51%;  /* Rouge */
}
```

Cette palette est optimisée pour les applications RF/LTE avec une hiérarchie visuelle claire et des couleurs techniques immersives ! 📡
