
import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { ContentManager } from '@/components/admin/ContentManager';
import { CategoriesManager } from '@/components/admin/CategoriesManager';
import { UsersManager } from '@/components/admin/UsersManager';
import { SiteSettingsManager } from '@/components/admin/SiteSettingsManager';
import { AnalyticsView } from '@/components/admin/AnalyticsView';
import { MediaManager } from '@/components/admin/MediaManager';

const Admin = () => {
  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<AdminDashboard />} />
        <Route path="/content" element={<ContentManager />} />
        <Route path="/categories" element={<CategoriesManager />} />
        <Route path="/users" element={<UsersManager />} />
        <Route path="/settings" element={<SiteSettingsManager />} />
        <Route path="/analytics" element={<AnalyticsView />} />
        <Route path="/media" element={<MediaManager />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </AdminLayout>
  );
};

export default Admin;
