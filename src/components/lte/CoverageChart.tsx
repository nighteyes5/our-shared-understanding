import { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import type { LTEParameters, PropagationModel } from '@/types/lte';
import { useLTECalculations } from '@/hooks/useLTECalculations';

interface CoverageChartProps {
  parameters: LTEParameters;
  maxDistance?: number;
}

const chartConfig = {
  'okumura-hata': {
    label: 'Okumura-Hata',
    color: 'hsl(220, 90%, 56%)',
  },
  'cost231-hata': {
    label: 'COST 231-Hata',
    color: 'hsl(142, 76%, 36%)',
  },
  '3gpp': {
    label: '3GPP TR 36.814',
    color: 'hsl(24, 95%, 53%)',
  },
};

export const CoverageChart = ({ parameters, maxDistance = 15 }: CoverageChartProps) => {
  const { generateCoverageData, compareModels } = useLTECalculations();

  const coverageData = useMemo(
    () => generateCoverageData(parameters, maxDistance),
    [parameters, maxDistance, generateCoverageData]
  );

  const results = useMemo(() => compareModels(parameters), [parameters, compareModels]);

  // Calculer le seuil de path loss maximum
  const maxPathLoss = useMemo(() => {
    const EIRP = parameters.txPower + parameters.txAntennaGain - parameters.txCableLoss;
    const rxGain = parameters.rxAntennaGain - parameters.rxCableLoss;
    const margins = parameters.shadowingMargin + parameters.interferenceMargin;
    return EIRP + rxGain - parameters.rxSensitivity - margins;
  }, [parameters]);

  const chartData = coverageData.map((point) => ({
    distance: point.distance,
    'Okumura-Hata': point.pathLoss['okumura-hata'],
    'COST 231-Hata': point.pathLoss['cost231-hata'],
    '3GPP TR 36.814': point.pathLoss['3gpp'],
  }));

  return (
    <div className="space-y-6">
      {/* Graphique principal */}
      <Card>
        <CardHeader>
          <CardTitle>Affaiblissement de parcours vs Distance</CardTitle>
          <CardDescription>
            Comparaison des trois modèles de propagation. La ligne pointillée indique le seuil maximum ({maxPathLoss.toFixed(1)} dB)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="distance" 
                  label={{ value: 'Distance (km)', position: 'insideBottom', offset: -10 }}
                  className="text-xs"
                />
                <YAxis 
                  label={{ value: 'Path Loss (dB)', angle: -90, position: 'insideLeft' }}
                  domain={[80, 200]}
                  className="text-xs"
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                  formatter={(value: number) => [`${value.toFixed(1)} dB`, '']}
                  labelFormatter={(label) => `Distance: ${label} km`}
                />
                <Legend />
                <ReferenceLine 
                  y={maxPathLoss} 
                  stroke="hsl(var(--destructive))" 
                  strokeDasharray="5 5"
                  label={{ value: 'Seuil max', fill: 'hsl(var(--destructive))', fontSize: 12 }}
                />
                <Line
                  type="monotone"
                  dataKey="Okumura-Hata"
                  stroke="hsl(220, 90%, 56%)"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="COST 231-Hata"
                  stroke="hsl(142, 76%, 36%)"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="3GPP TR 36.814"
                  stroke="hsl(24, 95%, 53%)"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Barres de portée */}
      <Card>
        <CardHeader>
          <CardTitle>Portée maximale par modèle</CardTitle>
          <CardDescription>
            Distance de couverture calculée pour chaque modèle de propagation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {results.models.map((model) => {
              const percentage = (model.maxRange / Math.max(...results.models.map(m => m.maxRange))) * 100;
              const colors: Record<PropagationModel, string> = {
                'okumura-hata': 'bg-blue-500',
                'cost231-hata': 'bg-green-500',
                '3gpp': 'bg-orange-500',
              };
              
              return (
                <div key={model.model} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{model.modelName}</span>
                    <span className="text-muted-foreground">{model.maxRange.toFixed(2)} km</span>
                  </div>
                  <div className="h-3 w-full overflow-hidden rounded-full bg-secondary">
                    <div
                      className={`h-full transition-all duration-500 ${colors[model.model]}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Graphique du nombre de sites */}
      <Card>
        <CardHeader>
          <CardTitle>Nombre de sites requis</CardTitle>
          <CardDescription>
            Estimation du nombre d'eNodeB nécessaires pour couvrir {parameters.targetArea} km²
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                layout="vertical"
                data={results.models.map(m => ({
                  name: m.modelName,
                  sites: m.numberOfSites,
                  area: m.cellArea,
                }))}
                margin={{ top: 20, right: 30, left: 100, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" className="text-xs" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                  formatter={(value: number, name: string) => {
                    if (name === 'sites') return [`${value} sites`, 'Sites requis'];
                    return [`${value.toFixed(2)} km²`, 'Surface/cellule'];
                  }}
                />
                <Line
                  dataKey="sites"
                  fill="hsl(var(--primary))"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CoverageChart;
