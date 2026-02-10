import React from 'react';
import { LTESite } from '@/types/map';
import { PropagationModel } from '@/types/lte';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Calculator, Radio, Zap, Target, Download } from 'lucide-react';
import { LTECoverageService } from '@/services/map/lteCoverageService';
import { LinkBudgetService } from '@/services/lte/linkBudgetService';
import { toast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';

interface LinkBudgetDetailsProps {
  site: LTESite;
  propagationModel: PropagationModel;
}

export const LinkBudgetDetails: React.FC<LinkBudgetDetailsProps> = ({
  site,
  propagationModel
}) => {
  // Convertir le site en paramètres LTE
  const lteParams = LTECoverageService.siteToLTEParameters(site);
  
  // Calculer le bilan de liaison détaillé
  const linkBudget = LinkBudgetService.calculateDetailedLinkBudget(lteParams);
  
  // Calculer le rayon de couverture
  const coverageRadius = LTECoverageService.calculateRealCoverageRadius(site, propagationModel);
  
  // Obtenir le nom du modèle
  const modelName = LTECoverageService.getAvailableModels().find(m => m.model === propagationModel)?.name;

  const handleExportPDF = () => {
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      let yPos = 20;

      // Titre
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text('Bilan de Liaison LTE', pageWidth / 2, yPos, { align: 'center' });
      
      yPos += 10;
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(`Site: ${site.name}`, pageWidth / 2, yPos, { align: 'center' });
      
      yPos += 6;
      doc.setFontSize(10);
      doc.text(`Modèle: ${modelName}`, pageWidth / 2, yPos, { align: 'center' });
      
      yPos += 6;
      doc.text(`Date: ${new Date().toLocaleDateString('fr-FR')}`, pageWidth / 2, yPos, { align: 'center' });
      
      yPos += 15;

      // Section 1: Paramètres du Site
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Paramètres du Site', 15, yPos);
      yPos += 8;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      const params = [
        ['Puissance émission:', `${site.power} dBm`],
        ['Fréquence:', `${site.frequency} MHz`],
        ['Hauteur antenne:', `${site.antennaHeight} m`],
        ['Environnement:', site.environment === 'urban' ? 'Urbain' : site.environment === 'suburban' ? 'Suburbain' : 'Rural'],
        ['Gain antenne Tx:', `${lteParams.txAntennaGain} dBi`],
        ['Pertes câbles:', `${lteParams.txCableLoss} dB`],
        ['Sensibilité Rx:', `${lteParams.rxSensitivity} dBm`],
      ];

      params.forEach(([label, value]) => {
        doc.text(label, 20, yPos);
        doc.text(value, 100, yPos);
        yPos += 6;
      });

      yPos += 5;

      // Section 2: Bilan de Liaison
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Bilan de Liaison', 15, yPos);
      yPos += 8;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      
      // PIRE
      doc.setFont('helvetica', 'bold');
      doc.text('PIRE (EIRP):', 20, yPos);
      doc.text(`${linkBudget.eirp.toFixed(1)} dBm`, 100, yPos);
      yPos += 5;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text(`Puissance + Gain antenne - Pertes = ${site.power} + ${lteParams.txAntennaGain} - ${lteParams.txCableLoss}`, 25, yPos);
      yPos += 8;

      doc.setFontSize(10);
      // Gain réception
      doc.setFont('helvetica', 'bold');
      doc.text('Gain réception:', 20, yPos);
      doc.text(`${linkBudget.rxGain.toFixed(1)} dB`, 100, yPos);
      yPos += 5;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text(`Gain antenne mobile - Pertes = ${lteParams.rxAntennaGain} - ${lteParams.rxCableLoss}`, 25, yPos);
      yPos += 8;

      doc.setFontSize(10);
      // Marges
      doc.setFont('helvetica', 'bold');
      doc.text('Marges totales:', 20, yPos);
      doc.text(`${linkBudget.totalMargins.toFixed(1)} dB`, 100, yPos);
      yPos += 5;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text(`Masquage + Interférence = ${lteParams.shadowingMargin} + ${lteParams.interferenceMargin}`, 25, yPos);
      yPos += 8;

      doc.setFontSize(11);
      // Affaiblissement max
      doc.setFont('helvetica', 'bold');
      doc.text('Affaiblissement max autorisé:', 20, yPos);
      doc.text(`${linkBudget.maxPathLoss.toFixed(1)} dB`, 100, yPos);
      yPos += 5;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text('PIRE + Gain Rx - Sensibilité - Marges', 25, yPos);
      yPos += 10;

      // Section 3: Résultat de Couverture
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Résultat de Couverture', 15, yPos);
      yPos += 8;

      doc.setFontSize(12);
      doc.text('Rayon de couverture:', 20, yPos);
      doc.setTextColor(37, 99, 235); // Bleu
      doc.text(`${coverageRadius.toFixed(1)} km`, 100, yPos);
      yPos += 8;

      doc.setTextColor(0, 0, 0); // Noir
      doc.text('Surface couverte:', 20, yPos);
      doc.setTextColor(22, 163, 74); // Vert
      doc.text(`${(Math.PI * Math.pow(coverageRadius, 2)).toFixed(1)} km²`, 100, yPos);
      yPos += 10;

      doc.setTextColor(0, 0, 0);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      const methodText = `Méthode: Recherche dichotomique de la distance maximale où l'affaiblissement calculé par le modèle ${modelName} reste inférieur à ${linkBudget.maxPathLoss.toFixed(1)} dB.`;
      const splitMethod = doc.splitTextToSize(methodText, pageWidth - 40);
      doc.text(splitMethod, 20, yPos);
      yPos += splitMethod.length * 5 + 5;

      // Section 4: Recommandations
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }

      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Recommandations', 15, yPos);
      yPos += 8;

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      const recommendations: string[] = [];
      
      if (linkBudget.maxPathLoss < 120) {
        recommendations.push('• Bilan de liaison faible - Considérer augmenter la puissance ou la hauteur d\'antenne');
      }
      if (linkBudget.maxPathLoss > 150) {
        recommendations.push('• Bilan de liaison excellent - Couverture optimale pour cette configuration');
      }
      if (site.frequency > 2000) {
        recommendations.push('• Fréquence élevée - Portée réduite mais meilleure capacité');
      }
      if (site.environment === 'urban') {
        recommendations.push('• Environnement urbain - Affaiblissement supplémentaire dû aux bâtiments');
      }

      recommendations.forEach(rec => {
        const splitRec = doc.splitTextToSize(rec, pageWidth - 40);
        doc.text(splitRec, 20, yPos);
        yPos += splitRec.length * 5 + 2;
      });

      // Footer
      yPos = doc.internal.pageSize.getHeight() - 15;
      doc.setFontSize(8);
      doc.setTextColor(128, 128, 128);
      doc.text('Plateforme de dimensionnement des réseaux LTE', pageWidth / 2, yPos, { align: 'center' });

      // Sauvegarder le PDF
      const fileName = `bilan-liaison-${site.name.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);

      toast({
        title: "Export réussi",
        description: `Le bilan de liaison a été exporté en PDF`,
      });
    } catch (error) {
      toast({
        title: "Erreur d'export",
        description: "Impossible d'exporter le PDF",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calculator className="h-5 w-5 text-blue-600" />
            <div>
              <CardTitle>Détails du Bilan de Liaison</CardTitle>
              <CardDescription>
                Calculs détaillés pour {site.name} avec le modèle {modelName}
              </CardDescription>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportPDF}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Exporter PDF
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Paramètres d'entrée */}
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center space-x-2">
            <Radio className="h-4 w-4" />
            <span>Paramètres du Site</span>
          </h3>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Puissance émission:</span>
                <span className="font-medium">{site.power} dBm</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Fréquence:</span>
                <span className="font-medium">{site.frequency} MHz</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Hauteur antenne:</span>
                <span className="font-medium">{site.antennaHeight} m</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Environnement:</span>
                <Badge variant="outline" className="text-xs">
                  {site.environment === 'urban' ? 'Urbain' : 
                   site.environment === 'suburban' ? 'Suburbain' : 'Rural'}
                </Badge>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Gain antenne Tx:</span>
                <span className="font-medium">{lteParams.txAntennaGain} dBi</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Pertes câbles:</span>
                <span className="font-medium">{lteParams.txCableLoss} dB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Sensibilité Rx:</span>
                <span className="font-medium">{lteParams.rxSensitivity} dBm</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Modèle propagation:</span>
                <Badge variant="default" className="text-xs">
                  {modelName}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Calculs du bilan de liaison */}
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center space-x-2">
            <Zap className="h-4 w-4" />
            <span>Bilan de Liaison</span>
          </h3>
          
          <div className="space-y-3">
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-blue-900">PIRE (EIRP)</span>
                <span className="text-sm font-bold text-blue-900">{linkBudget.eirp.toFixed(1)} dBm</span>
              </div>
              <div className="text-xs text-blue-700 mt-1">
                Puissance + Gain antenne - Pertes câbles = {site.power} + {lteParams.txAntennaGain} - {lteParams.txCableLoss}
              </div>
            </div>
            
            <div className="bg-green-50 p-3 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-green-900">Gain réception</span>
                <span className="text-sm font-bold text-green-900">{linkBudget.rxGain.toFixed(1)} dB</span>
              </div>
              <div className="text-xs text-green-700 mt-1">
                Gain antenne mobile - Pertes = {lteParams.rxAntennaGain} - {lteParams.rxCableLoss}
              </div>
            </div>
            
            <div className="bg-orange-50 p-3 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-orange-900">Marges totales</span>
                <span className="text-sm font-bold text-orange-900">{linkBudget.totalMargins.toFixed(1)} dB</span>
              </div>
              <div className="text-xs text-orange-700 mt-1">
                Masquage + Interférence = {lteParams.shadowingMargin} + {lteParams.interferenceMargin}
              </div>
            </div>
            
            <div className="bg-purple-50 p-3 rounded-lg border-2 border-purple-200">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-purple-900">Affaiblissement max autorisé</span>
                <span className="text-lg font-bold text-purple-900">{linkBudget.maxPathLoss.toFixed(1)} dB</span>
              </div>
              <div className="text-xs text-purple-700 mt-1">
                PIRE + Gain Rx - Sensibilité - Marges
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Résultat final */}
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center space-x-2">
            <Target className="h-4 w-4" />
            <span>Résultat de Couverture</span>
          </h3>
          
          <div className="bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-lg border-2 border-blue-200">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-600">Rayon de couverture</div>
                <div className="text-2xl font-bold text-blue-600">{coverageRadius.toFixed(1)} km</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Surface couverte</div>
                <div className="text-2xl font-bold text-green-600">
                  {(Math.PI * Math.pow(coverageRadius, 2)).toFixed(1)} km²
                </div>
              </div>
            </div>
            
            <div className="mt-3 text-xs text-gray-600">
              <strong>Méthode :</strong> Recherche dichotomique de la distance maximale où l'affaiblissement 
              calculé par le modèle {modelName} reste inférieur à {linkBudget.maxPathLoss.toFixed(1)} dB.
            </div>
          </div>
        </div>

        {/* Recommandations */}
        <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
          <h4 className="text-sm font-medium text-amber-900 mb-2">Recommandations</h4>
          <div className="text-xs text-amber-800 space-y-1">
            {linkBudget.maxPathLoss < 120 && (
              <div>• Bilan de liaison faible - Considérer augmenter la puissance ou la hauteur d'antenne</div>
            )}
            {linkBudget.maxPathLoss > 150 && (
              <div>• Bilan de liaison excellent - Couverture optimale pour cette configuration</div>
            )}
            {site.frequency > 2000 && (
              <div>• Fréquence élevée - Portée réduite mais meilleure capacité</div>
            )}
            {site.environment === 'urban' && (
              <div>• Environnement urbain - Affaiblissement supplémentaire dû aux bâtiments</div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};