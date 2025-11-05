import React from 'react';

export function GenerarPuntoViaje({ onGenerar }) {
  const [puntoSalida, setPuntoSalida] = React.useState('');
  const [plazas, setPlazas] = React.useState('1');

  const publicar = () => {
    onGenerar?.({ puntoSalida, plazas });
    setPuntoSalida('');
    setPlazas('1');
  };

  return (
    <div className="card">
      <h2 className="section-title">Generar un punto de viaje</h2>
      <div style={{ display: 'grid', gap: 10 }}>
        <div className="input-wrap">
          <label className="input-label">🧭 Punto de salida</label>
          <input
            className="auth-input"
            placeholder="Ej. Mercado Central"
            value={puntoSalida}
            onChange={(e) => setPuntoSalida(e.target.value)}
          />
        </div>
        <div className="input-wrap">
          <label className="input-label">👥 Plazas</label>
          <input
            className="auth-input"
            type="number"
            min="1"
            max="6"
            value={plazas}
            onChange={(e) => setPlazas(e.target.value)}
          />
        </div>
        <button className="auth-btn" onClick={publicar}>Publicar punto</button>
        <p style={{ fontSize: 12, color: 'var(--color-muted)' }}>
          Los clientes podrán reservar desde este punto y elegir su destino.
        </p>
      </div>
    </div>
  );
}