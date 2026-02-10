import { Signal, User, LogOut, Settings, Key, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ChangePasswordDialog } from '@/components/auth/ChangePasswordDialog';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types/auth';

export const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="border-b bg-card">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Signal className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold">LTE Dimensioning Tool</h1>
            <p className="text-xs text-muted-foreground">Planification réseau 4G</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {user && (
            <>
              <div className="hidden items-center gap-2 sm:flex">
                <span className="text-sm text-muted-foreground">
                  {user.firstName} {user.lastName}
                </span>
                <Badge variant={user.role === UserRole.ADMIN ? "default" : "secondary"}>
                  {user.role === UserRole.ADMIN ? 'Admin' : 'Étudiant'}
                </Badge>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 rounded-full">
                    <User className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user.firstName} {user.lastName}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => window.location.href = '/dashboard'}>
                    <User className="mr-2 h-4 w-4" />
                    Tableau de bord
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => window.location.href = '/profile'}>
                    <User className="mr-2 h-4 w-4" />
                    Mon profil
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => window.location.href = '/map'}>
                    <MapPin className="mr-2 h-4 w-4" />
                    Planification géographique
                  </DropdownMenuItem>
                  {user.role === UserRole.ADMIN && (
                    <DropdownMenuItem onClick={() => window.location.href = '/admin'}>
                      <Settings className="mr-2 h-4 w-4" />
                      Administration
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <ChangePasswordDialog>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                      <Key className="mr-2 h-4 w-4" />
                      Changer le mot de passe
                    </DropdownMenuItem>
                  </ChangePasswordDialog>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Déconnexion
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
