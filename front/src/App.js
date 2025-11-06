import React from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import UserAuthPage from './components/UserAuthPage';
import DriverAuthPage from './components/DriverAuthPage';
import ViajesPage from './components/ViajesPage';
import SolicitudesPage from './components/SolicitudesPage';
import './App.css';

import { BuscarFormulario } from './components/viajes/BuscarFormulario';
import { ListaViajes } from './components/viajes/ListaViajes';
import { ResumenCliente } from './components/cliente/ResumenCliente';
import { useViajes } from './hooks/useViajes';
import { BuscarReserva } from './components/reserva/BuscarReserva';
import { ResumenReserva } from './components/reserva/ResumenReserva';
import { Login } from './components/auth/Login';
import { Registro } from './components/auth/Registro';
import { ConductorLogin } from './components/auth/ConductorLogin';
import { ConductorRegistro } from './components/auth/ConductorRegistro';
// imports (sección superior del archivo)
import { ConductorPerfil } from './components/conductor/ConductorPerfil';
import { GenerarPuntoViaje } from './components/conductor/GenerarPuntoViaje';
import { useConductor } from './hooks/useConductor';
import { RequisitosConductor } from './components/conductor/RequisitosConductor';
import { useSolicitudes } from './hooks/useSolicitudes';
import BuscarPage from './components/BuscarPage';
import MisViajesPage from './components/MisViajesPage';
import MisSolicitudesPage from './components/MisSolicitudesPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <nav style={{ display: 'flex', gap: 12, padding: 12 }}>
          <Link to="/">Buscar</Link>
          <Link to="/usuario">Usuario</Link>
          <Link to="/conductor">Conductor</Link>
          <Link to="/viajes">Viajes</Link>
          <Link to="/solicitudes">Solicitudes</Link>
          <Link to="/mis-viajes">Mis Viajes</Link>
          <Link to="/mis-solicitudes">Mis Solicitudes</Link>
        </nav>
        <Routes>
          <Route path="/" element={<BuscarPage />} />
          <Route path="/usuario" element={<UserAuthPage />} />
          <Route path="/conductor" element={<DriverAuthPage />} />
          <Route path="/viajes" element={<ViajesPage />} />
          <Route path="/solicitudes" element={<SolicitudesPage />} />
          <Route path="/mis-viajes" element={<MisViajesPage />} />
          <Route path="/mis-solicitudes" element={<MisSolicitudesPage />} />
        </Routes>
        <BottomNav />
      </BrowserRouter>
    </AuthProvider>
  );
}

function BottomNav() {
  const location = useLocation();
  const path = location.pathname;
  const is = (p) => (path === p ? 'active' : '');
  return (
    <div className="bottom-nav">
      <div className="nav-inner">
        <Link to="/" className={`nav-btn ${is('/')}`}>Buscar</Link>
        <Link to="/mis-viajes" className={`nav-btn ${is('/mis-viajes')}`}>Mis Viajes</Link>
        <Link to="/mis-solicitudes" className={`nav-btn ${is('/mis-solicitudes')}`}>Mis Solicitudes</Link>
      </div>
    </div>
  );
}

export default App;
