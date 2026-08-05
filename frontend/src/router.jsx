import { createBrowserRouter } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Checkout from './pages/Checkout';

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
]);

export default router;
