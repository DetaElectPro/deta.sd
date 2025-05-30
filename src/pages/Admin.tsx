
import { Routes, Route } from 'react-router-dom';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { MultilingualContentManager } from '@/components/admin/MultilingualContentManager';
import { CategoriesManager } from '@/components/admin/CategoriesManager';
import { UsersManager } from '@/components/admin/UsersManager';
import { MediaManager } from '@/components/admin/MediaManager';
import { SiteSettingsManager } from '@/components/admin/SiteSettingsManager';
import { AnalyticsView } from '@/components/admin/AnalyticsView';

const Admin = () => {
  return (
    <AdminLayout>
      <Routes>
        <Route index element={<AdminDashboard />} />
        <Route path="content" element={<MultilingualContentManager />} />
        <Route path="categories" element={<CategoriesManager />} />
        <Route path="users" element={<UsersManager />} />
        <Route path="media" element={<MediaManager />} />
        <Route path="settings" element={<SiteSettingsManager />} />
        <Route path="analytics" element={<AnalyticsView />} />
      </Routes>
    </AdminLayout>
  );
};

export default Admin;
