import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users, Calculator, Activity, TrendingUp, Clock, MapPin, Calendar, Radio, UserCheck } from 'lucide-react';
import { authService } from '@/services/auth/authService';
import { userDataService } from '@/services/userDataService';
import { UserRole } from '@/types/auth';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface UsageStats {
  totalUsers: number;
  activeUsers: number;
  totalCalculations: number;
  calculationsToday: number;
  newUsersThisWeek: number;
  totalMapProjects: number;
  averageCoverageRadius: number;
  topUsers: Array<{
    userId: string;
    userName: string;
    role: string;
    calculationCount: number;
    lastActivity: string;
  }>;
  recentActivity: Array<{
    userId: string;
    userName: string;
    action: string;
    timestamp: string;
  }>;
  dailyActivity: Array<{ date: string; calculs: number; utilisateurs: number }>;
  weeklyActivity: Array<{ semaine: string; calculs: number; nouveauxUtilisateurs: number }>;
  monthlyActivity: Array<{ mois: string; calculs: number; utilisateurs: number }>;
  hourlyActivity: Array<{ heure: string; calculs: number }>;
  environmentData: Array<{ name: string; value: number; color: string }>;
  roleData: Array<{ name: string; value: number; color: string }>;
  frequencyData: Array<{ frequence: string; utilisations: number }>;
}

