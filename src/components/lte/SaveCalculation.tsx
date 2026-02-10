import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { Save, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { userDataService } from '@/services/userDataService';
import { LTEParameters, LTEResults } from '@/types/lte';

interface SaveCalculationProps {
  parameters: LTEParameters;
  results: LTEResults;
  onSaved?: () => void;
}

export const SaveCalculation: React.FC<SaveCalculationProps> = ({
  parameters,
  results,
  onSaved
}) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour sauvegarder",
        variant: "destructive",
      });
      return;
    }

    if (!name.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir un nom pour le calcul",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      await userDataService.saveUserCalculation(
        user.id,
        name.trim(),
        parameters,
        results
      );

      toast({
        title: "Calcul enregistré",
        description: `"${name}" a été enregistré avec succès`,
      });

      setIsOpen(false);
      setName('');
      onSaved?.();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer le calcul",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const generateDefaultName = () => {
    const date = new Date().toLocaleDateString('fr-FR');
    const time = new Date().toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    return `Calcul ${parameters.environment} - ${date} ${time}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Save className="h-4 w-4 mr-2" />
          Enregistrer
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Enregistrer le calcul</DialogTitle>
          <DialogDescription>
            Donnez un nom à ce calcul pour le retrouver facilement
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="calculationName">Nom du calcul</Label>
            <Input
              id="calculationName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isSaving}
            />
          </div>

          <div className="text-sm text-muted-foreground space-y-1">
            <p><strong>Paramètres :</strong></p>
            <p>• Fréquence : {parameters.frequency} MHz</p>
            <p>• Environnement : {parameters.environment}</p>
            <p>• Zone cible : {parameters.targetArea} km²</p>
            <p>• Modèle recommandé : {results.recommendedModel}</p>
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isSaving}
            >
              Annuler
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Enregistrer
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};