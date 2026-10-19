import { createBrowserRouter } from 'react-router-dom';
import { AppLayout } from '@/components/layout/app-layout';
import { AdminLayout } from '@/components/layout/admin-layout';
import { HomePage } from '@/pages/home-page';
import { ProductsPage } from '@/pages/products-page';
import { CategoriesPage } from '@/pages/categories-page';
import { ProductDetailPage } from '@/pages/product-detail-page';
import { LoginPage } from '@/pages/login-page';
import { RegisterPage } from '@/pages/register-page';
import { ProfilePage } from '@/pages/profile-page';
import { AdminDashboardPage } from '@/pages/admin-dashboard-page';
import { AdminProductsPage } from '@/pages/admin-products-page';
import { AdminCategoriesPage } from '@/pages/admin-categories-page';
import { AdminUsersPage } from '@/pages/admin-users-page';
import { AdminRolesPage } from '@/pages/admin-roles-page';
import { NotFoundPage } from '@/pages/not-found-page';
import { ProtectedRoute, AdminRoute } from './guards';

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/products', element: <ProductsPage /> },
      { path: '/categories', element: <CategoriesPage /> },
      { path: '/products/:id', element: <ProductDetailPage /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
      {
        element: <ProtectedRoute />,
        children: [{ path: 'profile', element: <ProfilePage /> }],
      },
    ],
  },
  {
    element: <AdminRoute />,
    children: [
      {
        path: '/admin',
        element: <AdminLayout />,
        children: [
          { index: true, element: <AdminDashboardPage /> },
          { path: 'products', element: <AdminProductsPage /> },
          { path: 'categories', element: <AdminCategoriesPage /> },
          { path: 'users', element: <AdminUsersPage /> },
          { path: 'roles', element: <AdminRolesPage /> },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);