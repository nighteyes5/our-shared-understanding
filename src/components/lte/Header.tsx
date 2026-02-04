import { Signal, Wifi } from 'lucide-react';

export const Header = () => {
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
        
        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-1 text-sm text-muted-foreground sm:flex">
            <Wifi className="h-4 w-4" />
            <span>v1.0</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
