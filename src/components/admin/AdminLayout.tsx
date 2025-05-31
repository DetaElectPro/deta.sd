
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';
import { LanguageSelector } from './LanguageSelector';
import {
  LayoutDashboard,
  FileText,
  Settings,
  BarChart3,
  Image,
  LogOut,
  Menu,
  X,
  Tag,
  Users,
  ChevronLeft,
  ChevronRight,
  Globe
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { signOut, userProfile } = useAuth();
  const { t, isRTL } = useLanguage();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  console.log('AdminLayout render:', { userProfile, currentPath: location.pathname });

  const navigation = [
    { name: t('admin.dashboard'), href: '/admin', icon: LayoutDashboard },
    { name: t('admin.content'), href: '/admin/content', icon: FileText },
    { name: t('admin.categories'), href: '/admin/categories', icon: Tag },
    { name: t('admin.users'), href: '/admin/users', icon: Users },
    { name: t('admin.languages'), href: '/admin/languages', icon: Globe },
    { name: t('admin.media'), href: '/admin/media', icon: Image },
    { name: t('admin.settings'), href: '/admin/settings', icon: Settings },
    { name: t('admin.analytics'), href: '/admin/analytics', icon: BarChart3 },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const ChevronIcon = isRTL ? ChevronRight : ChevronLeft;

  return (
    <div className="min-h-screen bg-gray-50 flex" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 ${isRTL ? 'right-0' : 'left-0'} z-30 bg-white shadow-lg transform transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        sidebarOpen ? 'translate-x-0' : isRTL ? 'translate-x-full' : '-translate-x-full'
      } ${sidebarCollapsed ? 'w-16' : 'w-64'}`}>
        
        {/* Sidebar Header */}
        <div className={`flex items-center justify-between h-16 px-4 border-b ${sidebarCollapsed ? 'px-2' : 'px-6'}`}>
          {!sidebarCollapsed && (
            <h1 className="text-xl font-bold text-deta-green arabic-heading">
              {t('site.title')}
            </h1>
          )}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="hidden lg:flex"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
              <ChevronIcon className={`h-5 w-5 transition-transform ${sidebarCollapsed ? 'rotate-180' : ''}`} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        {/* Language Selector */}
        {!sidebarCollapsed && (
          <div className="p-4 border-b">
            <LanguageSelector />
          </div>
        )}
        
        {/* Navigation */}
        <nav className="mt-6 px-3 flex-1">
          <div className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-deta-green text-white shadow-sm'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-deta-green'
                  } ${sidebarCollapsed ? 'justify-center' : ''}`}
                  title={sidebarCollapsed ? item.name : ''}
                >
                  <Icon className={`h-5 w-5 flex-shrink-0 ${sidebarCollapsed ? '' : isRTL ? 'ml-3' : 'mr-3'}`} />
                  {!sidebarCollapsed && <span>{item.name}</span>}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User Profile & Logout */}
        <div className="absolute bottom-0 w-full p-4 border-t bg-gray-50">
          {!sidebarCollapsed && (
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-deta-green rounded-full flex items-center justify-center text-white font-bold">
                {userProfile?.full_name?.charAt(0) || 'A'}
              </div>
              <div className={`${isRTL ? 'mr-3' : 'ml-3'}`}>
                <p className="text-sm font-medium text-gray-700">{userProfile?.full_name || 'Admin'}</p>
                <p className="text-xs text-gray-500">{userProfile?.role || 'admin'}</p>
              </div>
            </div>
          )}
          <Button
            variant="outline"
            className={`w-full hover:bg-red-50 hover:text-red-600 hover:border-red-200 ${sidebarCollapsed ? 'px-2' : ''}`}
            onClick={handleSignOut}
          >
            <LogOut className={`h-4 w-4 ${sidebarCollapsed ? '' : isRTL ? 'ml-2' : 'mr-2'}`} />
            {!sidebarCollapsed && (isRTL ? 'تسجيل الخروج' : 'Logout')}
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top bar for mobile */}
        <div className="bg-white shadow-sm border-b lg:hidden">
          <div className="flex items-center justify-between h-16 px-4">
            <h1 className="text-lg font-medium text-gray-900 arabic-heading">
              {t('site.title')}
            </h1>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
