import React from 'react';
import './style/auth.css';
import { useAuth } from '../../context/AuthContext';

export function Registro({ onRegistro, goToLogin }) {
  const [nombre, setNombre] = React.useState('');
  const [apellidos, setApellidos] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [telefono, setTelefono] = React.useState('');
  const [fechaNac, setFechaNac] = React.useState('');
  const [error, setError] = React.useState('');
  const [password, setPassword] = React.useState('');
  const { registerUser } = useAuth();

  const crear = async () => {
    setError('');
    if (!nombre || !apellidos || !email || !telefono || !fechaNac || !password) {
      setError('Completa todos los campos.');
      return;
    }
    const emailOk = /\S+@\S+\.\S+/.test(email);
    const telOk = /^[0-9\s()+-]{7,}$/.test(telefono);
    if (!emailOk) { setError('Correo inválido.'); return; }
    if (!telOk) { setError('Teléfono inválido.'); return; }
    if (password.length < 8) { setError('La contraseña debe tener al menos 8 caracteres.'); return; }
    try {
      await registerUser({
        email,
        password,
        nombre,
        apellidos,
        telefono,
        fechaNacimiento: fechaNac,
      });
      onRegistro?.({ nombre, apellidos, email, telefono, fechaNacimiento: fechaNac });
      goToLogin?.();
    } catch (e) {
      setError(e.message || 'Fallo de red o servidor.');
    }
  };

  return (
    <div className="card">
      <h2 className="section-title">Crear cuenta</h2>
      <div className="form-grid">
        <div className="input-wrap">
          <label className="input-label">Nombre(s)</label>
          <input className="input" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Tu nombre" />
        </div>
        <div className="input-wrap">
          <label className="input-label">Apellidos</label>
          <input className="input" value={apellidos} onChange={(e) => setApellidos(e.target.value)} placeholder="Tus apellidos" />
        </div>
        <div className="input-wrap">
          <label className="input-label">Correo</label>
          <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@correo.com" />
        </div>
        <div className="input-wrap">
          <label className="input-label">Número de teléfono</label>
          <input className="input" type="tel" value={telefono} onChange={(e) => setTelefono(e.target.value)} placeholder="+34 600 000 000" />
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