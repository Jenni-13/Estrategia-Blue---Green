import React from 'react';
import './style/auth.css';
import { useAuth } from '../../context/AuthContext';

export function ConductorRegistro({ onRegistro, goToLogin }) {
  const [nombreCompleto, setNombreCompleto] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [telefono, setTelefono] = React.useState('');
  const [fechaNac, setFechaNac] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const { registerDriver } = useAuth();

  const crear = async () => {
    setError('');
    if (!nombreCompleto || !email || !telefono || !fechaNac || !password) {
      setError('Completa todos los campos.');
      return;
    }
    try {
      await registerDriver({
        nombreCompleto,
        telefono,
        email,
        fechaNacimiento: fechaNac,
        password,
      });
      onRegistro?.({ nombreCompleto, telefono, fechaNacimiento: fechaNac });
      goToLogin?.();
    } catch (e) {
      setError(e.message || 'Error al registrar.');
    }
  };

  return (
    <div className="card">
      <h2 className="section-title">Registrarte como conductor</h2>
      <div className="form-grid">
        <div className="input-wrap">
          <label className="input-label">Nombre completo</label>
          <input className="input" value={nombreCompleto} onChange={(e) => setNombreCompleto(e.target.value)} placeholder="Tu nombre completo" />
        </div>
        <div className="input-wrap">
          <label className="input-label">Número de teléfono</label>
          <input className="input" type="tel" value={telefono} onChange={(e) => setTelefono(e.target.value)} placeholder="+34 600 000 000" />
        </div>
        <div className="input-wrap">
          <label className="input-label">Correo</label>
          <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@correo.com" />
        </div>
        <div className="input-wrap">
          <label className="input-label">Fecha de nacimiento</label>
          <input className="input" type="date" value={fechaNac} onChange={(e) => setFechaNac(e.target.value)} />
        </div>
        <div className="input-wrap">
          <label className="input-label">Contraseña</label>
          <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="********" />
        </div>
        <button className="btn btn-primary" onClick={crear}>Registrarme</button>
        {error && <div style={{ color: '#dc2626', fontSize: 12 }}>{error}</div>}
      </div>
      <button className="link-btn" onClick={goToLogin}>Ya tengo cuenta</button>
    </div>
  );
}