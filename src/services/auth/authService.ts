import { User, LoginCredentials, CreateUserData, Class, UserRole } from '@/types/auth';

// Simulation d'une base de données locale (en production, utilisez une vraie API)
const STORAGE_KEYS = {
  USERS: 'lte_app_users',
  CLASSES: 'lte_app_classes',
  CURRENT_USER: 'lte_app_current_user',
  SESSION_TOKEN: 'lte_app_session_token'
};

// Données par défaut
const DEFAULT_ADMIN: User = {
  id: 'admin-1',
  email: 'admin@lte-app.com',
  firstName: 'Admin',
  lastName: 'System',
  role: UserRole.ADMIN,
  isActive: true,
  createdAt: new Date().toISOString()
};

const DEFAULT_CLASSES: Class[] = [
  {
    id: 'class-1',
    name: 'Télécommunications 2024',
    description: 'Promotion 2024 - Spécialité Télécommunications',
    studentCount: 0,
    createdAt: new Date().toISOString()
  },
  {
    id: 'class-2',
    name: 'Réseaux 2024',
    description: 'Promotion 2024 - Spécialité Réseaux',
    studentCount: 0,
    createdAt: new Date().toISOString()
  }
];

class AuthService {
  private initializeStorage() {
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      // Créer l'admin par défaut avec un mot de passe hashé (simulation)
      const users = [{ 
        ...DEFAULT_ADMIN, 
        passwordHash: this.hashPassword('admin123') 
      }];
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    }
    
