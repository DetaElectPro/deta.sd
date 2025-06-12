
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
  Images,
  LogOut,
  Menu,
  X,
  Tag,
  Users,
  ChevronLeft,
  ChevronRight,
  Globe,
  Package,
  ShoppingCart
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
    { name: isRTL ? 'لوحة التحكم' : 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: isRTL ? 'المحتوى' : 'Content', href: '/admin/content', icon: FileText },
    { name: isRTL ? 'الفئات' : 'Categories', href: '/admin/categories', icon: Tag },
    { name: isRTL ? 'المنتجات' : 'Products', href: '/admin/products', icon: Package },
    { name: isRTL ? 'الطلبات' : 'Orders', href: '/admin/orders', icon: ShoppingCart },
    { name: isRTL ? 'المستخدمون' : 'Users', href: '/admin/users', icon: Users },
    { name: isRTL ? 'اللغات' : 'Languages', href: '/admin/languages', icon: Globe },
    { name: isRTL ? 'الوسائط' : 'Media', href: '/admin/media', icon: Image },
    { name: isRTL ? 'صور الخلفية' : 'Background Images', href: '/admin/background-images', icon: Images },
    { name: isRTL ? 'الإعدادات' : 'Settings', href: '/admin/settings', icon: Settings },
    { name: isRTL ? 'التحليلات' : 'Analytics', href: '/admin/analytics', icon: BarChart3 },
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
              {isRTL ? 'ديتا' : 'DETA'}
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
              {isRTL ? 'ديتا' : 'DETA'}
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
