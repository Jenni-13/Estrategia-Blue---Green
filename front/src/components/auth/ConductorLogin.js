import React from 'react';
import { useAuth } from '../../context/AuthContext';
import './style/auth.css';

export function ConductorLogin({ onLogin, goToRegistro }) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const { loginDriver } = useAuth();

  const entrar = async () => {
    setError('');
    if (!email || !password) { setError('Completa correo y contraseña.'); return; }
    try {
      const res = await loginDriver(email, password);
      onLogin?.(res);
    } catch (e) {
      setError(e.message || 'Error al iniciar sesión.');
    }
  };

  return (
    <div className="card">
      <h2 className="section-title">Iniciar sesión como conductor</h2>
      <div className="form-grid">
        <div className="input-wrap">
          <label className="input-label">Correo</label>
          <input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="tu@correo.com" />
        </div>
        <div className="input-wrap">
          <label className="input-label">Contraseña</label>
          <input className="input" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="********" />
        </div>
        <button className="btn btn-primary" onClick={entrar}>Entrar</button>
        {error && <div style={{ color: '#dc2626', fontSize: 12 }}>{error}</div>}
      </div>
      <button className="link-btn" onClick={goToRegistro}>Registrarte como conductor</button>
    </div>
  );
}