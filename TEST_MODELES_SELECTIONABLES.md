# Test des Modèles Sélectionnables - Guide de Vérification

## ✅ **Interfaces de Sélection Disponibles**

### 1. **Sélecteur Principal (Header)**
- **Localisation** : En haut de la page, à côté de "Zone géographique"
- **Format** : Menu déroulant avec nom + plage de fréquences
- **Visibilité** : Toujours visible sur toutes les pages

### 2. **Sélecteur Rapide (Onglet Carte)**
- **Localisation** : Juste au-dessus de la carte dans l'onglet "Carte"
- **Format** : 3 boutons côte à côte + informations détaillées
- **Visibilité** : Visible uniquement dans l'onglet Carte

### 3. **Sélecteur Détaillé (Onglet Configuration)**
- **Localisation** : Onglet "Configuration"
- **Format** : Interface complète avec comparaisons et recommandations
- **Visibilité** : Visible uniquement dans l'onglet Configuration

## 🧪 **Tests à Effectuer**

### Test 1 : Sélecteur Principal
1. ✅ Allez sur `/map`
2. ✅ Localisez le menu "Modèle de propagation" en haut
3. ✅ Cliquez dessus → Doit afficher 3 options :
   - **Okumura-Hata** (150-1500 MHz)
   - **COST 231-Hata** (1500-2000 MHz)  
   - **3GPP TR 36.814** (2000-6000 MHz)
4. ✅ Sélectionnez un modèle différent
5. ✅ Vérifiez la notification "Modèle de propagation changé"
6. ✅ Observez le recalcul des rayons sur la carte

### Test 2 : Sélecteur Rapide
1. ✅ Restez dans l'onglet "Carte"
2. ✅ Localisez les 3 boutons de modèles au-dessus de la carte
3. ✅ Cliquez sur chaque bouton
4. ✅ Vérifiez que le bouton actuel est surligné en bleu
5. ✅ Observez les informations qui changent en bas
6. ✅ Vérifiez le recalcul immédiat des rayons

### Test 3 : Sélecteur Détaillé
1. ✅ Allez dans l'onglet "Configuration"
2. ✅ Localisez la carte "Modèle de Propagation Radio"
3. ✅ Testez le menu déroulant principal
4. ✅ Testez les boutons de "Sélection Rapide"
5. ✅ Vérifiez les recommandations automatiques
6. ✅ Consultez le tableau comparatif

### Test 4 : Cohérence entre Sélecteurs
1. ✅ Changez le modèle dans le sélecteur principal
2. ✅ Vérifiez que le sélecteur rapide se met à jour
3. ✅ Vérifiez que l'onglet Configuration se met à jour
4. ✅ Tous les sélecteurs doivent être synchronisés

### Test 5 : Impact sur les Calculs
1. ✅ Ajoutez quelques sites sur la carte
2. ✅ Notez les rayons de couverture actuels
3. ✅ Changez de modèle (ex: Okumura-Hata → 3GPP)
4. ✅ Vérifiez que les rayons changent immédiatement
5. ✅ Les rayons doivent être différents selon le modèle

## 📊 **Résultats Attendus**

### Okumura-Hata (150-1500 MHz)
- **Rayons plus grands** pour les basses fréquences
- **Meilleur** pour 800 MHz, 900 MHz
- **Adapté** aux zones rurales

### COST 231-Hata (1500-2000 MHz)
- **Rayons moyens** pour les fréquences standard
- **Optimal** pour 1800 MHz, 2100 MHz
- **Adapté** aux zones urbaines/suburbaines

### 3GPP TR 36.814 (2000-6000 MHz)
- **Rayons plus petits** pour les hautes fréquences
- **Meilleur** pour 2600 MHz et plus
- **Adapté** aux zones très denses

## 🎯 **Points de Contrôle**

### Interface Utilisateur
- [ ] Les 3 sélecteurs sont visibles et fonctionnels
- [ ] Les modèles changent bien quand on clique
- [ ] Les descriptions sont affichées correctement
- [ ] Les recommandations apparaissent selon la fréquence
- [ ] La synchronisation entre sélecteurs fonctionne

### Calculs Techniques
- [ ] Les rayons se recalculent immédiatement
- [ ] Les rayons sont différents selon le modèle
- [ ] Les notifications de changement s'affichent
- [ ] Les statistiques se mettent à jour
- [ ] L'export inclut le modèle utilisé

### Cohérence des Données
- [ ] Okumura-Hata donne des rayons plus grands (basses fréq.)
- [ ] 3GPP donne des rayons plus petits (hautes fréq.)
- [ ] COST 231-Hata est intermédiaire
- [ ] Les recommandations sont logiques
- [ ] Les plages de fréquences sont respectées

## 🚨 **Problèmes Potentiels**

### Si les sélecteurs ne s'affichent pas :
1. Vérifiez que vous êtes sur `/map`
2. Actualisez la page (F5)
3. Vérifiez la console du navigateur (F12)

### Si les modèles ne changent pas :
1. Vérifiez les notifications de changement
2. Regardez si les rayons se recalculent
3. Testez avec différents sélecteurs

### Si les calculs semblent incorrects :
1. Vérifiez que les sites ont des paramètres valides
2. Testez avec des fréquences dans les bonnes plages
3. Comparez les résultats entre modèles

## 📝 **Checklist de Validation**

### Fonctionnalités de Base
- [ ] ✅ Sélecteur principal fonctionnel
- [ ] ✅ Sélecteur rapide fonctionnel  
- [ ] ✅ Sélecteur détaillé fonctionnel
- [ ] ✅ Synchronisation entre sélecteurs
- [ ] ✅ Recalcul automatique des rayons

### Fonctionnalités Avancées
- [ ] ✅ Recommandations automatiques
- [ ] ✅ Notifications de changement
- [ ] ✅ Descriptions détaillées
- [ ] ✅ Tableau comparatif
- [ ] ✅ Export avec modèle utilisé

### Cohérence Technique
- [ ] ✅ Formules correctes par modèle
- [ ] ✅ Plages de fréquences respectées
- [ ] ✅ Résultats logiques selon le modèle
- [ ] ✅ Performance acceptable
- [ ] ✅ Interface responsive

---

**Résultat attendu :** Les 3 modèles de propagation doivent être facilement sélectionnables via 3 interfaces différentes, avec recalcul immédiat et visible des rayons de couverture sur la carte géographique.

*Guide de test - Février 2026*