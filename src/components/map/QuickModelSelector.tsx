import React from 'react';
import { PropagationModel } from '@/types/lte';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Radio, Zap } from 'lucide-react';
import { LTECoverageService } from '@/services/map/lteCoverageService';

interface QuickModelSelectorProps {
  selectedModel: PropagationModel;
  onModelChange: (model: PropagationModel) => void;
  sitesCount?: number;
}

export const QuickModelSelector: React.FC<QuickModelSelectorProps> = ({
  selectedModel,
  onModelChange,
  sitesCount = 0
}) => {
  const availableModels = LTECoverageService.getAvailableModels();
  const selectedModelInfo = availableModels.find(m => m.model === selectedModel);

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Radio className="h-4 w-4 text-blue-600" />
            <span className="font-medium text-sm">Modèle de Propagation</span>
          </div>
          <Badge variant="outline" className="text-xs">
            <Zap className="h-3 w-3 mr-1" />
            {sitesCount} sites
          </Badge>
        </div>

        {/* Sélection par boutons */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          {availableModels.map((model) => (
            <Button
              key={model.model}
              variant={selectedModel === model.model ? "default" : "outline"}
              size="sm"
              onClick={() => onModelChange(model.model)}
              className="h-auto p-2 text-xs"
            >
              <div className="text-center">
                <div className="font-medium">{model.name}</div>
                <div className="text-xs opacity-75 mt-1">
                  {model.model === 'okumura-hata' && '≤1500 MHz'}
                  {model.model === 'cost231-hata' && '1500-2000 MHz'}
                  {model.model === '3gpp' && '≥2000 MHz'}
                </div>
              </div>
            </Button>
          ))}
        </div>

        {/* Informations sur le modèle actuel */}
        {selectedModelInfo && (
          <div className="bg-blue-50 p-2 rounded text-xs">
            <div className="flex items-center justify-between">
              <span className="font-medium text-blue-900">
                {selectedModelInfo.name} actif
              </span>
              <Badge variant="outline" className="text-xs">
                {selectedModelInfo.frequencyRange}
              </Badge>
            </div>
            <p className="text-blue-800 mt-1">
              {selectedModelInfo.description}
            </p>
          </div>
        )}

        {/* Note d'impact */}
        <div className="text-xs text-gray-500 mt-2 text-center">
          Le changement de modèle recalcule tous les rayons de couverture
        </div>
      </CardContent>
    </Card>
  );
};