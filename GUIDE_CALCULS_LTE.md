# Guide des Calculs LTE - Intégration Complète

## ✅ Fonctionnalités Implémentées

### 1. **Vraies Formules de Propagation**
- **Okumura-Hata** (150-1500 MHz) : Modèle classique pour GSM et LTE basses fréquences
- **COST 231-Hata** (1500-2000 MHz) : Extension pour LTE 1800/2100 MHz
- **3GPP TR 36.814** (2000-6000 MHz) : Modèle moderne pour LTE 2600 MHz et 5G

### 2. **Calculs de Couverture Réels**
- **Bilan de liaison** complet avec tous les paramètres
- **Recherche dichotomique** pour trouver la portée maximale
- **Surface de couverture** calculée selon la géométrie hexagonale
- **Mise à jour automatique** quand les paramètres changent

### 3. **Interface de Sélection de Modèle**
- **Sélecteur visuel** avec descriptions détaillées
- **Recommandations automatiques** selon la fréquence
- **Comparaison des modèles** avec domaines de validité
- **Recalcul en temps réel** lors du changement de modèle

## 🧮 Formules Utilisées

### Okumura-Hata (150-1500 MHz)
```
PL = 69.55 + 26.16*log10(f) - 13.82*log10(hb) - a(hm) + (44.9 - 6.55*log10(hb))*log10(d)
```
- Corrections pour environnement suburbain et rural
- Facteur de correction mobile selon la fréquence

### COST 231-Hata (1500-2000 MHz)
```
PL = 46.3 + 33.9*log10(f) - 13.82*log10(hb) - a(hm) + (44.9 - 6.55*log10(hb))*log10(d) + Cm
```
- Cm = 3 dB pour urbain, 0 dB pour suburbain/rural

### 3GPP TR 36.814 (2000-6000 MHz)
```
PL = 22*log10(d3D) + 28 + 20*log10(fc/1000)  [si d < dBP]
PL = 40*log10(d3D) + 7.8 - 18*log10(hb) - 18*log10(hm) + 2*log10(fc/1000)  [si d > dBP]
```
- Distance de cassure dBP calculée selon les hauteurs d'antennes

## 🗺️ Test des Fonctionnalités

### 1. **Accès à la Carte**
1. Dashboard → "Planification Géographique"
2. Sélectionnez une zone sénégalaise (Dakar, Thiès, etc.)
3. La carte OpenLayers s'affiche avec OpenStreetMap

### 2. **Test des Modèles de Propagation**
1. Allez dans l'onglet "Configuration"
2. Changez le modèle de propagation
3. Observez le recalcul automatique des rayons de couverture
4. Testez les recommandations selon la fréquence

### 3. **Ajout de Sites avec Calculs Réels**
1. Cliquez "Ajouter Site" puis sur la carte
2. Le rayon est calculé automatiquement selon :
   - Puissance : 43 dBm par défaut
   - Fréquence : 1800 MHz (adaptée au Sénégal)
   - Hauteur : 30m par défaut
   - Environnement : urbain par défaut

### 4. **Configuration Avancée**
1. Cliquez sur un site pour le configurer
2. Modifiez la puissance → Rayon recalculé
3. Changez la fréquence → Rayon recalculé
4. Modifiez l'environnement → Rayon recalculé

### 5. **Sites de Démonstration**
1. Cliquez "Sites démo"
2. 5 sites sont générés avec :
   - Fréquences réalistes (800, 1800, 2100, 2600 MHz)
   - Environnements variés
   - Calculs de couverture réels

## 📊 Vérification des Calculs

### Exemple de Calcul Manuel
**Site à Dakar :**
- Puissance : 43 dBm
- Fréquence : 1800 MHz
- Hauteur antenne : 30m
- Environnement : urbain

**Avec COST 231-Hata :**
1. Bilan de liaison max ≈ 140 dB
2. Recherche dichotomique → Portée ≈ 3-5 km
3. Rayon cellule = Portée × 0.65 ≈ 2-3 km
4. Surface = 3√3/2 × R² ≈ 10-25 km²

### Comparaison des Modèles
- **Okumura-Hata** : Portées plus importantes (basses fréquences)
- **COST 231-Hata** : Portées moyennes (fréquences LTE standard)
- **3GPP** : Portées plus faibles (hautes fréquences)

## 🎯 Points de Validation

### ✅ Vérifications Automatiques
- [ ] Les rayons changent quand on modifie la puissance
- [ ] Les rayons changent quand on modifie la fréquence
- [ ] Les rayons changent quand on change de modèle
- [ ] Les recommandations s'affichent selon la fréquence
- [ ] Les statistiques se mettent à jour en temps réel

### ✅ Cohérence des Calculs
- [ ] Plus de puissance = plus de portée
- [ ] Plus de fréquence = moins de portée
- [ ] Environnement urbain = moins de portée que rural
- [ ] Hauteur d'antenne plus élevée = plus de portée

### ✅ Interface Utilisateur
- [ ] Sélecteur de modèle fonctionnel
- [ ] Descriptions des modèles affichées
- [ ] Recommandations selon la fréquence
- [ ] Recalcul automatique visible sur la carte

## 🌍 Spécificités Sénégal

### Fréquences Courantes
- **800 MHz** : Couverture rurale étendue
- **1800 MHz** : Standard urbain et suburbain
- **2100 MHz** : Zones denses, capacité élevée
- **2600 MHz** : Zones très denses, débit élevé

### Environnements Types
- **Urbain** : Dakar, Thiès (bâtiments denses)
- **Suburbain** : Saint-Louis, Kaolack (zones résidentielles)
- **Rural** : Ferlo (zones ouvertes, végétation clairsemée)

### Défis Spécifiques
- **Climat tropical** : Atténuation par la pluie
- **Zones côtières** : Propagation maritime
- **Relief varié** : Adaptation des modèles

## 🚀 Prochaines Améliorations

### Fonctionnalités Avancées
- **Cartes de chaleur** de couverture
- **Analyse d'interférences** entre sites
- **Optimisation automatique** de placement
- **Import de données terrain** réelles

### Modèles Supplémentaires
- **ITU-R P.1546** pour la diffusion
- **Modèles spécifiques** climat tropical
- **Corrections terrain** détaillées

---

*Guide technique - Février 2026*
*Intégration complète des services LTE existants*