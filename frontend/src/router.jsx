import { createBrowserRouter, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Checkout from './pages/Checkout';
import AdminLogin from './pages/admin/Login';
import AdminPedidos from './pages/admin/Pedidos';
import AdminLayout from './components/admin/AdminLayout';
import ProtectedRoute from './components/admin/ProtectedRoute';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Layout>
        <Home />
      </Layout>
    ),
  },
  {
    path: '/checkout',
    element: (
      <Layout>
        <Checkout />
      </Layout>
    ),
  },
  {
    path: '/admin',
    element: <Navigate to="/admin/pedidos" replace />,
  },
  {
    path: '/admin/login',
    element: <AdminLogin />,
  },
  {
    path: '/admin/pedidos',
    element: (
      <ProtectedRoute>
        <AdminLayout>
          <AdminPedidos />
        </AdminLayout>
      </ProtectedRoute>
    ),
  },
]);

export default router;
