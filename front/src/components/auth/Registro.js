import React from 'react';
import './style/auth.css';

export function Registro({ onRegistro, goToLogin }) {
  const [nombre, setNombre] = React.useState('');
  const [apellidos, setApellidos] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [telefono, setTelefono] = React.useState('');
  const [fechaNac, setFechaNac] = React.useState('');
  const [error, setError] = React.useState('');
  const [password, setPassword] = React.useState('');

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
      const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:4000';
      console.log('[Registro] API_BASE:', API_BASE);
      const payload = {
        email,
        password,
        nombre,
        apellidos,
        telefono,
        fechaNacimiento: fechaNac,
      };
      console.log('[Registro] Enviando payload:', payload);

      const resp = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      console.log('[Registro] Status:', resp.status);
      const json = await resp.json();
      console.log('[Registro] Respuesta JSON:', json);

      if (!resp.ok) {
        setError(json.error || 'Error al registrar.');
        return;
      }
      onRegistro?.({
        nombre,
        apellidos,
        email,
        telefono,
        fechaNacimiento: fechaNac,
      });
      goToLogin?.();
    } catch (e) {
      console.error('[Registro] Fetch error:', e);
      setError('Fallo de red o servidor.');
    }
  };

  return (
    <div className="auth-card">
      <h2 className="auth-title">Crear cuenta</h2>
      <div className="auth-form">
        <div className="input-wrap">
          <label className="input-label">Nombre(s)</label>
          <input
            className="auth-input"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Tu nombre"
          />
        </div>
        <div className="input-wrap">
          <label className="input-label">Apellidos</label>
          <input
            className="auth-input"
            value={apellidos}
            onChange={(e) => setApellidos(e.target.value)}
            placeholder="Tus apellidos"
          />
        </div>
        <div className="input-wrap">
          <label className="input-label">Correo</label>
          <input
            className="auth-input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@correo.com"
          />
        </div>
        <div className="input-wrap">
          <label className="input-label">Número de teléfono</label>
          <input
            className="auth-input"
            type="tel"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            placeholder="+34 600 000 000"
          />
        </div>
        <div className="input-wrap">
          <label className="input-label">Fecha de nacimiento</label>
          <input
            className="auth-input"
            type="date"
            value={fechaNac}
            onChange={(e) => setFechaNac(e.target.value)}
          />
        </div>
        <div className="input-wrap">
          <label className="input-label">Contraseña</label>
          <input
            className="auth-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="********"
          />
        </div>
        <button className="auth-btn" onClick={crear}>Registrarme</button>
        {error && <div style={{ color: '#dc2626', fontSize: 12 }}>{error}</div>}
      </div>
      <button className="link-btn" onClick={goToLogin}>Ya tengo cuenta</button>
    </div>
  );
}