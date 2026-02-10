import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AppStatus } from '@/components/debug/AppStatus';
import { UserRole } from '@/types/auth';

const AuthTest: React.FC = () => {
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="space-y-4 w-full max-w-md">
        <AppStatus />
        
        <Card>
          <CardHeader>
            <CardTitle>Test d'Authentification Détaillé</CardTitle>
            <CardDescription>Informations complètes du système</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>État:</span>
                <Badge variant={isAuthenticated ? "default" : "secondary"}>
                  {isAuthenticated ? 'Connecté' : 'Déconnecté'}
                </Badge>
              </div>
              
              <div className="flex justify-between">
                <span>Chargement:</span>
                <Badge variant={isLoading ? "default" : "secondary"}>
                  {isLoading ? 'Oui' : 'Non'}
                </Badge>
              </div>
            </div>
            
            {user && (
              <div className="border-t pt-4 space-y-2">
                <h3 className="font-semibold">Informations utilisateur:</h3>
                <div><strong>ID:</strong> {user.id}</div>
                <div><strong>Nom:</strong> {user.firstName} {user.lastName}</div>
                <div><strong>Email:</strong> {user.email}</div>
                <div><strong>Rôle:</strong> 
                  <Badge className="ml-2" variant={user.role === UserRole.ADMIN ? "default" : "secondary"}>
                    {user.role}
                  </Badge>
                </div>
                {user.className && <div><strong>Classe:</strong> {user.className}</div>}
                <div><strong>Actif:</strong> {user.isActive ? 'Oui' : 'Non'}</div>
                <div><strong>Créé le:</strong> {new Date(user.createdAt).toLocaleDateString('fr-FR')}</div>
                {user.lastLogin && (
                  <div><strong>Dernière connexion:</strong> {new Date(user.lastLogin).toLocaleString('fr-FR')}</div>
                )}
              </div>
            )}
            
            <div className="border-t pt-4 space-y-2">
              {isAuthenticated ? (
                <div className="space-y-2">
                  <Button 
                    onClick={() => window.location.href = user?.role === UserRole.ADMIN ? '/admin' : '/dashboard'} 
                    className="w-full"
                  >
                    Aller au {user?.role === UserRole.ADMIN ? 'panneau admin' : 'tableau de bord'}
                  </Button>
                  <Button onClick={logout} variant="outline" className="w-full">
                    Se déconnecter
                  </Button>
                </div>
              ) : (
                <Button onClick={() => window.location.href = '/login'} className="w-full">
                  Se connecter
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthTest;