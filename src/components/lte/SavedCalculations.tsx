import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Folder, Trash2, Eye, Calendar, Radio, MapPin } from 'lucide-react';
import type { LTEParameters, ComparisonResult } from '@/types/lte';

interface SavedCalculation {
  id: string;
  name: string;
  date: string;
  parameters: LTEParameters;
  results: ComparisonResult;
}

interface SavedCalculationsProps {
  onLoadCalculation?: (parameters: LTEParameters, results: ComparisonResult) => void;
}

export const SavedCalculations: React.FC<SavedCalculationsProps> = ({ onLoadCalculation }) => {
  const [savedCalculations, setSavedCalculations] = useState<SavedCalculation[]>([]);

  useEffect(() => {
    loadSavedCalculations();
  }, []);

  const loadSavedCalculations = () => {
    try {
      const saved = localStorage.getItem('lte_saved_calculations');
      if (saved) {
        const calculations = JSON.parse(saved);
        setSavedCalculations(calculations);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des calculs:', error);
    }
  };

  const handleDelete = (id: string) => {
    try {
      const updated = savedCalculations.filter(calc => calc.id !== id);
      localStorage.setItem('lte_saved_calculations', JSON.stringify(updated));
      setSavedCalculations(updated);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  const handleViewDetails = (calculation: SavedCalculation) => {
    // Charger directement le calcul
    if (onLoadCalculation) {
      onLoadCalculation(calculation.parameters, calculation.results);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (savedCalculations.length === 0) {
    return (
      <Card className="bg-card">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <Folder className="h-16 w-16 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-semibold text-lte-text mb-2">Aucun enregistrement</h3>
          <p className="text-sm text-lte-text-secondary max-w-md">
            Vos calculs enregistrés apparaîtront ici. Utilisez le bouton "Enregistrer" dans l'onglet Résultats pour sauvegarder vos calculs.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {savedCalculations.map((calculation) => {
          const recommendedResult = calculation.results.models.find(
            m => m.model === calculation.results.recommendedModel
          );

          return (
            <Card key={calculation.id} className="bg-card hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg text-lte-text">{calculation.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1 text-lte-text-secondary">
                      <Calendar className="h-3 w-3" />
                      {formatDate(calculation.date)}
                    </CardDescription>
                  </div>
                  <Badge className="bg-tech-primary text-white">
                    {recommendedResult?.numberOfSites || '-'} sites
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Paramètres clés */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-lte-text-secondary flex items-center gap-1">
                      <Radio className="h-3 w-3" />
                      Fréquence
                    </span>
                    <span className="font-medium text-lte-text">{calculation.parameters.frequency} MHz</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lte-text-secondary flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      Environnement
                    </span>
                    <span className="font-medium text-lte-text capitalize">{calculation.parameters.environment}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lte-text-secondary">Zone cible</span>
                    <span className="font-medium text-lte-text">{calculation.parameters.targetArea} km²</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lte-text-secondary">Rayon moyen</span>
                    <span className="font-medium text-tech-cyan">
                      {recommendedResult?.cellRadius.toFixed(2) || '-'} km
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2 border-t">
                  <Button
                    variant="default"
                    size="sm"
                    className="flex-1 bg-primary hover:bg-primary/90"
                    onClick={() => handleViewDetails(calculation)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Ouvrir
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Supprimer l'enregistrement</AlertDialogTitle>
                        <AlertDialogDescription>
                          Êtes-vous sûr de vouloir supprimer "{calculation.name}" ? Cette action est irréversible.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(calculation.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Supprimer
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </>
  );
};
