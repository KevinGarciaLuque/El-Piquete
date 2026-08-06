import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Checkout from './pages/Checkout';
import ProtectedRoute from './components/admin/ProtectedRoute';

const AdminLogin = lazy(() => import('./pages/admin/Login'));
const AdminPedidos = lazy(() => import('./pages/admin/Pedidos'));
const AdminPedidoDetalle = lazy(() => import('./pages/admin/PedidoDetalle'));
const AdminProductos = lazy(() => import('./pages/admin/Productos'));
const AdminProductoForm = lazy(() => import('./pages/admin/ProductoForm'));
const AdminCupones = lazy(() => import('./pages/admin/Cupones'));
const AdminZonas = lazy(() => import('./pages/admin/Zonas'));
const AdminReportes = lazy(() => import('./pages/admin/Reportes'));
const AdminLayout = lazy(() => import('./components/admin/AdminLayout'));

function Cargando() {
  return <p className="p-8 text-sm text-ink/60">Cargando…</p>;
}

function adminRoute(element) {
  return (
    <Suspense fallback={<Cargando />}>
      <ProtectedRoute>
        <AdminLayout>{element}</AdminLayout>
      </ProtectedRoute>
    </Suspense>
  );
}

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
  { path: '/admin', element: <Navigate to="/admin/pedidos" replace /> },
  {
    path: '/admin/login',
    element: (
      <Suspense fallback={<Cargando />}>
        <AdminLogin />
      </Suspense>
    ),
  },
  { path: '/admin/pedidos', element: adminRoute(<AdminPedidos />) },
  { path: '/admin/pedidos/:codigo', element: adminRoute(<AdminPedidoDetalle />) },
  { path: '/admin/productos', element: adminRoute(<AdminProductos />) },
  { path: '/admin/productos/:id', element: adminRoute(<AdminProductoForm />) },
  { path: '/admin/cupones', element: adminRoute(<AdminCupones />) },
  { path: '/admin/zonas', element: adminRoute(<AdminZonas />) },
  { path: '/admin/reportes', element: adminRoute(<AdminReportes />) },
]);

export default router;
