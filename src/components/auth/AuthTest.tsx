import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const AuthTest: React.FC = () => {
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <Card className="w-full max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle>Test d'Authentification</CardTitle>
        <CardDescription>État actuel de l'authentification</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <strong>Connecté:</strong> {isAuthenticated ? 'Oui' : 'Non'}
        </div>
        
        {user && (
          <div className="space-y-2">
            <div><strong>Nom:</strong> {user.firstName} {user.lastName}</div>
            <div><strong>Email:</strong> {user.email}</div>
            <div><strong>Rôle:</strong> {user.role}</div>
            <div><strong>Classe:</strong> {user.className || 'Aucune'}</div>
            <div><strong>Actif:</strong> {user.isActive ? 'Oui' : 'Non'}</div>
          </div>
        )}
        
        {isAuthenticated && (
          <Button onClick={logout} variant="outline" className="w-full">
            Se déconnecter
          </Button>
        )}
      </CardContent>
    </Card>
  );
};