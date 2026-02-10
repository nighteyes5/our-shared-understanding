import React from 'react';
import { PropagationModel } from '@/types/lte';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Info, Radio, Zap } from 'lucide-react';
import { LTECoverageService } from '@/services/map/lteCoverageService';

interface PropagationModelSelectorProps {
  selectedModel: PropagationModel;
  onModelChange: (model: PropagationModel) => void;
  averageFrequency?: number;
}

export const PropagationModelSelector: React.FC<PropagationModelSelectorProps> = ({
  selectedModel,
  onModelChange,
  averageFrequency
}) => {
  const availableModels = LTECoverageService.getAvailableModels();
  const recommendedModel = averageFrequency ? 
    LTECoverageService.getRecommendedModel(averageFrequency) : null;

  const selectedModelInfo = availableModels.find(m => m.model === selectedModel);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Radio className="h-5 w-5 text-blue-600" />
          <span>Modèle de Propagation Radio</span>
        </CardTitle>
        <CardDescription>
          Sélectionnez le modèle de calcul de couverture - Impact direct sur les rayons affichés
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Sélecteur principal - Plus visible */}
        <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
          <label className="text-sm font-semibold text-blue-900 mb-3 block">
            <Zap className="h-4 w-4 inline mr-2" />
            Modèle Actuel : {selectedModelInfo?.name}
          </label>
          <Select value={selectedModel} onValueChange={onModelChange}>
            <SelectTrigger className="w-full h-12 text-base font-medium">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {availableModels.map((model) => (
                <SelectItem key={model.model} value={model.model} className="py-3">
                  <div className="flex flex-col">
                    <div className="flex items-center justify-between w-full">
                      <span className="font-medium">{model.name}</span>
                      {recommendedModel === model.model && (
                        <Badge variant="default" className="ml-2 text-xs">
                          Recommandé
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs text-gray-500">{model.frequencyRange}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Boutons de sélection rapide */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Sélection Rapide
          </label>
          <div className="grid grid-cols-1 gap-2">
            {availableModels.map((model) => (
              <Button
                key={model.model}
                variant={selectedModel === model.model ? "default" : "outline"}
                className="justify-start h-auto p-3"
                onClick={() => onModelChange(model.model)}
              >
                <div className="flex flex-col items-start w-full">
                  <div className="flex items-center justify-between w-full">
                    <span className="font-medium">{model.name}</span>
                    {selectedModel === model.model && (
                      <Badge variant="secondary" className="text-xs">
                        Actuel
                      </Badge>
                    )}
                    {recommendedModel === model.model && selectedModel !== model.model && (
                      <Badge variant="default" className="text-xs">
                        Recommandé
                      </Badge>
                    )}
                  </div>
                  <span className="text-xs text-left mt-1 opacity-75">
                    {model.frequencyRange} • {model.description}
                  </span>
                </div>
              </Button>
            ))}
          </div>
        </div>

        {/* Informations sur le modèle sélectionné */}
        {selectedModelInfo && (
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-start space-x-2">
              <Info className="h-4 w-4 text-green-600 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold text-green-900">
                  {selectedModelInfo.name} - Modèle Actif
                </h4>
                <p className="text-sm text-green-800 mt-1">
                  {selectedModelInfo.description}
                </p>
                <div className="mt-2 flex items-center space-x-2">
                  <Badge variant="outline" className="text-xs bg-white">
                    {selectedModelInfo.frequencyRange}
                  </Badge>
                  <span className="text-xs text-green-700">
                    Les rayons de couverture sont calculés avec ce modèle
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recommandation basée sur la fréquence */}
        {averageFrequency && recommendedModel && recommendedModel !== selectedModel && (
          <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
            <div className="flex items-start space-x-2">
              <Info className="h-4 w-4 text-amber-600 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold text-amber-900">
                  Recommandation Automatique
                </h4>
                <p className="text-sm text-amber-800 mt-1">
                  Pour une fréquence moyenne de <strong>{averageFrequency.toFixed(0)} MHz</strong>, 
                  le modèle <strong>{availableModels.find(m => m.model === recommendedModel)?.name}</strong> 
                  est plus adapté et donnera des résultats plus précis.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onModelChange(recommendedModel)}
                  className="mt-2 bg-white hover:bg-amber-100"
                >
                  Utiliser {availableModels.find(m => m.model === recommendedModel)?.name}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Tableau comparatif détaillé */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-3">Comparaison Détaillée</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-3 font-semibold">Modèle</th>
                  <th className="text-left py-3 px-3 font-semibold">Fréquences</th>
                  <th className="text-left py-3 px-3 font-semibold">Applications</th>
                  <th className="text-left py-3 px-3 font-semibold">Statut</th>
                </tr>
              </thead>
              <tbody>
                {availableModels.map((model, index) => (
                  <tr 
                    key={model.model} 
                    className={`border-t ${selectedModel === model.model ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                  >
                    <td className="py-3 px-3">
                      <div className="font-medium">{model.name}</div>
                      <div className="text-xs text-gray-500 mt-1">{model.description}</div>
                    </td>
                    <td className="py-3 px-3 text-gray-600">
                      <Badge variant="outline" className="text-xs">
                        {model.frequencyRange}
                      </Badge>
                    </td>
                    <td className="py-3 px-3 text-gray-600 text-xs">
                      {model.model === 'okumura-hata' && 'GSM, LTE 700/800 MHz, Zones rurales'}
                      {model.model === 'cost231-hata' && 'LTE 1800/2100 MHz, Zones urbaines/suburbaines'}
                      {model.model === '3gpp' && 'LTE 2600 MHz, 5G, Zones très denses'}
                    </td>
                    <td className="py-3 px-3">
                      {selectedModel === model.model && (
                        <Badge variant="default" className="text-xs">
                          Actuel
                        </Badge>
                      )}
                      {recommendedModel === model.model && selectedModel !== model.model && (
                        <Badge variant="secondary" className="text-xs">
                          Recommandé
                        </Badge>
                      )}
                      {selectedModel !== model.model && recommendedModel !== model.model && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onModelChange(model.model)}
                          className="text-xs h-6 px-2"
                        >
                          Sélectionner
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Note technique importante */}
        <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded border-l-4 border-blue-500">
          <strong>Impact du Modèle :</strong> Le changement de modèle recalcule immédiatement tous les rayons de couverture 
          sur la carte. Chaque modèle utilise des formules différentes adaptées à des plages de fréquences spécifiques.
        </div>
      </CardContent>
    </Card>
  );
};