import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Calculator, Users, Settings } from 'lucide-react';

interface Stats {
  totalUsers: number;
  totalCalculatorSettings: number;
  activeSettings: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalCalculatorSettings: 0,
    activeSettings: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      // Get user count
      const { count: userCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Get calculator settings count
      const { count: settingsCount } = await supabase
        .from('calculator_settings')
        .select('*', { count: 'exact', head: true });

      // Get active settings count
      const { count: activeCount } = await supabase
        .from('calculator_settings')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      setStats({
        totalUsers: userCount || 0,
        totalCalculatorSettings: settingsCount || 0,
        activeSettings: activeCount || 0,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Панель управления</h1>
        <p className="text-muted-foreground">
          Обзор системы и основные метрики
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Всего пользователей
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              Зарегистрированных в системе
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Настройки калькулятора
            </CardTitle>
            <Calculator className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCalculatorSettings}</div>
            <p className="text-xs text-muted-foreground">
              Типов проектов настроено
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Активные настройки
            </CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeSettings}</div>
            <p className="text-xs text-muted-foreground">
              Доступны для расчета
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Быстрые действия</CardTitle>
            <CardDescription>
              Наиболее частые операции
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span>Редактировать настройки калькулятора</span>
              <Badge variant="secondary">Настройки</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Просмотр пользователей</span>
              <Badge variant="secondary">Пользователи</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Системные настройки</span>
              <Badge variant="secondary">Система</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Системная информация</CardTitle>
            <CardDescription>
              Статус и версии
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span>База данных</span>
              <Badge variant="outline" className="text-green-600">Подключена</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Аутентификация</span>
              <Badge variant="outline" className="text-green-600">Активна</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>API</span>
              <Badge variant="outline" className="text-green-600">Работает</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}