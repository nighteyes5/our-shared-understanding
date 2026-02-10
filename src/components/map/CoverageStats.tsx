import React from 'react';
import { LTESite } from '@/types/map';
import { LTEParameters, PropagationModel } from '@/types/lte';
import { LTECoverageService } from '@/services/map/lteCoverageService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Signal, Zap, MapPin, Radio, TrendingUp, AlertTriangle } from 'lucide-react';

interface CoverageStatsProps {
  sites: LTESite[];
  parameters: LTEParameters;
  propagationModel?: PropagationModel;
  selectedArea?: {
    name: string;
    area: number; // km²
  };
}

export const CoverageStats: React.FC<CoverageStatsProps> = ({
  sites,
  parameters,
  propagationModel = 'cost231-hata',
  selectedArea
}) => {
  // Calculs des statistiques avec le modèle de propagation
  const activeSites = sites.filter(site => site.isActive);
  
  // Utiliser le service de calcul pour obtenir les vraies valeurs
  const stats = LTECoverageService.calculateCoverageStatistics(sites, propagationModel);
  const totalCoverage = stats.totalCoverage;
  const averageRadius = stats.averageRadius;
  
  const averagePower = activeSites.length > 0 
    ? activeSites.reduce((sum, site) => sum + site.power, 0) / activeSites.length 
    : 0;

  const frequencyDistribution = activeSites.reduce((acc, site) => {
    acc[site.frequency] = (acc[site.frequency] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  const environmentDistribution = activeSites.reduce((acc, site) => {
    const env = site.environment === 'urban' ? 'Urbain' : 
                site.environment === 'suburban' ? 'Suburbain' : 'Rural';
    acc[env] = (acc[env] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Données pour les graphiques
  const frequencyData = Object.entries(frequencyDistribution).map(([freq, count]) => ({
    frequency: `${freq} MHz`,
    sites: count,
    percentage: (count / activeSites.length) * 100
  }));

  const environmentData = Object.entries(environmentDistribution).map(([env, count]) => ({
    name: env,
    value: count,
    percentage: (count / activeSites.length) * 100
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  // Estimation de la qualité de couverture
  const coverageQuality = () => {
    if (activeSites.length === 0) return { level: 'Aucune', color: 'bg-gray-500', score: 0 };
    
    const siteDensity = selectedArea ? activeSites.length / selectedArea.area : activeSites.length / 100;
    // Utiliser le rayon moyen calculé par le service
    const avgRadius = averageRadius;
    
    const score = Math.min((siteDensity * 20 + avgRadius * 10 + averagePower) / 3, 100);
    
    if (score >= 80) return { level: 'Excellente', color: 'bg-green-500', score };
    if (score >= 60) return { level: 'Bonne', color: 'bg-blue-500', score };
    if (score >= 40) return { level: 'Moyenne', color: 'bg-yellow-500', score };
    if (score >= 20) return { level: 'Faible', color: 'bg-orange-500', score };
    return { level: 'Très faible', color: 'bg-red-500', score };
  };

  const quality = coverageQuality();

  return (
    <div className="space-y-6">
      {/* Statistiques générales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sites Actifs</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeSites.length}</div>
            <p className="text-xs text-muted-foreground">
              sur {sites.length} total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Couverture Totale</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCoverage.toFixed(0)}</div>
            <p className="text-xs text-muted-foreground">km²</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Puissance Moyenne</CardTitle>
            <Radio className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averagePower.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">dBm</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Qualité Globale</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${quality.color}`}></div>
              <span className="text-sm font-medium">{quality.level}</span>
            </div>
            <Progress value={quality.score} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribution des fréquences */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Distribution des Fréquences</CardTitle>
            <CardDescription>Répartition des sites par bande de fréquence</CardDescription>
          </CardHeader>
          <CardContent>
            {frequencyData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={frequencyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="frequency" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => [value, 'Sites']}
                    labelFormatter={(label) => `Fréquence: ${label}`}
                  />
                  <Bar dataKey="sites" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-48 text-gray-500">
                <div className="text-center">
                  <Signal className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Aucun site actif</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Distribution des environnements */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Types d'Environnement</CardTitle>
            <CardDescription>Répartition des sites par type de terrain</CardDescription>
          </CardHeader>
          <CardContent>
            {environmentData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={environmentData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percentage }) => `${name} (${percentage.toFixed(0)}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {environmentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-48 text-gray-500">
                <div className="text-center">
                  <MapPin className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Aucun site actif</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Détails des sites */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Détails des Sites</CardTitle>
          <CardDescription>Liste détaillée de tous les sites configurés</CardDescription>
        </CardHeader>
        <CardContent>
          {sites.length > 0 ? (
            <div className="space-y-3">
              {sites.map((site) => (
                <div
                  key={site.id}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    site.isActive ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      site.isActive ? 'bg-green-500' : 'bg-gray-400'
                    }`}></div>
                    <div>
                      <p className="font-medium">{site.name}</p>
                      <p className="text-sm text-gray-600">
                        {site.frequency} MHz • {site.power} dBm • {site.antennaHeight}m
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <Badge variant={site.isActive ? "default" : "secondary"}>
                      {site.environment}
                    </Badge>
                    <p className="text-sm text-gray-600 mt-1">
                      Rayon: {site.isActive 
                        ? LTECoverageService.calculateRealCoverageRadius(site, propagationModel).toFixed(1) 
                        : '0.0'} km
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-32 text-gray-500">
              <div className="text-center">
                <AlertTriangle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Aucun site configuré</p>
                <p className="text-sm">Ajoutez des sites sur la carte pour voir les statistiques</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recommandations */}
      {activeSites.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Recommandations</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {quality.score < 50 && (
                <div className="flex items-start space-x-2 text-amber-700 bg-amber-50 p-3 rounded">
                  <AlertTriangle className="h-4 w-4 mt-0.5" />
                  <div>
                    <p className="font-medium">Couverture insuffisante</p>
                    <p className="text-sm">Considérez l'ajout de sites supplémentaires ou l'augmentation de la puissance.</p>
                  </div>
                </div>
              )}
              
              {activeSites.length < 3 && (
                <div className="flex items-start space-x-2 text-blue-700 bg-blue-50 p-3 rounded">
                  <Signal className="h-4 w-4 mt-0.5" />
                  <div>
                    <p className="font-medium">Redondance limitée</p>
                    <p className="text-sm">Ajoutez plus de sites pour améliorer la redondance et la qualité de service.</p>
                  </div>
                </div>
              )}
              
              {averagePower < 35 && (
                <div className="flex items-start space-x-2 text-orange-700 bg-orange-50 p-3 rounded">
                  <Radio className="h-4 w-4 mt-0.5" />
                  <div>
                    <p className="font-medium">Puissance faible</p>
                    <p className="text-sm">La puissance moyenne est faible. Vérifiez les paramètres de vos sites.</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};