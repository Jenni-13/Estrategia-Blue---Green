import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ConductorLogin } from './auth/ConductorLogin';
import { ConductorRegistro } from './auth/ConductorRegistro';

export default function DriverAuthPage() {
  const { driver, driverSession, logoutDriver } = useAuth();
  const [view, setView] = useState('login');

  return (
    <div className="page container">
      <div className="app-header"><div className="brand"><h1>Conductor</h1></div></div>

      <div className="card">
        {driver ? (
          <div>
            <div>Sesión activa: {driver?.nombreCompleto || driver?.email}</div>
            <div style={{ color: 'var(--color-muted)', fontSize: 12 }}>Conectado</div>
            <button className="btn" onClick={logoutDriver}>Cerrar sesión</button>
          </div>
        ) : (
          <div>No hay sesión de conductor</div>
        )}
      </div>

      <div style={{ display: 'flex', gap: 24 }}>
        {view === 'registro' ? (
          <ConductorRegistro goToLogin={() => setView('login')} />
        ) : (
          <ConductorLogin goToRegistro={() => setView('registro')} />
        )}
      </div>
    </div>
  );
}