import { createBrowserRouter, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Checkout from './pages/Checkout';
import AdminLogin from './pages/admin/Login';
import AdminPedidos from './pages/admin/Pedidos';
import AdminPedidoDetalle from './pages/admin/PedidoDetalle';
import AdminProductos from './pages/admin/Productos';
import AdminProductoForm from './pages/admin/ProductoForm';
import AdminCupones from './pages/admin/Cupones';
import AdminZonas from './pages/admin/Zonas';
import AdminReportes from './pages/admin/Reportes';
import AdminLayout from './components/admin/AdminLayout';
import ProtectedRoute from './components/admin/ProtectedRoute';

function adminRoute(element) {
  return (
    <ProtectedRoute>
      <AdminLayout>{element}</AdminLayout>
    </ProtectedRoute>
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
  { path: '/admin/login', element: <AdminLogin /> },
  { path: '/admin/pedidos', element: adminRoute(<AdminPedidos />) },
  { path: '/admin/pedidos/:codigo', element: adminRoute(<AdminPedidoDetalle />) },
  { path: '/admin/productos', element: adminRoute(<AdminProductos />) },
  { path: '/admin/productos/:id', element: adminRoute(<AdminProductoForm />) },
  { path: '/admin/cupones', element: adminRoute(<AdminCupones />) },
  { path: '/admin/zonas', element: adminRoute(<AdminZonas />) },
  { path: '/admin/reportes', element: adminRoute(<AdminReportes />) },
]);

export default router;
