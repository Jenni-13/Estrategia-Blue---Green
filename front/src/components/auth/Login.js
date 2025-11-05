import React from 'react';
import './style/auth.css';

export function Login({ onLogin, goToRegistro }) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');

  const entrar = async () => {
    setError('');
    if (!email || !password) { setError('Completa correo y contraseña.'); return; }
    try {
      const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:4000';
      console.log('[Login] API_BASE:', API_BASE);
      const payload = { email, password };
      console.log('[Login] Enviando payload:', payload);

      const resp = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      console.log('[Login] Status:', resp.status);
      const json = await resp.json();
      console.log('[Login] Respuesta JSON:', json);

      if (!resp.ok) {
        setError(json.error || 'Error al iniciar sesión.');
        return;
      }
      onLogin?.(json);
    } catch (e) {
      console.error('[Login] Fetch error:', e);
      setError('Fallo de red o servidor.');
    }
  };

  return (
    <div className="auth-card">
      <h2 className="auth-title">Iniciar sesión</h2>
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
      </div>
      <button className="link-btn" onClick={goToRegistro}>Crear cuenta</button>
    </div>
  );
}