import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Settings, Radio, Antenna, MapPin, Info } from "lucide-react";

/**
 * Composant de démonstration du panneau avec scroll interne
 * Montre comment le scroll fonctionne indépendamment du reste de la page
 */
export function ScrollPanelDemo() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-lte-text">Démonstration du Scroll Interne</h1>
          <p className="text-lte-text-secondary mt-2">
            Le panneau de droite a un scroll indépendant. Essayez de faire défiler !
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Contenu fixe à gauche */}
          <div className="lg:col-span-2">
            <Card className="bg-card">
              <CardHeader>
                <CardTitle className="text-lte-text">Zone Fixe (Carte)</CardTitle>
                <CardDescription className="text-lte-text-secondary">
                  Cette zone reste fixe pendant que vous faites défiler le panneau de droite
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[600px] bg-gradient-to-br from-tech-primary/10 to-tech-cyan/10 rounded-lg flex items-center justify-center border-2 border-dashed border-border">
                  <div className="text-center">
                    <MapPin className="h-16 w-16 mx-auto mb-4 text-tech-primary" />
                    <p className="text-lg font-semibold text-lte-text">Carte Interactive</p>
                    <p className="text-sm text-lte-text-secondary mt-2">
                      Cette zone ne défile pas
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Panneau avec scroll à droite */}
          <div className="h-[calc(100vh-12rem)] overflow-hidden">
            <Card className="h-full flex flex-col bg-card">
              <CardHeader className="flex-shrink-0 border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2 text-lte-text">
                      <Settings className="h-5 w-5" />
                      <span>Panneau Scrollable</span>
                    </CardTitle>
                    <CardDescription className="text-lte-text-secondary">
                      Faites défiler pour voir tous les paramètres
                    </CardDescription>
                  </div>
                  <Badge className="bg-tech-cyan text-white">
                    <Info className="h-3 w-3 mr-1" />
                    Scroll
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="flex-1 overflow-y-auto custom-scrollbar pr-2">
                <div className="space-y-6 pb-6 mt-6">
                  {/* Section 1 */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-lte-text-secondary flex items-center space-x-2">
                      <MapPin className="h-4 w-4" />
                      <span>Informations Générales</span>
                    </h3>
                    <div>
                      <Label className="text-lte-text">Nom du site</Label>
                      <Input placeholder="Site LTE 001" className="bg-input" />
                    </div>
                    <div>
                      <Label className="text-lte-text">Description</Label>
                      <Input placeholder="Description du site" className="bg-input" />
                    </div>
                  </div>

                  <Separator />

                  {/* Section 2 */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-lte-text-secondary flex items-center space-x-2">
                      <Radio className="h-4 w-4" />
                      <span>Paramètres Radio</span>
                    </h3>
                    <div>
                      <Label className="text-lte-text">Puissance: 46 dBm</Label>
                      <Slider defaultValue={[46]} min={20} max={50} step={1} className="mt-2" />
                    </div>
                    <div>
                      <Label className="text-lte-text">Fréquence</Label>
                      <Input type="number" placeholder="2600" className="bg-input" />
                    </div>
                    <div>
                      <Label className="text-lte-text">Bande passante</Label>
                      <Input type="number" placeholder="20" className="bg-input" />
                    </div>
                  </div>

                  <Separator />

                  {/* Section 3 */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-lte-text-secondary flex items-center space-x-2">
                      <Antenna className="h-4 w-4" />
                      <span>Paramètres d'Antenne</span>
                    </h3>
                    <div>
                      <Label className="text-lte-text">Hauteur: 30 m</Label>
                      <Slider defaultValue={[30]} min={10} max={100} step={5} className="mt-2" />
                    </div>
                    <div>
                      <Label className="text-lte-text">Gain d'antenne</Label>
                      <Input type="number" placeholder="18" className="bg-input" />
                    </div>
                    <div>
                      <Label className="text-lte-text">Tilt mécanique</Label>
                      <Input type="number" placeholder="3" className="bg-input" />
                    </div>
                    <div>
                      <Label className="text-lte-text">Azimut</Label>
                      <Input type="number" placeholder="0" className="bg-input" />
                    </div>
                  </div>

                  <Separator />

                  {/* Section 4 */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-lte-text-secondary">Environnement</h3>
                    <div>
                      <Label className="text-lte-text">Type de zone</Label>
                      <Input placeholder="Urbain" className="bg-input" />
                    </div>
                    <div>
                      <Label className="text-lte-text">Densité de bâtiments</Label>
                      <Slider defaultValue={[70]} min={0} max={100} step={10} className="mt-2" />
                    </div>
                  </div>

                  <Separator />

                  {/* Section 5 */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-lte-text-secondary">Calculs Avancés</h3>
                    <div className="bg-tech-cyan/10 p-4 rounded-lg border border-tech-cyan/20">
                      <p className="text-sm text-lte-text font-semibold">Rayon de couverture</p>
                      <p className="text-2xl font-bold text-tech-cyan mt-1">3.5 km</p>
                    </div>
                    <div className="bg-tech-success/10 p-4 rounded-lg border border-tech-success/20">
                      <p className="text-sm text-lte-text font-semibold">Surface couverte</p>
                      <p className="text-2xl font-bold text-tech-success mt-1">38.5 km²</p>
                    </div>
                    <div className="bg-tech-primary/10 p-4 rounded-lg border border-tech-primary/20">
                      <p className="text-sm text-lte-text font-semibold">RSRP estimé</p>
                      <p className="text-2xl font-bold text-tech-primary mt-1">-85 dBm</p>
                    </div>
                  </div>

                  <Separator />

                  {/* Section 6 - Dernière section */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-lte-text-secondary">Actions</h3>
                    <div className="space-y-2">
                      <Button className="w-full bg-primary hover:bg-primary/90">
                        Sauvegarder les modifications
                      </Button>
                      <Button variant="secondary" className="w-full">
                        Recalculer la couverture
                      </Button>
                      <Button variant="outline" className="w-full">
                        Réinitialiser
                      </Button>
                    </div>
                  </div>

                  {/* Indicateur de fin */}
                  <div className="text-center text-sm text-lte-text-secondary bg-muted p-3 rounded">
                    ✓ Vous avez atteint la fin du panneau
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Instructions */}
        <Card className="mt-6 bg-tech-primary/5 border-tech-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-4">
              <Info className="h-5 w-5 text-tech-primary flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-lte-text mb-2">Comment ça fonctionne ?</h3>
                <ul className="text-sm text-lte-text-secondary space-y-1">
                  <li>• Le panneau de droite a une hauteur fixe et un scroll interne</li>
                  <li>• La zone de gauche (carte) reste fixe et visible</li>
                  <li>• Seul le contenu du panneau défile, pas toute la page</li>
                  <li>• La scrollbar est stylisée avec les couleurs de votre palette</li>
                  <li>• Le header du panneau reste visible pendant le scroll</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
