import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Login } from './auth/Login';
import { Registro } from './auth/Registro';

export default function UserAuthPage() {
  const { user, userSession, logoutUser } = useAuth();
  const [view, setView] = useState('login');

  return (
    <div className="page container">
      <div className="app-header"><div className="brand"><h1>Usuario</h1></div></div>

      <div className="card">
        {user ? (
          <div>
            <div>Sesión activa: {user?.nombreCompleto || user?.email}</div>
            <div style={{ color: 'var(--color-muted)', fontSize: 12 }}>Conectado</div>
            <button className="btn" onClick={logoutUser}>Cerrar sesión</button>
          </div>
        ) : (
          <div>No hay sesión de usuario</div>
        )}
      </div>

      <div style={{ display: 'flex', gap: 24 }}>
        {view === 'registro' ? (
          <Registro goToLogin={() => setView('login')} />
        ) : (
          <Login goToRegistro={() => setView('registro')} />
        )}
      </div>
    </div>
  );
}