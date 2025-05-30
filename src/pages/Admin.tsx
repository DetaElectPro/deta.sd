
import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { ArticlesManager } from '@/components/admin/ArticlesManager';
import { SiteSettingsManager } from '@/components/admin/SiteSettingsManager';
import { AnalyticsView } from '@/components/admin/AnalyticsView';
import { MediaManager } from '@/components/admin/MediaManager';

const Admin = () => {
  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<AdminDashboard />} />
        <Route path="/articles" element={<ArticlesManager />} />
        <Route path="/settings" element={<SiteSettingsManager />} />
        <Route path="/analytics" element={<AnalyticsView />} />
        <Route path="/media" element={<MediaManager />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </AdminLayout>
  );
};

export default Admin;
