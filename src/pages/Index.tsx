import { useState, useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Settings, BarChart3, Table, Calculator } from 'lucide-react';
import Header from '@/components/lte/Header';
import ParameterForm from '@/components/lte/ParameterForm';
import ResultsDisplay from '@/components/lte/ResultsDisplay';
import CoverageChart from '@/components/lte/CoverageChart';
import { useLTECalculations } from '@/hooks/useLTECalculations';
import { DEFAULT_LTE_PARAMETERS } from '@/types/lte';
import type { LTEParameters } from '@/types/lte';

const Index = () => {
  const [parameters, setParameters] = useState<LTEParameters>(DEFAULT_LTE_PARAMETERS);
  const { compareModels } = useLTECalculations();

  const results = useMemo(() => compareModels(parameters), [parameters, compareModels]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container px-4 py-6">
        <Tabs defaultValue="parameters" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
            <TabsTrigger value="parameters" className="gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Paramètres</span>
            </TabsTrigger>
            <TabsTrigger value="results" className="gap-2">
              <Table className="h-4 w-4" />
              <span className="hidden sm:inline">Résultats</span>
            </TabsTrigger>
            <TabsTrigger value="charts" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Visualisation</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="parameters" className="space-y-6">
            <div className="rounded-lg bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-4">
              <div className="flex items-center gap-3">
                <Calculator className="h-6 w-6 text-primary" />
                <div>
                  <h2 className="font-semibold">Configuration des paramètres</h2>
                  <p className="text-sm text-muted-foreground">
                    Définissez les caractéristiques du réseau LTE à dimensionner
                  </p>
                </div>
              </div>
            </div>
            
            <div className="grid gap-6 lg:grid-cols-2">
              <ParameterForm parameters={parameters} onParametersChange={setParameters} />
              
              {/* Aperçu rapide */}
              <div className="space-y-4 lg:sticky lg:top-6 lg:self-start">
                <div className="rounded-lg border bg-card p-4">
                  <h3 className="mb-3 font-semibold">Aperçu rapide</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Fréquence</span>
                      <span className="font-medium">{parameters.frequency} MHz</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Environnement</span>
                      <span className="font-medium capitalize">{parameters.environment}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Zone cible</span>
                      <span className="font-medium">{parameters.targetArea} km²</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Puissance TX</span>
                      <span className="font-medium">{parameters.txPower} dBm</span>
                    </div>
                    <div className="border-t pt-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Sites estimés</span>
                        <span className="text-lg font-bold text-primary">
                          {results.models.find(m => m.model === results.recommendedModel)?.numberOfSites || '-'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Button 
                  className="w-full" 
                  onClick={() => {
                    const tab = document.querySelector('[data-state="inactive"][value="results"]') as HTMLElement;
                    tab?.click();
                  }}
                >
                  Voir les résultats détaillés
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="results" className="space-y-6">
            <div className="rounded-lg bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-4">
              <div className="flex items-center gap-3">
                <Table className="h-6 w-6 text-primary" />
                <div>
                  <h2 className="font-semibold">Résultats du dimensionnement</h2>
                  <p className="text-sm text-muted-foreground">
                    Comparaison des trois modèles de propagation
                  </p>
                </div>
              </div>
            </div>
            
            <ResultsDisplay results={results} />
          </TabsContent>

          <TabsContent value="charts" className="space-y-6">
            <div className="rounded-lg bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-4">
              <div className="flex items-center gap-3">
                <BarChart3 className="h-6 w-6 text-primary" />
                <div>
                  <h2 className="font-semibold">Visualisation des données</h2>
                  <p className="text-sm text-muted-foreground">
                    Graphiques de couverture et comparaison des modèles
                  </p>
                </div>
              </div>
            </div>
            
            <CoverageChart parameters={parameters} />
          </TabsContent>
        </Tabs>
      </main>
      
      {/* Footer */}
      <footer className="border-t bg-card py-4">
        <div className="container px-4 text-center text-sm text-muted-foreground">
          <p>Outil de dimensionnement LTE • Modèles: Okumura-Hata, COST 231-Hata, 3GPP TR 36.814</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