    if (!localStorage.getItem(STORAGE_KEYS.CLASSES)) {
      localStorage.setItem(STORAGE_KEYS.CLASSES, JSON.stringify(DEFAULT_CLASSES));
    }
  }

  private hashPassword(password: string): string {
    // En production, utilisez bcrypt ou une autre méthode sécurisée
    return btoa(password + 'salt_key_lte_app');
  }

  private verifyPassword(password: string, hash: string): boolean {
    return this.hashPassword(password) === hash;
  }

  private generateToken(): string {
    return btoa(Date.now() + Math.random().toString()).replace(/[^a-zA-Z0-9]/g, '');
  }

  private getStoredUsers(): any[] {
    this.initializeStorage();
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
  }

  private saveUsers(users: any[]): void {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }

  async login(credentials: LoginCredentials): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulation délai réseau
    
    const users = this.getStoredUsers();
    const user = users.find(u => u.email === credentials.email && u.isActive);
    
    if (!user || !this.verifyPassword(credentials.password, user.passwordHash)) {
      throw new Error('Email ou mot de passe incorrect');
    }

    // Mettre à jour la dernière connexion
    user.lastLogin = new Date().toISOString();
    this.saveUsers(users);

    // Créer une session
    const token = this.generateToken();
    localStorage.setItem(STORAGE_KEYS.SESSION_TOKEN, token);
    
    const { passwordHash, ...userWithoutPassword } = user;
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(userWithoutPassword));
    
    return userWithoutPassword;
  }

  logout(): void {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    localStorage.removeItem(STORAGE_KEYS.SESSION_TOKEN);
  }

  getCurrentUser(): User | null {
    const token = localStorage.getItem(STORAGE_KEYS.SESSION_TOKEN);
    if (!token) return null;
    
    const userStr = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return userStr ? JSON.parse(userStr) : null;
  }

  async createUser(userData: CreateUserData): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const users = this.getStoredUsers();
    
    // Vérifier si l'email existe déjà
    if (users.find(u => u.email === userData.email)) {
      throw new Error('Un utilisateur avec cet email existe déjà');
    }

    const newUser = {
      id: `user-${Date.now()}`,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      role: userData.role,
      classId: userData.classId,
      className: userData.className,
      isActive: true,
      createdAt: new Date().toISOString(),
      passwordHash: this.hashPassword(userData.password)
    };

    users.push(newUser);
    this.saveUsers(users);

    // Mettre à jour le nombre d'étudiants dans la classe
    if (userData.classId && userData.role === UserRole.STUDENT) {
      this.updateClassStudentCount(userData.classId);
    }

    const { passwordHash, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  async getUsers(): Promise<User[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const users = this.getStoredUsers();
    return users.map(({ passwordHash, ...user }) => user);
  }

  async toggleUserStatus(userId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const users = this.getStoredUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      throw new Error('Utilisateur non trouvé');
    }

    users[userIndex].isActive = !users[userIndex].isActive;
    this.saveUsers(users);

    // Mettre à jour le nombre d'étudiants dans la classe
    if (users[userIndex].classId && users[userIndex].role === UserRole.STUDENT) {
      this.updateClassStudentCount(users[userIndex].classId);
    }
  }

  async getClasses(): Promise<Class[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    this.initializeStorage();
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.CLASSES) || '[]');
  }

  async createClass(name: string, description?: string): Promise<Class> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const classes = await this.getClasses();
    
    if (classes.find(c => c.name === name)) {
      throw new Error('Une classe avec ce nom existe déjà');
    }

    const newClass: Class = {
      id: `class-${Date.now()}`,
      name,
      description,
      studentCount: 0,
      createdAt: new Date().toISOString()
    };

    classes.push(newClass);
    localStorage.setItem(STORAGE_KEYS.CLASSES, JSON.stringify(classes));
    
    return newClass;
  }

  private updateClassStudentCount(classId: string): void {
    const users = this.getStoredUsers();
    const classes = JSON.parse(localStorage.getItem(STORAGE_KEYS.CLASSES) || '[]');
    
    const classIndex = classes.findIndex((c: Class) => c.id === classId);
    if (classIndex !== -1) {
      const activeStudents = users.filter(u => 
        u.classId === classId && 
        u.role === UserRole.STUDENT && 
        u.isActive
      ).length;
      
      classes[classIndex].studentCount = activeStudents;
      localStorage.setItem(STORAGE_KEYS.CLASSES, JSON.stringify(classes));
    }
  }

  async getUsersByClass(classId: string): Promise<User[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const users = await this.getUsers();
    return users.filter(u => u.classId === classId && u.role === UserRole.STUDENT);
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const users = this.getStoredUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      throw new Error('Utilisateur non trouvé');
    }

    const user = users[userIndex];
    
    // Vérifier l'ancien mot de passe
    if (!this.verifyPassword(currentPassword, user.passwordHash)) {
      throw new Error('Mot de passe actuel incorrect');
    }

    // Mettre à jour avec le nouveau mot de passe
    users[userIndex].passwordHash = this.hashPassword(newPassword);
    users[userIndex].updatedAt = new Date().toISOString();
    
    this.saveUsers(users);
  }

  async deleteUser(userId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const users = this.getStoredUsers();
    const userToDelete = users.find(u => u.id === userId);
    
    if (!userToDelete) {
      throw new Error('Utilisateur non trouvé');
    }

    // Ne pas permettre la suppression du dernier admin
    if (userToDelete.role === UserRole.ADMIN) {
      const adminCount = users.filter(u => u.role === UserRole.ADMIN && u.isActive).length;
      if (adminCount <= 1) {
        throw new Error('Impossible de supprimer le dernier administrateur');
      }
    }

    // Supprimer l'utilisateur
    const filteredUsers = users.filter(u => u.id !== userId);
    this.saveUsers(filteredUsers);

    // Mettre à jour le nombre d'étudiants dans la classe si nécessaire
    if (userToDelete.classId && userToDelete.role === UserRole.STUDENT) {
      this.updateClassStudentCount(userToDelete.classId);
    }
  }

  async resetUserPassword(userId: string, newPassword: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const users = this.getStoredUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      throw new Error('Utilisateur non trouvé');
    }

    users[userIndex].passwordHash = this.hashPassword(newPassword);
    users[userIndex].updatedAt = new Date().toISOString();
    
    this.saveUsers(users);
  }

  async updateUser(userId: string, updateData: Partial<User>): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const users = this.getStoredUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      throw new Error('Utilisateur non trouvé');
    }

    // Vérifier si l'email existe déjà (si on change l'email)
    if (updateData.email && updateData.email !== users[userIndex].email) {
      const emailExists = users.find(u => u.email === updateData.email && u.id !== userId);
      if (emailExists) {
        throw new Error('Un utilisateur avec cet email existe déjà');
      }
    }

    // Mettre à jour les informations
    const updatedUser = {
      ...users[userIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    users[userIndex] = updatedUser;
    this.saveUsers(users);

    // Mettre à jour le nombre d'étudiants dans la classe si nécessaire
    if (updateData.classId && updateData.role === UserRole.STUDENT) {
      this.updateClassStudentCount(updateData.classId);
    }

    const { passwordHash, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }

  async deleteClass(classId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const users = this.getStoredUsers();
    const classes = JSON.parse(localStorage.getItem(STORAGE_KEYS.CLASSES) || '[]');
    
    // Trouver la classe
    const classToDelete = classes.find((c: Class) => c.id === classId);
    if (!classToDelete) {
      throw new Error('Classe non trouvée');
    }

    // Supprimer tous les utilisateurs de cette classe
    const usersInClass = users.filter(u => u.classId === classId);
    const remainingUsers = users.filter(u => u.classId !== classId);
    
    // Sauvegarder les utilisateurs restants
    this.saveUsers(remainingUsers);
    
    // Supprimer la classe
    const remainingClasses = classes.filter((c: Class) => c.id !== classId);
    localStorage.setItem(STORAGE_KEYS.CLASSES, JSON.stringify(remainingClasses));
    
    console.log(`Classe "${classToDelete.name}" supprimée avec ${usersInClass.length} utilisateur(s)`);
  }
}

export const authService = new AuthService();