import React from 'react';
import './style/auth.css';

export function ConductorLogin({ onLogin, goToRegistro }) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');

  const entrar = async () => {
    setError('');
    if (!email || !password) { setError('Completa correo y contraseña.'); return; }
    try {
      const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:4000';
      const resp = await fetch(`${API_BASE}/conductor/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const json = await resp.json();
      if (!resp.ok) {
        setError(json.error || 'Error al iniciar sesión.');
        return;
      }
      onLogin?.(json);
    } catch (e) {
      setError('Fallo de red o servidor.');
    }
  };

  return (
    <div className="auth-card">
      <h2 className="auth-title">Iniciar sesión como conductor</h2>
      <div className="auth-form">
        <div className="input-wrap">
          <label className="input-label">Correo</label>
          <input className="auth-input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="tu@correo.com" />
        </div>
        <div className="input-wrap">
          <label className="input-label">Contraseña</label>
          <input className="auth-input" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="********" />
        </div>
        <button className="auth-btn" onClick={entrar}>Entrar</button>
        {error && <div style={{ color: '#dc2626', fontSize: 12 }}>{error}</div>}
      </div>
      <button className="link-btn" onClick={goToRegistro}>Registrarte como conductor</button>
    </div>
  );
}