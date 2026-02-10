import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { HelpCircle, MapPin, Zap, ZapOff, Settings, BarChart3, Download, RotateCcw } from 'lucide-react';

export const MapHelp: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <HelpCircle className="h-4 w-4 mr-2" />
          Aide
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <HelpCircle className="h-5 w-5" />
            <span>Guide de la Planification LTE</span>
          </DialogTitle>
          <DialogDescription>
            Apprenez à utiliser l'outil de planification géographique
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Démarrage rapide */}
          <div>
            <h3 className="text-lg font-semibold mb-3">🚀 Démarrage Rapide</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-start space-x-2">
                <Badge variant="outline" className="mt-0.5">1</Badge>
                <span>Sélectionnez une zone géographique dans la liste déroulante</span>
              </div>
              <div className="flex items-start space-x-2">
                <Badge variant="outline" className="mt-0.5">2</Badge>
                <span>Cliquez "Sites démo" pour générer des sites d'exemple</span>
              </div>
              <div className="flex items-start space-x-2">
                <Badge variant="outline" className="mt-0.5">3</Badge>
                <span>Cliquez sur un site pour le configurer</span>
              </div>
              <div className="flex items-start space-x-2">
                <Badge variant="outline" className="mt-0.5">4</Badge>
                <span>Consultez les statistiques dans l'onglet correspondant</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Utilisation de la carte */}
          <div>
            <h3 className="text-lg font-semibold mb-3">🗺️ Utilisation de la Carte</h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Ajouter un Site</h4>
                <div className="flex items-center space-x-2 text-sm">
                  <Button size="sm" variant="outline">
                    <MapPin className="h-3 w-3 mr-1" />
                    Ajouter Site
                  </Button>
                  <span>→ Cliquez sur la carte à l'emplacement désiré</span>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Contrôles de Navigation</h4>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="flex items-center space-x-1">
                    <Button size="sm" variant="outline">+</Button>
                    <span>Zoom avant</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Button size="sm" variant="outline">-</Button>
                    <span>Zoom arrière</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Button size="sm" variant="outline">
                      <RotateCcw className="h-3 w-3" />
                    </Button>
                    <span>Réinitialiser</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Légende des Sites</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                      <Zap className="w-3 h-3 text-white" />
                    </div>
                    <span>Site actif avec couverture</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center">
                      <ZapOff className="w-3 h-3 text-white" />
                    </div>
                    <span>Site inactif</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                      <Zap className="w-3 h-3 text-white" />
                    </div>
                    <span>Site sélectionné</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Configuration des sites */}
          <div>
            <h3 className="text-lg font-semibold mb-3">⚙️ Configuration des Sites</h3>
            
            <div className="space-y-3">
              <div>
                <h4 className="font-medium">Paramètres Radio</h4>
                <ul className="text-sm text-gray-600 ml-4 space-y-1">
                  <li>• <strong>Puissance :</strong> 20-50 dBm (impact sur la portée)</li>
                  <li>• <strong>Fréquence :</strong> Bandes LTE standard (700-2600 MHz)</li>
                  <li>• <strong>Hauteur d'antenne :</strong> 10-100 mètres</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium">Types d'Environnement</h4>
                <ul className="text-sm text-gray-600 ml-4 space-y-1">
                  <li>• <strong>Urbain :</strong> Zones denses avec bâtiments</li>
                  <li>• <strong>Suburbain :</strong> Zones résidentielles</li>
                  <li>• <strong>Rural :</strong> Zones ouvertes, campagne</li>
                </ul>
              </div>
            </div>
          </div>

          <Separator />

          {/* Statistiques */}
          <div>
            <h3 className="text-lg font-semibold mb-3">📊 Statistiques et Analyse</h3>
            
            <div className="space-y-3">
              <div>
                <h4 className="font-medium">Métriques Principales</h4>
                <ul className="text-sm text-gray-600 ml-4 space-y-1">
                  <li>• <strong>Sites Actifs :</strong> Nombre de sites opérationnels</li>
                  <li>• <strong>Couverture Totale :</strong> Surface couverte en km²</li>
                  <li>• <strong>Qualité Globale :</strong> Score de performance (0-100%)</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium">Recommandations</h4>
                <p className="text-sm text-gray-600 ml-4">
                  Le système analyse automatiquement votre configuration et propose des améliorations :
                  couverture insuffisante, redondance, optimisation de puissance.
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Outils avancés */}
          <div>
            <h3 className="text-lg font-semibold mb-3">🛠️ Outils Avancés</h3>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <Settings className="h-4 w-4" />
                  <span className="font-medium">Sites Démo</span>
                </div>
                <p className="text-gray-600">Génère 5 sites optimisés pour la zone sélectionnée</p>
              </div>
              
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <Download className="h-4 w-4" />
                  <span className="font-medium">Export</span>
                </div>
                <p className="text-gray-600">Sauvegarde la configuration en fichier JSON</p>
              </div>
              
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <RotateCcw className="h-4 w-4" />
                  <span className="font-medium">Effacer Tout</span>
                </div>
                <p className="text-gray-600">Supprime tous les sites de la carte</p>
              </div>
              
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <BarChart3 className="h-4 w-4" />
                  <span className="font-medium">Statistiques</span>
                </div>
                <p className="text-gray-600">Analyse détaillée avec graphiques interactifs</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Conseils */}
          <div>
            <h3 className="text-lg font-semibold mb-3">💡 Conseils d'Utilisation</h3>
            
            <div className="space-y-2 text-sm">
              <div className="bg-blue-50 p-3 rounded-lg">
                <p><strong>🎯 Optimisation :</strong> Commencez par placer quelques sites, puis ajustez la puissance selon la couverture souhaitée.</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <p><strong>🔄 Expérimentation :</strong> Testez différentes fréquences pour voir l'impact sur la portée et la pénétration.</p>
              </div>
              <div className="bg-yellow-50 p-3 rounded-lg">
                <p><strong>📍 Réalisme :</strong> Tenez compte du type d'environnement pour des calculs plus précis.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={() => setIsOpen(false)}>
            Compris !
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};