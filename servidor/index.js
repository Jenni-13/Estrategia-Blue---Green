import { supabase } from './supabaseClient.js';
import http from 'http';

const PORT = process.env.PORT ?? 3000;

const server = http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok' }));
    return;
  }
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Servidor activo');
});

server.listen(PORT, () => {
  console.log(`Servidor prendido en http://localhost:${PORT}`);
});

async function main() {
  console.log('Cliente de Supabase inicializado.');

  // Ejemplo: listar 1 fila de una tabla (cámbiala por una tuya para probar).
  // const { data, error } = await supabase.from('tu_tabla').select('*').limit(1);
  // if (error) console.error('Error consultando Supabase:', error.message);
  // else console.log('Datos:', data);

  console.log('Listo. Configura tu tabla y descomenta el ejemplo para probar.');
}

main().catch((e) => {
  console.error('Fallo en servidor:', e);
});