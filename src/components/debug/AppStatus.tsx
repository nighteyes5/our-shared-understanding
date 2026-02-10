import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export const AppStatus: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();

  return (
    <Card className="w-full max-w-md mx-auto mt-4">
      <CardHeader>
        <CardTitle>État de l'Application</CardTitle>
        <CardDescription>Diagnostic en temps réel</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between items-center">
          <span>Application:</span>
          <Badge variant="default">Fonctionnelle</Badge>
        </div>
        
        <div className="flex justify-between items-center">
          <span>Authentification:</span>
          <Badge variant={isAuthenticated ? "default" : "secondary"}>
            {isAuthenticated ? 'Connecté' : 'Déconnecté'}
          </Badge>
        </div>
        
        <div className="flex justify-between items-center">
          <span>Chargement:</span>
          <Badge variant={isLoading ? "destructive" : "default"}>
            {isLoading ? 'En cours' : 'Terminé'}
          </Badge>
        </div>
        
        {user && (
          <div className="border-t pt-3 space-y-2">
            <div><strong>Utilisateur:</strong> {user.firstName} {user.lastName}</div>
            <div><strong>Rôle:</strong> {user.role}</div>
            <div><strong>Email:</strong> {user.email}</div>
          </div>
        )}
        
        <div className="border-t pt-3 space-y-2">
          <Button 
            size="sm" 
            className="w-full"
            onClick={() => window.location.href = isAuthenticated ? '/dashboard' : '/login'}
          >
            {isAuthenticated ? 'Aller au Dashboard' : 'Se connecter'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};