export const UsageStatistics: React.FC = () => {
  const [stats, setStats] = useState<UsageStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    try {
      setIsLoading(true);
      
      const users = await authService.getUsers();
      const totalUsers = users.length;
      
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const activeUsers = users.filter(user => 
        user.lastLogin && new Date(user.lastLogin) > thirtyDaysAgo
      ).length;

      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const newUsersThisWeek = users.filter(u => 
        new Date(u.createdAt) > sevenDaysAgo
      ).length;

      const studentCount = users.filter(u => u.role === UserRole.STUDENT).length;
      const teacherCount = users.filter(u => u.role === UserRole.TEACHER).length;
      const adminCount = users.filter(u => u.role === UserRole.ADMIN).length;

      let totalCalculations = 0;
      let calculationsByEnv = { urban: 0, suburban: 0, rural: 0 };
      let calculationsByFreq: Record<number, number> = {};
      let calculationsByHour: Record<number, number> = {};
      const userCalculationCounts: Record<string, { count: number; lastActivity: string }> = {};
      const recentActivity: Array<any> = [];
      let totalRadius = 0;
      let radiusCount = 0;

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      let calculationsToday = 0;

      users.forEach(user => {
        const userCalcs = userDataService.getUserCalculations(user.id);
        totalCalculations += userCalcs.length;
        
        if (!userCalculationCounts[user.id]) {
          userCalculationCounts[user.id] = { count: 0, lastActivity: '' };
        }
        userCalculationCounts[user.id].count = userCalcs.length;

        userCalcs.forEach(calc => {
          const calcDate = new Date(calc.createdAt);
          
          if (calcDate >= today) calculationsToday++;

          if (!userCalculationCounts[user.id].lastActivity || 
              calcDate > new Date(userCalculationCounts[user.id].lastActivity)) {
            userCalculationCounts[user.id].lastActivity = calc.createdAt;
          }

          if (calc.parameters.environment in calculationsByEnv) {
            calculationsByEnv[calc.parameters.environment as keyof typeof calculationsByEnv]++;
          }

          const freq = calc.parameters.frequency;
          calculationsByFreq[freq] = (calculationsByFreq[freq] || 0) + 1;

          const hour = calcDate.getHours();
          calculationsByHour[hour] = (calculationsByHour[hour] || 0) + 1;

          if (calc.results?.coverageRadius) {
            totalRadius += calc.results.coverageRadius;
            radiusCount++;
          }

          recentActivity.push({
            userId: user.id,
            userName: `${user.firstName} ${user.lastName}`,
            action: `${calc.name} (${calc.parameters.environment}, ${calc.parameters.frequency} MHz)`,
            timestamp: calc.createdAt
          });
        });
      });

      recentActivity.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      // Graphiques - Activité quotidienne (7 derniers jours)
      const dailyActivity = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        date.setHours(0, 0, 0, 0);
        const nextDay = new Date(date);
        nextDay.setDate(nextDay.getDate() + 1);

        const dayCalcs = recentActivity.filter(a => {
          const actDate = new Date(a.timestamp);
          return actDate >= date && actDate < nextDay;
        }).length;

        const dayUsers = new Set(
          recentActivity
            .filter(a => {
              const actDate = new Date(a.timestamp);
              return actDate >= date && actDate < nextDay;
            })
            .map(a => a.userId)
        ).size;

        dailyActivity.push({
          date: date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }),
          calculs: dayCalcs,
          utilisateurs: dayUsers
        });
      }

      // Activité hebdomadaire (4 dernières semaines)
      const weeklyActivity = [];
      for (let i = 3; i >= 0; i--) {
        const weekStart = new Date();
        weekStart.setDate(weekStart.getDate() - (i * 7 + 7));
        const weekEnd = new Date();
        weekEnd.setDate(weekEnd.getDate() - (i * 7));

        const weekCalcs = recentActivity.filter(a => {
          const actDate = new Date(a.timestamp);
          return actDate >= weekStart && actDate < weekEnd;
        }).length;

        const newUsers = users.filter(u => {
          const createdDate = new Date(u.createdAt);
          return createdDate >= weekStart && createdDate < weekEnd;
        }).length;

        weeklyActivity.push({
          semaine: `S-${i}`,
          calculs: weekCalcs,
          nouveauxUtilisateurs: newUsers
        });
      }

      // Activité mensuelle (6 derniers mois)
      const monthlyActivity = [];
      for (let i = 5; i >= 0; i--) {
        const monthDate = new Date();
        monthDate.setMonth(monthDate.getMonth() - i);
        const monthStart = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
        const monthEnd = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);

        const monthCalcs = recentActivity.filter(a => {
          const actDate = new Date(a.timestamp);
          return actDate >= monthStart && actDate <= monthEnd;
        }).length;

        const monthUsers = users.filter(u => {
          const createdDate = new Date(u.createdAt);
          return createdDate <= monthEnd;
        }).length;

        monthlyActivity.push({
          mois: monthDate.toLocaleDateString('fr-FR', { month: 'short' }),
          calculs: monthCalcs,
          utilisateurs: monthUsers
        });
      }

      // Activité par heure (24h)
      const hourlyActivity = [];
      for (let h = 0; h < 24; h++) {
        const hourCalcs = Object.keys(calculationsByHour).includes(h.toString()) 
          ? calculationsByHour[h] 
          : 0;
        hourlyActivity.push({
          heure: `${h}h`,
          calculs: hourCalcs
        });
      }

      // Données pour graphiques en camembert
      const environmentData = [
        { name: 'Urbain', value: calculationsByEnv.urban, color: '#2563EB' },
        { name: 'Suburbain', value: calculationsByEnv.suburban, color: '#16A34A' },
        { name: 'Rural', value: calculationsByEnv.rural, color: '#F59E0B' }
      ];

      const roleData = [
        { name: 'Étudiants', value: studentCount, color: '#16A34A' },
        { name: 'Enseignants', value: teacherCount, color: '#2563EB' },
        { name: 'Admins', value: adminCount, color: '#DC2626' }
      ];

      // Données pour graphique à barres - Fréquences
      const frequencyData = Object.entries(calculationsByFreq)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 8)
        .map(([freq, count]) => ({
          frequence: `${freq} MHz`,
          utilisations: count
        }));

      const topUsers = Object.entries(userCalculationCounts)
        .map(([userId, data]) => {
          const user = users.find(u => u.id === userId);
          return {
            userId,
            userName: user ? `${user.firstName} ${user.lastName}` : 'Inconnu',
            role: user?.role || 'N/A',
            calculationCount: data.count,
            lastActivity: data.lastActivity
          };
        })
        .sort((a, b) => b.calculationCount - a.calculationCount)
        .slice(0, 10);

      const mapSites = localStorage.getItem('lte_sites');
      const totalMapProjects = mapSites ? JSON.parse(mapSites).length : 0;
      const averageCoverageRadius = radiusCount > 0 ? totalRadius / radiusCount : 0;

      setStats({
        totalUsers,
        activeUsers,
        totalCalculations,
        calculationsToday,
        newUsersThisWeek,
        totalMapProjects,
        averageCoverageRadius,
        topUsers,
        recentActivity: recentActivity.slice(0, 15),
        dailyActivity,
        weeklyActivity,
        monthlyActivity,
        hourlyActivity,
        environmentData,
        roleData,
        frequencyData
      });
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case UserRole.ADMIN:
        return 'bg-red-100 text-red-800';
      case UserRole.TEACHER:
        return 'bg-blue-100 text-blue-800';
      case UserRole.STUDENT:
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Activity className="h-12 w-12 mx-auto mb-4 text-gray-400 animate-pulse" />
          <p className="text-gray-500">Chargement des statistiques...</p>
        </CardContent>
      </Card>
    );
  }

  if (!stats) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-gray-500">Impossible de charger les statistiques</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cartes de statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Utilisateurs totaux</p>
                <p className="text-3xl font-bold text-blue-600">{stats.totalUsers}</p>
                <Badge variant="secondary" className="text-xs mt-2">
                  {stats.activeUsers} actifs
                </Badge>
              </div>
              <Users className="h-12 w-12 text-blue-600 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-white border-purple-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Calculs totaux</p>
                <p className="text-3xl font-bold text-purple-600">{stats.totalCalculations}</p>
                <Badge variant="secondary" className="text-xs mt-2">
                  {stats.calculationsToday} aujourd'hui
                </Badge>
              </div>
              <Calculator className="h-12 w-12 text-purple-600 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-white border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Nouveaux utilisateurs</p>
                <p className="text-3xl font-bold text-green-600">{stats.newUsersThisWeek}</p>
                <p className="text-xs text-gray-500 mt-2">Cette semaine</p>
              </div>
              <UserCheck className="h-12 w-12 text-green-600 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-white border-orange-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Sites LTE</p>
                <p className="text-3xl font-bold text-orange-600">{stats.totalMapProjects}</p>
                <p className="text-xs text-gray-500 mt-2">Rayon: {stats.averageCoverageRadius.toFixed(0)} m</p>
              </div>
              <MapPin className="h-12 w-12 text-orange-600 opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Graphiques principaux - Activité dans le temps */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>Activité des 7 derniers jours</span>
            </CardTitle>
            <CardDescription>Calculs et utilisateurs actifs par jour</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={stats.dailyActivity}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="calculs" 
                  stackId="1"
                  stroke="#8B5CF6" 
                  fill="#8B5CF6" 
                  name="Calculs"
                />
                <Area 
                  type="monotone" 
                  dataKey="utilisateurs" 
                  stackId="2"
                  stroke="#2563EB" 
                  fill="#2563EB" 
                  name="Utilisateurs actifs"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Évolution sur 6 mois</span>
            </CardTitle>
            <CardDescription>Croissance des calculs et utilisateurs</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats.monthlyActivity}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mois" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="calculs" 
                  stroke="#8B5CF6" 
                  strokeWidth={2}
                  name="Calculs"
                />
                <Line 
                  type="monotone" 
                  dataKey="utilisateurs" 
                  stroke="#16A34A" 
                  strokeWidth={2}
                  name="Utilisateurs totaux"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Graphiques de répartition */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="h-5 w-5" />
              <span>Par environnement</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={stats.environmentData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {stats.environmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Par rôle</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={stats.roleData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {stats.roleData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>4 dernières semaines</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={stats.weeklyActivity}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="semaine" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="calculs" fill="#8B5CF6" name="Calculs" />
                <Bar dataKey="nouveauxUtilisateurs" fill="#16A34A" name="Nouveaux" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Graphiques d'analyse détaillée */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Activité par heure (24h)</span>
            </CardTitle>
            <CardDescription>Heures de pointe d'utilisation</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.hourlyActivity}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="heure" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="calculs" fill="#06B6D4" name="Calculs" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Radio className="h-5 w-5" />
              <span>Fréquences LTE les plus utilisées</span>
            </CardTitle>
            <CardDescription>Top 8 des fréquences</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.frequencyData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="frequence" type="category" width={80} />
                <Tooltip />
                <Bar dataKey="utilisations" fill="#F59E0B" name="Utilisations" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top utilisateurs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Utilisateurs les plus actifs</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rang</TableHead>
                <TableHead>Utilisateur</TableHead>
                <TableHead>Rôle</TableHead>
                <TableHead>Calculs</TableHead>
                <TableHead>Dernière activité</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stats.topUsers.map((user, index) => (
                <TableRow key={user.userId}>
                  <TableCell>
                    <Badge variant={index < 3 ? "default" : "secondary"}>
                      #{index + 1}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{user.userName}</TableCell>
                  <TableCell>
                    <Badge className={getRoleBadgeColor(user.role)}>
                      {user.role === UserRole.ADMIN ? 'Admin' : 
                       user.role === UserRole.TEACHER ? 'Enseignant' : 'Étudiant'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{user.calculationCount}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {user.lastActivity ? formatDate(user.lastActivity) : 'N/A'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Activité récente */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Activité récente</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Utilisateur</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Date et heure</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stats.recentActivity.map((activity, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{activity.userName}</TableCell>
                  <TableCell className="text-sm">{activity.action}</TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {formatDate(activity.timestamp)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
