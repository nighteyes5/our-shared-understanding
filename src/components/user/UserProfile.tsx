import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ChangePasswordDialog } from '@/components/auth/ChangePasswordDialog';
import { EditProfileDialog } from './EditProfileDialog';
import { User, Mail, Calendar, Shield, GraduationCap, Key, Clock, Edit } from 'lucide-react';
import { UserRole } from '@/types/auth';

export const UserProfile: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <User className="h-5 w-5" />
          <span>Mon Profil</span>
        </CardTitle>
        <CardDescription>
          Informations personnelles et paramètres du compte
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Informations personnelles */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground">Informations personnelles</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Nom complet</span>
              </div>
              <p className="font-medium">{user.firstName} {user.lastName}</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Email</span>
              </div>
              <p className="font-medium">{user.email}</p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Informations du compte */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground">Informations du compte</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Rôle</span>
              </div>
              <Badge variant={user.role === UserRole.ADMIN ? "default" : "secondary"}>
                {user.role === UserRole.ADMIN ? 'Administrateur' : 'Étudiant'}
              </Badge>
            </div>
            
            {user.className && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Classe</span>
                </div>
                <p className="font-medium">{user.className}</p>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Compte créé le</span>
              </div>
              <p className="font-medium">
                {new Date(user.createdAt).toLocaleDateString('fr-FR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            
            {user.lastLogin && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Dernière connexion</span>
                </div>
                <p className="font-medium">
                  {new Date(user.lastLogin).toLocaleString('fr-FR', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                  })}
                </p>
              </div>
            )}
          </div>
        </div>

        <Separator />

        {/* Actions */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground">Actions</h3>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <EditProfileDialog>
              <Button variant="outline" className="w-full sm:w-auto">
                <Edit className="h-4 w-4 mr-2" />
                Modifier mes informations
              </Button>
            </EditProfileDialog>
            
            <ChangePasswordDialog>
              <Button variant="outline" className="w-full sm:w-auto">
                <Key className="h-4 w-4 mr-2" />
                Changer le mot de passe
              </Button>
            </ChangePasswordDialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};