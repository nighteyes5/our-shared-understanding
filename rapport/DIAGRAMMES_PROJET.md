# DIAGRAMMES DU PROJET - Outil de Dimensionnement LTE

## 1. Diagramme de Cas d'Utilisation

```mermaid
graph TB
    subgraph "Système de Dimensionnement LTE"
        UC1[Effectuer Calcul LTE]
        UC2[Enregistrer Calcul]
        UC3[Charger Calcul]
        UC4[Planifier sur Carte]
        UC5[Exporter Projet]
        UC6[Importer Projet]
        UC7[Modifier Profil]
        UC8[Consulter Stats Classe]
        UC9[Générer Rapport PDF]
        UC10[Gérer Utilisateurs]
        UC11[Gérer Classes]
        UC12[Consulter Stats Globales]
    end
    
    Etudiant((Étudiant))
    Enseignant((Enseignant))
    Admin((Administrateur))
    
    Etudiant --> UC1
    Etudiant --> UC2
    Etudiant --> UC3
    Etudiant --> UC4
    Etudiant --> UC5
    Etudiant --> UC6
    Etudiant --> UC7
    
    Enseignant --> UC1
    Enseignant --> UC2
    Enseignant --> UC3
    Enseignant --> UC4
    Enseignant --> UC5
    Enseignant --> UC6
    Enseignant --> UC7
    Enseignant --> UC8
    Enseignant --> UC9
    
    Admin --> UC1
    Admin --> UC2
    Admin --> UC3
    Admin --> UC4
    Admin --> UC5
    Admin --> UC6
    Admin --> UC7
    Admin --> UC8
    Admin --> UC9
    Admin --> UC10
    Admin --> UC11
    Admin --> UC12
```

## 2. Diagramme de Classes Simplifié

```mermaid
classDiagram
    class User {
        -string id
        -string email
        -string password
        -string firstName
        -string lastName
        -UserRole role
        -string classId
        -Date createdAt
        +login()
        +logout()
        +updateProfile()
    }
    
    class LTEParameters {
        -number frequency
        -number txPower
        -number txAntennaGain
        -number txCableLoss
        -number rxAntennaGain
        -number rxCableLoss
        -number rxSensitivity
        -number txAntennaHeight
        -number rxAntennaHeight
        -string environment
        -number shadowingMargin
        -number interferenceMargin
        -number targetArea
    }
    
    class CalculationService {
        +calculatePathLoss()
        +calculateMaxRange()
        +calculateCellRadius()
        +calculateNumberOfSites()
        +compareModels()
    }
    
    class PropagationModels {
        +okumuraHata()
        +cost231Hata()
        +threeGPP()
    }
    
    class LTESite {
        -string id
        -string name
        -MapPosition position
        -number power
        -number frequency
        -number antennaHeight
        -number coverageRadius
        -string environment
        -boolean isActive
        -string propagationModel
    }
    
    class SiteService {
        +addSite()
        +updateSite()
        +deleteSite()
        +getSites()
        +exportSites()
        +importSites()
    }
    
    class SavedCalculation {
        -string id
        -string userId
        -string name
        -LTEParameters parameters
        -ComparisonResult results
        -Date createdAt
    }
    
    User "1" --> "*" SavedCalculation : owns
    LTEParameters "1" --> "1" CalculationService : uses
    CalculationService "1" --> "1" PropagationModels : uses
    LTESite "1" --> "1" SiteService : managed by
    SiteService "1" --> "1" LTECoverageService : uses
```

## 3. Diagramme de Séquence - Calcul de Dimensionnement

```mermaid
sequenceDiagram
    participant U as Utilisateur
    participant UI as Interface
    participant PF as ParameterForm
    participant CS as CalculationService
    participant PM as PropagationModels
    
    U->>UI: Accède au calculateur
    UI->>PF: Affiche formulaire
    U->>PF: Saisit paramètres
    PF->>CS: compareModels(params)
    
    CS->>PM: okumuraHata(params)
    PM-->>CS: pathLoss1
    
    CS->>PM: cost231Hata(params)
    PM-->>CS: pathLoss2
    
    CS->>PM: threeGPP(params)
    PM-->>CS: pathLoss3
    
    CS->>CS: calculateRange()
    CS->>CS: calculateSites()
    CS-->>PF: results
    
    PF-->>UI: update results
    UI-->>U: Affiche résultats
```

## 4. Diagramme de Séquence - Planification sur Carte

```mermaid
sequenceDiagram
    participant U as Utilisateur
    participant MP as MapPlanning
    participant OLM as OpenLayersMap
    participant SS as SiteService
    participant LCS as LTECoverageService
    
    U->>MP: Clic "Ajouter Site"
    MP->>OLM: setAddMode(true)
    
    U->>OLM: Clic sur carte
    OLM->>MP: onSiteAdd(position)
    
    MP->>SS: addSite(position)
    SS->>LCS: calculateCoverageRadius()
    LCS-->>SS: radius
    SS-->>MP: newSite
    
    MP->>MP: setSites([...sites, newSite])
    MP->>OLM: sites updated
    
    OLM->>OLM: render() avec couleur
    OLM-->>U: Site visible avec couleur
```

## 5. Diagramme d'Activité - Authentification

