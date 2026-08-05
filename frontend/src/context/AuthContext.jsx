import { createContext, useContext, useMemo, useState } from 'react';
import { loginAdmin, TOKEN_KEY } from '../services/adminApi';

const AuthContext = createContext(null);

function decodificarToken(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 > Date.now() ? payload : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    return token ? decodificarToken(token) : null;
  });

  async function login(correo, password) {
    const { token, admin: datosAdmin } = await loginAdmin(correo, password);
    localStorage.setItem(TOKEN_KEY, token);
    setAdmin(datosAdmin);
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    setAdmin(null);
  }

  const value = useMemo(() => ({ admin, autenticado: Boolean(admin), login, logout }), [admin]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const contexto = useContext(AuthContext);
  if (!contexto) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return contexto;
}
