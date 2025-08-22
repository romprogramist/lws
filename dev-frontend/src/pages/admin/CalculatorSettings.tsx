import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Pencil, Save, X } from 'lucide-react';

interface CalculatorSetting {
  id: string;
  project_type: string;
  base_price: number;
  complexity_multipliers: any;
  timeline_multipliers: any;
  feature_price: number;
  is_active: boolean;
}

const projectTypeLabels = {
  website: 'Веб-сайт',
  webapp: 'Веб-приложение',
  mobileapp: 'Мобильное приложение',
  chatbot: 'Чат-бот',
  ecommerce: 'Интернет-магазин',
};

export default function CalculatorSettings() {
  const [settings, setSettings] = useState<CalculatorSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<CalculatorSetting>>({});
  const { toast } = useToast();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('calculator_settings')
        .select('*')
        .order('project_type');

      if (error) throw error;
      setSettings(data as CalculatorSetting[] || []);
    } catch (error) {
      console.error('Error loading settings:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить настройки",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (setting: CalculatorSetting) => {
    setEditingId(setting.id);
    setEditForm(setting);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveSettings = async () => {
    if (!editingId || !editForm) return;

    try {
      const { error } = await supabase
        .from('calculator_settings')
        .update({
          base_price: editForm.base_price,
          complexity_multipliers: editForm.complexity_multipliers,
          timeline_multipliers: editForm.timeline_multipliers,
          feature_price: editForm.feature_price,
          is_active: editForm.is_active,
        })
        .eq('id', editingId);

      if (error) throw error;

      toast({
        title: "Успешно",
        description: "Настройки сохранены",
      });

      await loadSettings();
      setEditingId(null);
      setEditForm({});
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить настройки",
        variant: "destructive",
      });
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
        <h1 className="text-3xl font-bold">Настройки калькулятора</h1>
        <p className="text-muted-foreground">
          Управление ценообразованием и параметрами расчета стоимости
        </p>
      </div>

      <div className="grid gap-4">
        {settings.map((setting) => (
          <Card key={setting.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {projectTypeLabels[setting.project_type as keyof typeof projectTypeLabels]}
                    <Badge variant={setting.is_active ? "default" : "secondary"}>
                      {setting.is_active ? "Активно" : "Неактивно"}
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    Тип проекта: {setting.project_type}
                  </CardDescription>
                </div>
                {editingId === setting.id ? (
                  <div className="flex gap-2">
                    <Button size="sm" onClick={saveSettings}>
                      <Save className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={cancelEdit}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <Button size="sm" variant="outline" onClick={() => startEdit(setting)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {editingId === setting.id ? (
                // Edit mode
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Базовая цена (₽)</Label>
                    <Input
                      type="number"
                      value={editForm.base_price || 0}
                      onChange={(e) => setEditForm(prev => ({ 
                        ...prev, 
                        base_price: parseInt(e.target.value) 
                      }))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Цена за доп. функцию (₽)</Label>
                    <Input
                      type="number"
                      value={editForm.feature_price || 0}
                      onChange={(e) => setEditForm(prev => ({ 
                        ...prev, 
                        feature_price: parseInt(e.target.value) 
                      }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Множители сложности</Label>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <Label className="text-xs">Простой</Label>
                        <Input
                          type="number"
                          step="0.1"
                          value={editForm.complexity_multipliers?.simple || 1}
                          onChange={(e) => setEditForm(prev => ({ 
                            ...prev, 
                            complexity_multipliers: {
                              ...prev.complexity_multipliers!,
                              simple: parseFloat(e.target.value)
                            }
                          }))}
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Средний</Label>
                        <Input
                          type="number"
                          step="0.1"
                          value={editForm.complexity_multipliers?.medium || 1.5}
                          onChange={(e) => setEditForm(prev => ({ 
                            ...prev, 
                            complexity_multipliers: {
                              ...prev.complexity_multipliers!,
                              medium: parseFloat(e.target.value)
                            }
                          }))}
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Сложный</Label>
                        <Input
                          type="number"
                          step="0.1"
                          value={editForm.complexity_multipliers?.complex || 2.5}
                          onChange={(e) => setEditForm(prev => ({ 
                            ...prev, 
                            complexity_multipliers: {
                              ...prev.complexity_multipliers!,
                              complex: parseFloat(e.target.value)
                            }
                          }))}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Множители срочности</Label>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <Label className="text-xs">Срочно</Label>
                        <Input
                          type="number"
                          step="0.1"
                          value={editForm.timeline_multipliers?.urgent || 1.8}
                          onChange={(e) => setEditForm(prev => ({ 
                            ...prev, 
                            timeline_multipliers: {
                              ...prev.timeline_multipliers!,
                              urgent: parseFloat(e.target.value)
                            }
                          }))}
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Обычно</Label>
                        <Input
                          type="number"
                          step="0.1"
                          value={editForm.timeline_multipliers?.normal || 1}
                          onChange={(e) => setEditForm(prev => ({ 
                            ...prev, 
                            timeline_multipliers: {
                              ...prev.timeline_multipliers!,
                              normal: parseFloat(e.target.value)
                            }
                          }))}
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Гибко</Label>
                        <Input
                          type="number"
                          step="0.1"
                          value={editForm.timeline_multipliers?.flexible || 0.8}
                          onChange={(e) => setEditForm(prev => ({ 
                            ...prev, 
                            timeline_multipliers: {
                              ...prev.timeline_multipliers!,
                              flexible: parseFloat(e.target.value)
                            }
                          }))}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id={`active-${setting.id}`}
                      checked={editForm.is_active || false}
                      onCheckedChange={(checked) => setEditForm(prev => ({ 
                        ...prev, 
                        is_active: checked 
                      }))}
                    />
                    <Label htmlFor={`active-${setting.id}`}>Активно</Label>
                  </div>
                </div>
              ) : (
                // View mode
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <p className="text-sm font-medium">Базовая цена</p>
                    <p className="text-2xl font-bold">{setting.base_price.toLocaleString()} ₽</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Доп. функция</p>
                    <p className="text-2xl font-bold">{setting.feature_price.toLocaleString()} ₽</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Сложность</p>
                    <p className="text-sm">
                      {setting.complexity_multipliers.simple}x / {setting.complexity_multipliers.medium}x / {setting.complexity_multipliers.complex}x
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Срочность</p>
                    <p className="text-sm">
                      {setting.timeline_multipliers.urgent}x / {setting.timeline_multipliers.normal}x / {setting.timeline_multipliers.flexible}x
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}