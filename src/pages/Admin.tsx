
import { Routes, Route } from 'react-router-dom';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { MultilingualContentManager } from '@/components/admin/MultilingualContentManager';
import { CategoriesManager } from '@/components/admin/CategoriesManager';
import { UsersManager } from '@/components/admin/UsersManager';
import { MediaManager } from '@/components/admin/MediaManager';
import { BackgroundImagesManager } from '@/components/admin/BackgroundImagesManager';
import { SiteSettingsManager } from '@/components/admin/SiteSettingsManager';
import { AnalyticsView } from '@/components/admin/AnalyticsView';
import ProductsManager from '@/components/admin/ProductsManager';
import OrdersManager from '@/components/admin/OrdersManager';
import OrderDetailsView from '@/components/admin/OrderDetailsView';

const Admin = () => {
  return (
    <AdminLayout>
      <Routes>
        <Route index element={<AdminDashboard />} />
        <Route path="content" element={<MultilingualContentManager />} />
        <Route path="categories" element={<CategoriesManager />} />
        <Route path="products" element={<ProductsManager />} />
        <Route path="orders" element={<OrdersManager />} />
        <Route path="orders/:id" element={<OrderDetailsView />} />
        <Route path="users" element={<UsersManager />} />
        <Route path="media" element={<MediaManager />} />
        <Route path="background-images" element={<BackgroundImagesManager />} />
        <Route path="settings" element={<SiteSettingsManager />} />
        <Route path="analytics" element={<AnalyticsView />} />
      </Routes>
    </AdminLayout>
  );
};

export default Admin;
