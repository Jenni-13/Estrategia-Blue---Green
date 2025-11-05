import React from 'react';
import logo from './logo.svg';
import './App.css';

import { useViajes } from './hooks/useViajes';
import { BuscarFormulario } from './components/viajes/BuscarFormulario';
import { ListaViajes } from './components/viajes/ListaViajes';
import { ResumenCliente } from './components/cliente/ResumenCliente';
// Se elimina el import del PanelConductor
// import { PanelConductor } from './components/conductor/PanelConductor';
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

function App() {
  // Cliente/reserva: sólo búsqueda, listas y selección
  const {
    viajeSeleccionado,
    criterios,
    filtrarViajes,
    setCampoBusqueda,
    seleccionarViaje,
    cerrarDetalles,
    recargarViajes,
  } = useViajes();

  // Conductor: su propio estado y acciones
  const { agregarPuntoViaje } = useConductor();

  // Solicitudes (cliente ↔ conductor)
  const { crearSolicitudCliente } = useSolicitudes();

  // Estados para el flujo de Conductor (faltaban y causaban no-undef)
  const [conductor, setConductor] = React.useState(null);
  const [conductorAuthVista, setConductorAuthVista] = React.useState('login');

  const [vista, setVista] = React.useState('cliente'); // 'cliente' | 'conductor' | 'reserva' | 'perfil' | 'conductor-auth'
  const [menuAbierto, setMenuAbierto] = React.useState(false);
  const [usuario, setUsuario] = React.useState(null);
  const [authVista, setAuthVista] = React.useState('login');
  const [conductorSubVista, setConductorSubVista] = React.useState('perfil'); // 'perfil' | 'publicar' | 'punto'


  // Si no hay usuario autenticado, mostrar Login/Registro
  if (!usuario) {
    return (
      <div className="page">
        <div className="container">
          <header className="app-header">
            <div className="brand">
              <img src={logo} className="App-logo" alt="logo" style={{ height: 40 }} />
              <h1>Ast Viajes (Web)</h1>
            </div>
          </header>

          {authVista === 'login' ? (
            <Login
              onLogin={(data) =>
                setUsuario({
                  user: { id: data.user?.id, email: data.user?.email },
                  email: data.user?.email,
                  profile: data.profile,
                  nombre: data.profile?.nombre,
                  apellidos: data.profile?.apellidos,
                  telefono: data.profile?.telefono,
                  fechaNacimiento: data.profile?.fechaNacimiento,
                })
              }
              goToRegistro={() => setAuthVista('registro')}
            />
          ) : (
            <Registro
              onRegistro={(data) =>
                setUsuario({
                  nombre: data.nombre,
                  apellidos: data.apellidos,
                  email: data.email,
                  telefono: data.telefono,
                  fechaNacimiento: data.fechaNacimiento,
                })
              }
              goToLogin={() => setAuthVista('login')}
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container">
        <header className="app-header">
          <button
            className="hamburger"
            aria-label="Abrir menú"
            onClick={() => setMenuAbierto(true)}
          >
            ☰
          </button>
          <div className="brand">
            <img src={logo} className="App-logo" alt="logo" style={{ height: 40 }} />
            <h1>Ast Viajes (Web)</h1>
          </div>
          {/* Menú de pestañas eliminado */}
        </header>
        {/* Vista Perfil */}
        {vista === 'perfil' && (
          <main className="layout">
            <div className="card">
              <h2 className="section-title">Mi perfil</h2>
              <div style={{ display: 'grid', gap: 8 }}>
                <div><strong>Nombre:</strong> {usuario?.nombre ?? '—'}</div>
                <div><strong>Apellidos:</strong> {usuario?.apellidos ?? '—'}</div>
                <div><strong>Correo:</strong> {usuario?.email ?? '—'}</div>
                <div><strong>Teléfono:</strong> {usuario?.telefono ?? '—'}</div>
                <div><strong>Fecha de nacimiento:</strong> {usuario?.fechaNacimiento ?? '—'}</div>
              </div>
              {/* Entra al flujo de conductor (login/registro propio) */}
              <div style={{ marginTop: 12 }}>
                <button
                  className="drawer-item"
                  onClick={() => setVista('conductor-auth')}
                >
                  Conductor
                </button>
              </div>
            </div>
          </main>
        )}
        {/* Vista Conductor Auth */}
        {vista === 'conductor-auth' && !conductor && (
          <main className="layout">
            {conductorAuthVista === 'login' ? (
              <ConductorLogin
                onLogin={(data) => {
                  // data = { user: { id, email }, profile: { nombreCompleto, telefono, fechaNacimiento } }
                  setConductor(data);
                  setVista('conductor');
                }}
                goToRegistro={() => setConductorAuthVista('registro')}
              />
            ) : (
              <ConductorRegistro
                onRegistro={(data) => {
                  // Tras registro sugerimos ir a login para obtener user.id.
                  // Guardamos perfil por conveniencia (sin user.id todavía).
                  setConductor({ profile: {
                    nombreCompleto: data.nombreCompleto,
                    telefono: data.telefono,
                    fechaNacimiento: data.fechaNacimiento,
                  } });
                  setConductorAuthVista('login');
                  setVista('conductor-auth');
                }}
                goToLogin={() => setConductorAuthVista('login')}
              />
            )}
          </main>
        )}
        {/* Vista Cliente */}
        {vista === 'cliente' && (
          <main className="layout two-col">
            <section>
              <h2 className="section-title">Solicitar Viaje</h2>
              <BuscarFormulario
                criterios={criterios}
                setCampo={setCampoBusqueda}
                onSolicitar={async (c) => {
                  try {
                    await crearSolicitudCliente({
                      clienteId: usuario?.user?.id,
                      clienteEmail: usuario?.email,
                      origen: c.from,
                      destino: c.to,
                      pasajeros: c.pasajeros,
                    });
                    alert('Solicitud enviada al conductor.');
                  } catch (e) {
                    alert(e.message || 'No se pudo enviar la solicitud.');
                  }
                }}
              />
              <div style={{ marginTop: 16 }}>
                <h2 className="section-title">Viajes Disponibles</h2>
                <ListaViajes viajes={filtrarViajes} onSeleccionarViaje={seleccionarViaje} />
              </div>
            </section>
            <aside>
              <ResumenCliente />
            </aside>
          </main>
        )}

        {/* Vista Conductor */}
        {vista === 'conductor' && (
          <main className="layout">
            {conductorSubVista === 'perfil' && (
              <ConductorPerfil conductor={conductor} />
            )}
            {/* Se elimina la subvista 'publicar' (PanelConductor) */}
            {/* {conductorSubVista === 'publicar' && (
              <>
                <h2 className="section-title">Publicar un Viaje</h2>
                <PanelConductor
                  nuevoViaje={nuevoViaje}
                  setCampo={setCampoNuevoViaje}
                  onPublicar={agregarViaje}
                  onVerDetalles={seleccionarViaje}
                />
              </>
            )} */}
            {conductorSubVista === 'punto' && (
              <GenerarPuntoViaje
                onGenerar={async ({ puntoSalida, plazas }) => {
                  console.log('[GenerarPuntoViaje.onGenerar] submitting', {
                    puntoSalida,
                    plazas,
                    conductor,
                    vista,
                    conductorSubVista,
                  });
                  try {
                    const res = await agregarPuntoViaje({ puntoSalida, plazas, conductor });
                    console.log('[GenerarPuntoViaje.onGenerar] success:', res);
                    await recargarViajes();
                  } catch (e) {
                    console.error('[GenerarPuntoViaje.onGenerar] error:', e);
                    alert(e.message || 'No se pudo publicar el punto');
                  }
                }}
              />
            )}
            {conductorSubVista === 'requisitos' && (
              <RequisitosConductor />
            )}
          </main>
        )}

        {/* Vista Reserva (similar a Cliente, con Día y Hora) */}
        {vista === 'reserva' && (
          <main className="layout two-col">
            <section>
              <h2 className="section-title">Solicitar Reserva</h2>
              <BuscarReserva
                criterios={criterios}
                setCampo={setCampoBusqueda}
                onSolicitar={(c) => console.log('Solicitar reserva:', c)}
              />
              <div style={{ marginTop: 16 }}>
                <h2 className="section-title">Viajes Disponibles</h2>
                <ListaViajes viajes={filtrarViajes} onSeleccionarViaje={seleccionarViaje} />
              </div>
            </section>
            <aside>
              <ResumenReserva />
            </aside>
          </main>
        )}

        {viajeSeleccionado && (
          <div style={modalStyles.backdrop} onClick={cerrarDetalles}>
            <div style={modalStyles.modal} onClick={(e) => e.stopPropagation()}>
              <h3>Detalles del Viaje</h3>
              <p><strong>Ruta:</strong> {viajeSeleccionado.from} → {viajeSeleccionado.to}</p>
              <p><strong>Fecha:</strong> {viajeSeleccionado.date}</p>
              <p><strong>Precio:</strong> {viajeSeleccionado.price}€</p>
              <p><strong>Plazas:</strong> {viajeSeleccionado.seats}</p>
              <p><strong>Conductor:</strong> {viajeSeleccionado.driver}</p>
              <button onClick={cerrarDetalles} style={{ marginTop: 8, padding: '8px 12px' }}>Cerrar</button>
            </div>
          </div>
        )}
      </div>

      {/* Drawer lateral */}
      {menuAbierto && (
        <>
          <div className="drawer-backdrop" onClick={() => setMenuAbierto(false)} />
          {(vista === 'conductor') ? (
            <nav className="side-drawer" role="navigation">
              <h3 className="drawer-title">Menú Conductor</h3>
              <button
                className={`drawer-item ${conductorSubVista === 'perfil' ? 'active' : ''}`}
                onClick={() => { setConductorSubVista('perfil'); setMenuAbierto(false); }}
              >
                Mi perfil
              </button>
              {/* Opción 'Subir un viaje' eliminada */}
              <button
                className={`drawer-item ${conductorSubVista === 'punto' ? 'active' : ''}`}
                onClick={() => { setConductorSubVista('punto'); setMenuAbierto(false); }}
              >
                Generar un punto de viaje
              </button>
              <button
                className={`drawer-item ${conductorSubVista === 'requisitos' ? 'active' : ''}`}
                onClick={() => { setConductorSubVista('requisitos'); setMenuAbierto(false); }}
              >
                Requisitos
              </button>
            </nav>
          ) : (
            <nav className="side-drawer" role="navigation">
              <h3 className="drawer-title">Menú</h3>
              <button
                className={`drawer-item ${vista === 'perfil' ? 'active' : ''}`}
                onClick={() => { setVista('perfil'); setMenuAbierto(false); }}
              >
                Mi perfil
              </button>
              <button
                className={`drawer-item ${vista === 'cliente' ? 'active' : ''}`}
                onClick={() => { setVista('cliente'); setMenuAbierto(false); }}
              >
                Pide tu viaje
              </button>
              <button
                className={`drawer-item ${vista === 'reserva' ? 'active' : ''}`}
                onClick={() => { setVista('reserva'); setMenuAbierto(false); }}
              >
                Reserva tu viaje
              </button>
              <button
                className="drawer-item logout-btn"
                onClick={() => { setUsuario(null); setAuthVista('login'); setMenuAbierto(false); }}
                title={usuario?.email}
              >
                Cerrar sesión
              </button>
            </nav>
          )}
        </>
      )}
    </div>
  );
}

const modalStyles = {
  backdrop: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  modal: { background: '#fff', padding: 16, borderRadius: 8, minWidth: 320, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' },
};

export default App;
