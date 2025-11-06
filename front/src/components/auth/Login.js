import React from 'react';
import './style/auth.css';

import { useAuth } from '../../context/AuthContext';

export function Login({ onLogin, goToRegistro }) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const { loginUser } = useAuth();

  const entrar = async () => {
    setError('');
    if (!email || !password) { setError('Completa correo y contraseña.'); return; }
    try {
      const res = await loginUser(email, password);
      onLogin?.(res);
    } catch (e) {
      setError(e.message || 'Fallo de red o servidor.');
    }
  };

  return (
    <div className="card">
      <h2 className="section-title">Iniciar sesión</h2>
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
      </div>
      <button className="link-btn" onClick={goToRegistro}>Crear cuenta</button>
    </div>
  );
}