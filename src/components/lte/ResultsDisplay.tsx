import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CheckCircle, TrendingUp, Antenna, Radio } from 'lucide-react';
import type { ComparisonResult, PropagationModel } from '@/types/lte';

interface ResultsDisplayProps {
  results: ComparisonResult | null;
}

export const ResultsDisplay = ({ results }: ResultsDisplayProps) => {
  if (!results) {
    return (
      <Card className="flex h-64 items-center justify-center">
        <p className="text-muted-foreground">Configurez les paramètres pour voir les résultats</p>
      </Card>
    );
  }

  const formatNumber = (num: number, decimals: number = 2) => num.toFixed(decimals);

  const getRecommendedBadge = (model: PropagationModel) => {
    if (model === results.recommendedModel) {
      return (
        <Badge variant="default" className="ml-2 gap-1">
          <CheckCircle className="h-3 w-3" />
          Recommandé
        </Badge>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Résumé */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="pb-2">
            <CardDescription>Portée moyenne</CardDescription>
            <CardTitle className="text-2xl text-primary">
              {formatNumber(results.averageRange)} km
            </CardTitle>
          </CardHeader>
        </Card>
        
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="pb-2">
            <CardDescription>Sites moyens</CardDescription>
            <CardTitle className="text-2xl text-primary">
              {Math.ceil(results.averageSites)}
            </CardTitle>
          </CardHeader>
        </Card>
        
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="pb-2">
            <CardDescription>Meilleure portée</CardDescription>
            <CardTitle className="text-2xl text-primary">
              {formatNumber(Math.max(...results.models.map(m => m.maxRange)))} km
            </CardTitle>
          </CardHeader>
        </Card>
        
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="pb-2">
            <CardDescription>Moins de sites</CardDescription>
            <CardTitle className="text-2xl text-primary">
              {Math.min(...results.models.map(m => m.numberOfSites))}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Tableau comparatif */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <CardTitle>Comparaison des modèles</CardTitle>
          </div>
          <CardDescription>
            Résultats détaillés pour chaque modèle de propagation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Modèle</TableHead>
                <TableHead className="text-right">Path Loss (dB)</TableHead>
                <TableHead className="text-right">Portée max (km)</TableHead>
                <TableHead className="text-right">Rayon cellule (km)</TableHead>
                <TableHead className="text-right">Surface cellule (km²)</TableHead>
                <TableHead className="text-right">Nb. Sites</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.models.map((model) => (
                <TableRow key={model.model} className={model.model === results.recommendedModel ? 'bg-primary/5' : ''}>
                  <TableCell className="font-medium">
                    {model.modelName}
                    {getRecommendedBadge(model.model)}
                  </TableCell>
                  <TableCell className="text-right">{formatNumber(model.pathLoss, 1)}</TableCell>
                  <TableCell className="text-right">{formatNumber(model.maxRange)}</TableCell>
                  <TableCell className="text-right">{formatNumber(model.cellRadius)}</TableCell>
                  <TableCell className="text-right">{formatNumber(model.cellArea)}</TableCell>
                  <TableCell className="text-right font-semibold">{model.numberOfSites}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Détails par modèle */}
      <div className="grid gap-4 md:grid-cols-3">
        {results.models.map((model) => (
          <Card key={model.model} className={model.model === results.recommendedModel ? 'border-primary' : ''}>
            <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {model.model === 'okumura-hata' && <Radio className="h-4 w-4 text-primary" />}
                  {model.model === 'cost231-hata' && <Antenna className="h-4 w-4 text-primary" />}
                  {model.model === '3gpp' && <TrendingUp className="h-4 w-4 text-primary" />}
                  <CardTitle className="text-base">{model.modelName}</CardTitle>
                </div>
                {getRecommendedBadge(model.model)}
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Portée maximale</span>
                <span className="font-medium">{formatNumber(model.maxRange)} km</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Rayon de cellule</span>
                <span className="font-medium">{formatNumber(model.cellRadius)} km</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Surface par cellule</span>
                <span className="font-medium">{formatNumber(model.cellArea)} km²</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Secteurs par site</span>
                <span className="font-medium">{model.sectorCount}</span>
              </div>
              <div className="flex justify-between border-t pt-2 text-sm">
                <span className="font-medium">Nombre de sites</span>
                <span className="text-lg font-bold text-primary">{model.numberOfSites}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ResultsDisplay;
