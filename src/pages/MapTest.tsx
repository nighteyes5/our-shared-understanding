import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { OpenLayersMap } from '@/components/map/OpenLayersMap';
import { Map, Home, LogOut } from 'lucide-react';
import { UserRole } from '@/types/auth';
import { LTESite } from '@/types/map';

const MapTest: React.FC = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  // Sites de test pour Dakar
  const testSites: LTESite[] = [
    {
      id: 'test-1',
      name: 'Site Plateau',
      position: { lat: 14.6928, lng: -17.4467 },
      power: 43,
      frequency: 1800,
      antennaHeight: 30,
      coverageRadius: 3,
      environment: 'urban',
      isActive: true,
      createdAt: new Date().toISOString()
    },
    {
      id: 'test-2',
      name: 'Site Almadies',
      position: { lat: 14.7167, lng: -17.4833 },
      power: 40,
      frequency: 2100,
      antennaHeight: 25,
      coverageRadius: 2.5,
      environment: 'suburban',
      isActive: true,
      createdAt: new Date().toISOString()
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Map className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Test OpenLayers - Dakar
                </h1>
                <p className="text-sm text-gray-500">
                  Test de la carte géographique avec OpenStreetMap
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.href = user.role === UserRole.ADMIN ? '/admin' : '/dashboard'}
              >
                <Home className="h-4 w-4 mr-2" />
                Accueil
              </Button>
              
              <Button variant="outline" size="sm" onClick={logout}>
                <LogOut className="h-4 w-4 mr-2" />
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="space-y-6">
          {/* Informations */}
          <Card>
            <CardHeader>
              <CardTitle>Test de la Carte OpenLayers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p>✅ OpenLayers installé et configuré</p>
                <p>✅ Carte centrée sur Dakar, Sénégal</p>
                <p>✅ Sites de test avec couverture</p>
                <p>✅ Données OpenStreetMap</p>
              </div>
            </CardContent>
          </Card>

          {/* Carte de test */}
          <OpenLayersMap
            sites={testSites}
            center={{ lat: 14.6928, lng: -17.4467 }}
            zoom={12}
            showCoverage={true}
            onSiteAdd={(position) => {
              console.log('Nouveau site à:', position);
            }}
            onSiteSelect={(site) => {
              console.log('Site sélectionné:', site);
            }}
          />

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button 
                  className="w-full" 
                  onClick={() => window.location.href = '/map'}
                >
                  Aller à la Carte Complète
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => window.location.href = '/dashboard'}
                >
                  Retour au Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default MapTest;