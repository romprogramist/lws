import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Calculator, Settings, Users, BarChart3, LogOut } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

const navigationItems = [
  { title: 'Панель управления', url: '/admin', icon: BarChart3 },
  { title: 'Настройки калькулятора', url: '/admin/calculator', icon: Calculator },
  { title: 'Пользователи', url: '/admin/users', icon: Users },
  { title: 'Настройки', url: '/admin/settings', icon: Settings },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const { signOut, profile } = useAuth();
  const collapsed = state === 'collapsed';
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    if (path === '/admin') {
      return currentPath === '/admin';
    }
    return currentPath.startsWith(path);
  };

  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? 'bg-muted text-primary font-medium' : 'hover:bg-muted/50';

  return (
    <Sidebar className={collapsed ? 'w-14' : 'w-60'} collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? 'sr-only' : ''}>
            Админ-панель
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end={item.url === '/admin'}
                      className={getNavCls({ isActive: isActive(item.url) })}
                    >
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        {/* User section */}
        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            {!collapsed && (
              <div className="px-2 py-2 text-sm text-muted-foreground border-t">
                <div className="font-medium">{profile?.full_name || profile?.email}</div>
                <div className="text-xs">{profile?.role === 'admin' ? 'Администратор' : 'Пользователь'}</div>
              </div>
            )}
            <SidebarMenu>
              <SidebarMenuItem>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={signOut}
                  className="w-full justify-start"
                >
                  <LogOut className="h-4 w-4" />
                  {!collapsed && <span>Выйти</span>}
                </Button>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}