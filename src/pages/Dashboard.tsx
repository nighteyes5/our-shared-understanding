import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { LogOut, Calculator, User, Clock, FileText, Trash2, Eye, Key, MapPin } from 'lucide-react';
import { UserRole } from '@/types/auth';
import { userDataService, UserCalculation } from '@/services/userDataService';
import { ChangePasswordDialog } from '@/components/auth/ChangePasswordDialog';
import { toast } from '@/hooks/use-toast';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [calculations, setCalculations] = useState<UserCalculation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadUserCalculations();
    }
  }, [user]);

  const loadUserCalculations = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const userCalculations = await userDataService.getUserCalculations(user.id);
      setCalculations(userCalculations);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger vos calculs",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCalculation = async (calculationId: string) => {
    if (!user) return;
    
    try {
      await userDataService.deleteUserCalculation(user.id, calculationId);
      toast({
        title: "Calcul supprimé",
        description: "Le calcul a été supprimé avec succès",
      });
      loadUserCalculations();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le calcul",
        variant: "destructive",
      });
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Calculator className="h-8 w-8 text-blue-600" />
              <h1 className="text-xl font-semibold text-gray-900">
                Calculateur LTE
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700">
                  {user.firstName} {user.lastName}
                </span>
                <Badge variant={user.role === UserRole.ADMIN ? "default" : "secondary"}>
                  {user.role === UserRole.ADMIN ? 'Administrateur' : 'Étudiant'}
                </Badge>
              </div>
              
              <Button variant="outline" size="sm" onClick={logout}>
                <LogOut className="h-4 w-4 mr-2" />
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Tableau de bord
          </h2>
          <p className="text-gray-600">
            Bienvenue dans votre espace personnel de calculs LTE
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Profil utilisateur */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Mon Profil</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <p className="text-sm text-gray-500">Nom complet</p>
                <p className="font-medium">{user.firstName} {user.lastName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
              {user.className && (
                <div>
                  <p className="text-sm text-gray-500">Classe</p>
                  <p className="font-medium">{user.className}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-500">Rôle</p>
                <Badge variant={user.role === UserRole.ADMIN ? "default" : "secondary"}>
                  {user.role === UserRole.ADMIN ? 'Administrateur' : 'Étudiant'}
                </Badge>
              </div>
              
              <div className="pt-2">
                <ChangePasswordDialog>
                  <Button variant="outline" size="sm" className="w-full">
                    <Key className="h-4 w-4 mr-2" />
                    Changer le mot de passe
                  </Button>
                </ChangePasswordDialog>
              </div>
            </CardContent>
          </Card>

          {/* Statistiques des calculs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Mes Enregistrements</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{calculations.length}</div>
              <p className="text-sm text-gray-500">Calculs enregistrés</p>
              {calculations.length > 0 && (
                <div className="mt-2">
                  <p className="text-xs text-gray-500">
                    Dernier : {new Date(calculations[0]?.createdAt).toLocaleString('fr-FR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Dernière connexion */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Activité</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <p className="text-sm text-gray-500">Dernière connexion</p>
                <p className="font-medium">
                  {user.lastLogin 
                    ? new Date(user.lastLogin).toLocaleString('fr-FR', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                      })
                    : 'Première connexion'
                  }
                </p>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-500">Compte créé le</p>
                <p className="font-medium">
                  {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Accès aux calculs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calculator className="h-5 w-5" />
              <span>Calculs LTE</span>
            </CardTitle>
            <CardDescription>
              Accédez à vos outils de calcul
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button className="w-full" onClick={() => window.location.href = '/calculator'}>
                <Calculator className="h-4 w-4 mr-2" />
                Calculateur LTE
              </Button>
              <Button variant="outline" className="w-full" onClick={() => window.location.href = '/map'}>
                <MapPin className="h-4 w-4 mr-2" />
                Planification Géographique
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Mes calculs sauvegardés */}
        {calculations.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Mes enregistrements</CardTitle>
              <CardDescription>
                Vos derniers calculs de dimensionnement LTE
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-4">Chargement...</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nom</TableHead>
                      <TableHead>Environnement</TableHead>
                      <TableHead>Fréquence</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {calculations.slice(0, 5).map((calc) => (
                      <TableRow key={calc.id}>
                        <TableCell className="font-medium">{calc.name}</TableCell>
                        <TableCell className="capitalize">{calc.parameters.environment}</TableCell>
                        <TableCell>{calc.parameters.frequency} MHz</TableCell>
                        <TableCell>
                          {new Date(calc.createdAt).toLocaleString('fr-FR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => {
                                // Rediriger vers le calculateur avec les paramètres
                                window.location.href = `/calculator?loadId=${calc.id}`;
                              }}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Ouvrir
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteCalculation(calc.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
              {calculations.length > 5 && (
                <div className="mt-4 text-center">
                  <Button variant="outline" size="sm">
                    Voir tous les calculs ({calculations.length})
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Section admin */}
        {user.role === UserRole.ADMIN && (
          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Administration</CardTitle>
                <CardDescription>
                  Gérez les utilisateurs et les classes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => window.location.href = '/admin'}>
                  Accéder à l'interface d'administration
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;