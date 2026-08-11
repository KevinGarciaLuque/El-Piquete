import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/logo.webp';

const TABS = [
  { to: '/admin/pedidos', label: 'Pedidos' },
  { to: '/admin/productos', label: 'Productos' },
  { to: '/admin/cupones', label: 'Cupones' },
  { to: '/admin/zonas', label: 'Zonas de entrega' },
  { to: '/admin/reportes', label: 'Reportes' },
  { to: '/admin/usuarios', label: 'Usuarios' },
  { to: '/admin/opiniones', label: 'Opiniones' },
];

export default function AdminLayout({ children }) {
  const { admin, logout } = useAuth();

  return (
    <div className="min-h-screen bg-cream">
      <header className="border-b border-olive/15 bg-white/70">
        <div className="flex items-center justify-between px-4 py-3 sm:px-6">
          <Link to="/admin/pedidos" className="flex items-center gap-2">
            <img src={logo} alt="Encurtidos El Piquete" className="h-9 w-9 rounded-full object-cover" />
            <span className="font-display text-lg font-semibold text-navy">Panel admin</span>
          </Link>
          <div className="flex items-center gap-3 text-sm">
            <span className="hidden text-ink/60 sm:inline">{admin?.correo}</span>
            <button type="button" onClick={logout} className="font-medium text-chili hover:text-chili/80">
              Cerrar sesión
            </button>
          </div>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-4 pb-2 sm:px-6">
          {TABS.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              className={({ isActive }) =>
                `whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                  isActive ? 'bg-olive-dark text-cream' : 'text-ink/60 hover:bg-olive/10'
                }`
              }
            >
              {tab.label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
