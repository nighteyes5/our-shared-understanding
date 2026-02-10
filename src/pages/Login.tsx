import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { LoginForm } from '@/components/auth/LoginForm';
import { useAuth } from '@/contexts/AuthContext';
import { LoginCredentials, UserRole } from '@/types/auth';
import { Radio, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import '../pages/landing.css';

const Login: React.FC = () => {
  const { login, isAuthenticated, user, isLoading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  // Rediriger si déjà connecté
  useEffect(() => {
    if (isAuthenticated && user && !isLoading) {
      const redirectTo = user.role === UserRole.ADMIN ? '/admin' : '/dashboard';
      navigate(redirectTo, { replace: true });
    }
  }, [isAuthenticated, user, isLoading, navigate]);

  const handleLogin = async (credentials: LoginCredentials) => {
    setIsSubmitting(true);
    setError('');
    
    try {
      await login(credentials);
      // La redirection sera gérée par useEffect ci-dessus
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="landing-dark min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-[#00C8FF]/5 blur-[120px] animate-pulse-glow" />
      </div>

      {/* Back button */}
      <Button
        variant="ghost"
        className="absolute top-6 left-6 text-[#8a95a3] hover:text-[#d4dce6] hover:bg-[#141b24]"
        onClick={() => navigate('/')}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Retour
      </Button>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="relative flex items-center justify-center w-12 h-12">
              <div className="absolute inset-0 rounded-lg bg-[#00C8FF]/20" />
              <Radio className="w-6 h-6 text-[#00C8FF] relative z-10" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-[#d4dce6] mb-2">
            Connexion
          </h1>
          <p className="text-[#8a95a3]">
            Accédez à la plateforme de dimensionnement LTE
          </p>
        </div>
        
        <LoginForm 
          onLogin={handleLogin}
          isLoading={isSubmitting}
          error={error}
        />
      </div>
    </div>
  );
};

export default Login;