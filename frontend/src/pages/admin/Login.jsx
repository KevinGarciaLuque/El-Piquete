import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { inputClass } from '../../components/checkout/Field';
import Button from '../../components/ui/Button';
import logo from '../../assets/logo.webp';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setEnviando(true);
    setError('');

    try {
      await login(correo, password);
      navigate(location.state?.desde || '/admin/pedidos', { replace: true });
    } catch {
      setError('Correo o contraseña incorrectos');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-4">
      <form onSubmit={handleSubmit} className="flex w-full max-w-sm flex-col gap-4 rounded-2xl border border-olive/15 bg-white/70 p-8 shadow-sm">
        <img src={logo} alt="Encurtidos El Piquete" className="mx-auto h-16 w-16 rounded-full object-cover" />
        <h1 className="text-center font-display text-2xl font-semibold text-navy">Panel administrativo</h1>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-navy">Correo</span>
          <input type="email" required value={correo} onChange={(e) => setCorreo(e.target.value)} className={inputClass} />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-navy">Contraseña</span>
          <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} />
        </label>

        {error && <p className="text-sm text-chili">{error}</p>}

        <Button type="submit" variant="primary" disabled={enviando} className="justify-center">
          {enviando ? 'Ingresando…' : 'Ingresar'}
        </Button>
      </form>
    </div>
  );
}