```mermaid
flowchart TD
    Start([Début]) --> DisplayLogin[Afficher Page Login]
    DisplayLogin --> InputCreds[Saisir Identifiants]
    InputCreds --> ValidateFormat{Format Valide?}
    
    ValidateFormat -->|Non| ShowError1[Afficher Erreur Format]
    ShowError1 --> InputCreds
    
    ValidateFormat -->|Oui| CheckCreds[Vérifier Credentials]
    CheckCreds --> CredValid{Credentials Corrects?}
    
    CredValid -->|Non| ShowError2[Afficher Erreur Auth]
    ShowError2 --> InputCreds
    
    CredValid -->|Oui| CreateSession[Créer Session]
    CreateSession --> CheckRole{Vérifier Rôle}
    
    CheckRole -->|Admin| AdminDash[Dashboard Admin]
    CheckRole -->|Enseignant| TeacherDash[Dashboard Enseignant]
    CheckRole -->|Étudiant| StudentDash[Dashboard Étudiant]
    
    AdminDash --> End([Fin])
    TeacherDash --> End
    StudentDash --> End
```

## 6. Diagramme de Composants

```mermaid
graph TB
    subgraph "Frontend Application"
        subgraph "Presentation Layer"
            Pages[Pages]
            Components[Components]
            UI[UI Components]
        end
        
        subgraph "Business Logic Layer"
            Services[Services]
            Hooks[Custom Hooks]
            Contexts[React Contexts]
        end
        
        subgraph "Data Layer"
            Types[TypeScript Types]
            LocalStorage[(LocalStorage)]
        end
    end
    
    Pages --> Components
    Components --> UI
    Pages --> Hooks
    Components --> Hooks
    Hooks --> Services
    Hooks --> Contexts
    Services --> Types
    Services --> LocalStorage
    Contexts --> LocalStorage
```

## 7. Diagramme d'Architecture

```mermaid
graph TB
    subgraph "Client Browser"
        subgraph "React Application"
            Router[React Router]
            Auth[Auth Context]
            Pages[Pages]
            Components[Components]
        end
        
        subgraph "Services"
            AuthService[Auth Service]
            CalcService[Calculation Service]
            SiteService[Site Service]
            MapService[Map Service]
        end
        
        subgraph "External Libraries"
            OpenLayers[OpenLayers]
            Recharts[Recharts]
            jsPDF[jsPDF]
        end
    end
    
    subgraph "Data Storage"
        LocalStorage[(LocalStorage)]
    end
    
    subgraph "External APIs"
        OSM[OpenStreetMap]
        Nominatim[Nominatim API]
    end
    
    Router --> Pages
    Pages --> Components
    Components --> Services
    Auth --> AuthService
    
    AuthService --> LocalStorage
    CalcService --> LocalStorage
    SiteService --> LocalStorage
    
    Components --> OpenLayers
    Components --> Recharts
    Components --> jsPDF
    
    OpenLayers --> OSM
    MapService --> Nominatim
```

## 8. Diagramme de Déploiement

```mermaid
graph TB
    subgraph "User Device"
        Browser[Web Browser]
    end
    
    subgraph "Web Server"
        Nginx[Nginx]
        StaticFiles[Static Files<br/>HTML, CSS, JS]
    end
    
    subgraph "External Services"
        OSM[OpenStreetMap<br/>Tile Server]
        Nominatim[Nominatim<br/>Geocoding API]
    end
    
    Browser -->|HTTPS| Nginx
    Nginx --> StaticFiles
    Browser -->|Tiles Request| OSM
    Browser -->|Geocoding Request| Nominatim
```

## 9. Diagramme d'État - Site LTE

```mermaid
stateDiagram-v2
    [*] --> Créé: addSite()
    
    Créé --> Actif: isActive = true
    Créé --> Inactif: isActive = false
    
    Actif --> EnConfiguration: select()
    EnConfiguration --> Actif: save()
    EnConfiguration --> Actif: cancel()
    
    Actif --> Inactif: toggle()
    Inactif --> Actif: toggle()
    
    Actif --> Supprimé: delete()
    Inactif --> Supprimé: delete()
    EnConfiguration --> Supprimé: delete()
    
    Supprimé --> [*]
    
    note right of Actif
        Affiche zone de couverture
        Couleur selon puissance
    end note
    
    note right of Inactif
        Pas de zone de couverture
        Couleur grise
    end note
```

## 10. Diagramme de Flux de Données - Calcul LTE

```mermaid
flowchart LR
    Input[Paramètres<br/>Utilisateur] --> Validation{Validation}
    
    Validation -->|Invalide| Error[Afficher<br/>Erreur]
    Error --> Input
    
    Validation -->|Valide| LinkBudget[Calcul<br/>Bilan de Liaison]
    
    LinkBudget --> EIRP[Calcul PIRE]
    LinkBudget --> RxGain[Calcul Gain Rx]
    LinkBudget --> Margins[Calcul Marges]
    
    EIRP --> MaxPathLoss[Affaiblissement<br/>Max Autorisé]
    RxGain --> MaxPathLoss
    Margins --> MaxPathLoss
    
    MaxPathLoss --> Model1[Okumura-Hata]
    MaxPathLoss --> Model2[COST 231-Hata]
    MaxPathLoss --> Model3[3GPP]
    
    Model1 --> Range1[Rayon 1]
    Model2 --> Range2[Rayon 2]
    Model3 --> Range3[Rayon 3]
    
    Range1 --> Sites1[Nb Sites 1]
    Range2 --> Sites2[Nb Sites 2]
    Range3 --> Sites3[Nb Sites 3]
    
    Sites1 --> Compare[Comparaison]
    Sites2 --> Compare
    Sites3 --> Compare
    
    Compare --> Recommend[Modèle<br/>Recommandé]
    Compare --> Display[Affichage<br/>Résultats]
```

---

**Note:** Ces diagrammes peuvent être visualisés avec des outils compatibles Mermaid comme:
- GitHub (rendu automatique)
- VS Code (avec extension Mermaid)
- draw.io (import Mermaid)
- mermaid.live (éditeur en ligne)
