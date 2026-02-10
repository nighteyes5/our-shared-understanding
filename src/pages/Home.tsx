import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types/auth';
import Landing from './Landing';

const Home: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      // Rediriger selon le rôle si déjà connecté
      const redirectTo = user.role === UserRole.ADMIN ? '/admin' : '/dashboard';
      navigate(redirectTo, { replace: true });
    }
  }, [isAuthenticated, user, isLoading, navigate]);

  // Si non connecté, afficher la page vitrine
  if (!isAuthenticated) {
    return <Landing />;
  }

  // Pendant le chargement ou la redirection
  return null;
};

export default Home;