import { authService } from '@/services/auth/authService';

export const testAuthService = () => {
  console.log('=== Test du Service d\'Authentification ===');
  
  // Test 1: Vérifier l'initialisation
  console.log('1. Test d\'initialisation...');
  const currentUser = authService.getCurrentUser();
  console.log('Utilisateur actuel:', currentUser);
  
  // Test 2: Vérifier le localStorage
  console.log('2. Contenu du localStorage:');
  console.log('Users:', localStorage.getItem('lte_app_users'));
  console.log('Classes:', localStorage.getItem('lte_app_classes'));
  console.log('Current User:', localStorage.getItem('lte_app_current_user'));
  console.log('Session Token:', localStorage.getItem('lte_app_session_token'));
  
  // Test 3: Test de connexion
  console.log('3. Test de connexion admin...');
  authService.login({
    email: 'admin@lte-app.com',
    password: 'admin123'
  }).then(user => {
    console.log('Connexion réussie:', user);
  }).catch(error => {
    console.error('Erreur de connexion:', error);
  });
};

// Fonction pour nettoyer le localStorage
export const clearAuthData = () => {
  localStorage.removeItem('lte_app_users');
  localStorage.removeItem('lte_app_classes');
  localStorage.removeItem('lte_app_current_user');
  localStorage.removeItem('lte_app_session_token');
  console.log('Données d\'authentification supprimées');
};