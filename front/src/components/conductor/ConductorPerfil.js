export function ConductorPerfil({ conductor }) {
  // Soporta dos formas:
  // - Nueva: { user: { email }, profile: { nombreCompleto, telefono, fechaNacimiento } }
  // - Antigua: { nombreCompleto, email, telefono, fechaNacimiento }
  const perfil = conductor?.profile ?? conductor;
  const email = conductor?.user?.email ?? conductor?.email ?? '—';

  return (
    <div className="card">
      <h2 className="section-title">Mi perfil (Conductor)</h2>
      <div style={{ display: 'grid', gap: 8 }}>
        <div><strong>Nombre completo:</strong> {perfil?.nombreCompleto ?? '—'}</div>
        <div><strong>Correo:</strong> {email}</div>
        <div><strong>Teléfono:</strong> {perfil?.telefono ?? '—'}</div>
        <div><strong>Fecha de nacimiento:</strong> {perfil?.fechaNacimiento ?? '—'}</div>
      </div>
    </div>
  );
}