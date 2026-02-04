import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Radio, Antenna, Signal, MapPin } from 'lucide-react';
import type { LTEParameters, EnvironmentType } from '@/types/lte';
import { FREQUENCY_BANDS, ENVIRONMENTS } from '@/types/lte';

interface ParameterFormProps {
  parameters: LTEParameters;
  onParametersChange: (params: LTEParameters) => void;
}

export const ParameterForm = ({ parameters, onParametersChange }: ParameterFormProps) => {
  const updateParam = <K extends keyof LTEParameters>(key: K, value: LTEParameters[K]) => {
    onParametersChange({ ...parameters, [key]: value });
  };

  return (
    <div className="space-y-6">
      {/* Paramètres de transmission */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <Radio className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Transmission (eNodeB)</CardTitle>
          </div>
          <CardDescription>Configuration de la station de base</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Fréquence</Label>
              <Select
                value={parameters.frequency.toString()}
                onValueChange={(v) => updateParam('frequency', parseInt(v))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FREQUENCY_BANDS.map((band) => (
                    <SelectItem key={band.value} value={band.value.toString()}>
                      {band.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Puissance TX (dBm)</Label>
              <Input
                type="number"
                value={parameters.txPower}
                onChange={(e) => updateParam('txPower', parseFloat(e.target.value))}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Gain d'antenne TX (dBi)</Label>
              <Input
                type="number"
                value={parameters.txAntennaGain}
                onChange={(e) => updateParam('txAntennaGain', parseFloat(e.target.value))}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Pertes câble TX (dB)</Label>
              <Input
                type="number"
                value={parameters.txCableLoss}
                onChange={(e) => updateParam('txCableLoss', parseFloat(e.target.value))}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Hauteur d'antenne TX: {parameters.txAntennaHeight} m</Label>
            <Slider
              value={[parameters.txAntennaHeight]}
              onValueChange={([v]) => updateParam('txAntennaHeight', v)}
              min={10}
              max={100}
              step={5}
            />
          </div>
        </CardContent>
      </Card>

      {/* Paramètres de réception */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <Signal className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Réception (UE)</CardTitle>
          </div>
          <CardDescription>Configuration de l'équipement utilisateur</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Sensibilité RX (dBm)</Label>
              <Input
                type="number"
                value={parameters.rxSensitivity}
                onChange={(e) => updateParam('rxSensitivity', parseFloat(e.target.value))}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Gain d'antenne RX (dBi)</Label>
              <Input
                type="number"
                value={parameters.rxAntennaGain}
                onChange={(e) => updateParam('rxAntennaGain', parseFloat(e.target.value))}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Hauteur d'antenne RX: {parameters.rxAntennaHeight} m</Label>
            <Slider
              value={[parameters.rxAntennaHeight]}
              onValueChange={([v]) => updateParam('rxAntennaHeight', v)}
              min={1}
              max={10}
              step={0.5}
            />
          </div>
        </CardContent>
      </Card>

      {/* Environnement et marges */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Environnement</CardTitle>
          </div>
          <CardDescription>Type de zone et marges de dimensionnement</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Type d'environnement</Label>
            <Select
              value={parameters.environment}
              onValueChange={(v) => updateParam('environment', v as EnvironmentType)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ENVIRONMENTS.map((env) => (
                  <SelectItem key={env.value} value={env.value}>
                    {env.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Separator />
          
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Marge de shadowing (dB): {parameters.shadowingMargin}</Label>
              <Slider
                value={[parameters.shadowingMargin]}
                onValueChange={([v]) => updateParam('shadowingMargin', v)}
                min={0}
                max={15}
                step={1}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Marge d'interférence (dB): {parameters.interferenceMargin}</Label>
              <Slider
                value={[parameters.interferenceMargin]}
                onValueChange={([v]) => updateParam('interferenceMargin', v)}
                min={0}
                max={10}
                step={0.5}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Zone cible */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <Antenna className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Zone de couverture</CardTitle>
          </div>
          <CardDescription>Surface à couvrir par le réseau</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label>Surface cible (km²): {parameters.targetArea}</Label>
            <Slider
              value={[parameters.targetArea]}
              onValueChange={([v]) => updateParam('targetArea', v)}
              min={10}
              max={500}
              step={10}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ParameterForm;
