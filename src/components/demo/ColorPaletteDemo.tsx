import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, AlertTriangle, XCircle, Info } from "lucide-react";

/**
 * Composant de démonstration de la palette de couleurs LTE/RF
 * Affiche tous les styles et couleurs disponibles
 */
export function ColorPaletteDemo() {
  return (
    <div className="min-h-screen bg-background p-6 space-y-8">
      {/* Header */}
      <header className="bg-lte-header text-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold">Palette de Couleurs LTE/RF</h1>
        <p className="text-sidebar-foreground/80 mt-2">
          Démonstration des couleurs et composants
        </p>
      </header>

      {/* Couleurs de base */}
      <section>
        <h2 className="text-2xl font-bold text-lte-text mb-4">Couleurs de Base</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-lte-bg">
            <CardContent className="pt-6">
              <div className="h-20 bg-lte-bg border-2 border-border rounded mb-2"></div>
              <p className="text-sm font-semibold text-lte-text">Background Principal</p>
              <p className="text-xs text-lte-text-secondary">#F6F9FC</p>
            </CardContent>
          </Card>

          <Card className="bg-lte-card">
            <CardContent className="pt-6">
              <div className="h-20 bg-lte-card border-2 border-border rounded mb-2"></div>
              <p className="text-sm font-semibold text-lte-text">Cartes / Panels</p>
              <p className="text-xs text-lte-text-secondary">#FFFFFF</p>
            </CardContent>
          </Card>

          <Card className="bg-card">
            <CardContent className="pt-6">
              <div className="h-20 bg-lte-header rounded mb-2"></div>
              <p className="text-sm font-semibold text-lte-text">Header / Sidebar</p>
              <p className="text-xs text-lte-text-secondary">#0B1F33</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Boutons */}
      <section>
        <h2 className="text-2xl font-bold text-lte-text mb-4">Boutons et Actions</h2>
        <Card className="bg-card">
          <CardContent className="pt-6 space-y-4">
            <div className="flex flex-wrap gap-3">
              <Button className="bg-primary hover:bg-primary/90">
                Primaire (Bleu LTE)
              </Button>
              <Button variant="secondary">
                Secondaire (Bleu clair)
              </Button>
              <Button className="bg-accent hover:bg-accent/90">
                Accent (Cyan radio)
              </Button>
              <Button variant="destructive">
                Destructif (Rouge)
              </Button>
              <Button variant="outline">
                Outline
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Badges de statut */}
      <section>
        <h2 className="text-2xl font-bold text-lte-text mb-4">Indicateurs de Statut</h2>
        <Card className="bg-card">
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-3">
              <Badge className="bg-success text-white">
                Succès / OK
              </Badge>
              <Badge className="bg-warning text-white">
                Alerte / Pertes RF
              </Badge>
              <Badge className="bg-destructive text-white">
                Erreur Critique
              </Badge>
              <Badge className="bg-info text-white">
                Info / Données
              </Badge>
              <Badge className="bg-tech-cyan text-white">
                Cyan Radio
              </Badge>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Statistiques RF */}
      <section>
        <h2 className="text-2xl font-bold text-lte-text mb-4">Statistiques RF</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-card border-l-4 border-tech-cyan">
            <CardContent className="pt-6">
              <p className="text-sm text-lte-text-secondary">Sites Actifs</p>
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

          <Card className="bg-card border-l-4 border-tech-primary">
            <CardContent className="pt-6">
              <p className="text-sm text-lte-text-secondary">RSRP Moyen</p>
              <p className="text-3xl font-bold text-tech-primary">-85 dBm</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Alertes */}
      <section>
        <h2 className="text-2xl font-bold text-lte-text mb-4">Alertes et Notifications</h2>
        <div className="space-y-4">
          <Alert className="border-success bg-success/10">
            <CheckCircle className="h-4 w-4 text-success" />
            <AlertTitle className="text-success">Calcul terminé avec succès</AlertTitle>
            <AlertDescription className="text-lte-text-secondary">
              La couverture LTE a été calculée pour tous les sites actifs.
            </AlertDescription>
          </Alert>

          <Alert className="border-info bg-info/10">
            <Info className="h-4 w-4 text-info" />
            <AlertTitle className="text-info">Données disponibles</AlertTitle>
            <AlertDescription className="text-lte-text-secondary">
              Les statistiques de couverture sont maintenant accessibles.
            </AlertDescription>
          </Alert>

          <Alert className="border-warning bg-warning/10">
            <AlertTriangle className="h-4 w-4 text-warning" />
            <AlertTitle className="text-warning">Pertes RF élevées détectées</AlertTitle>
            <AlertDescription className="text-lte-text-secondary">
              Les pertes de propagation dépassent 140 dB dans certaines zones.
            </AlertDescription>
          </Alert>

          <Alert className="border-destructive bg-destructive/10">
            <XCircle className="h-4 w-4 text-destructive" />
            <AlertTitle className="text-destructive">Erreur critique</AlertTitle>
            <AlertDescription className="text-lte-text-secondary">
              Impossible de calculer la couverture. Vérifiez les paramètres.
            </AlertDescription>
          </Alert>
        </div>
      </section>

      {/* Cartes de données */}
      <section>
        <h2 className="text-2xl font-bold text-lte-text mb-4">Cartes de Données</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-card">
            <CardHeader>
              <CardTitle className="text-lte-text">Paramètres LTE</CardTitle>
              <CardDescription className="text-lte-text-secondary">
                Configuration du site radio
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-lte-text-secondary">Fréquence</span>
                <span className="text-lte-text font-semibold">2600 MHz</span>
              </div>
              <div className="flex justify-between">
                <span className="text-lte-text-secondary">Puissance</span>
                <span className="text-lte-text font-semibold">46 dBm</span>
              </div>
              <div className="flex justify-between">
                <span className="text-lte-text-secondary">Bande passante</span>
                <span className="text-lte-text font-semibold">20 MHz</span>
              </div>
              <Button className="w-full bg-primary hover:bg-primary/90 mt-4">
                Calculer la couverture
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-card">
            <CardHeader>
              <CardTitle className="text-lte-text">Résultats de Couverture</CardTitle>
              <CardDescription className="text-lte-text-secondary">
                Analyse de la zone de service
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-lte-text">Couverture totale</span>
                  <span className="text-tech-success font-semibold">94.5%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-tech-success h-2 rounded-full" style={{width: '94.5%'}}></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-lte-text">Zone d'alerte</span>
                  <span className="text-tech-warning font-semibold">4.2%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-tech-warning h-2 rounded-full" style={{width: '4.2%'}}></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-lte-text">Hors couverture</span>
                  <span className="text-tech-error font-semibold">1.3%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-tech-error h-2 rounded-full" style={{width: '1.3%'}}></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
