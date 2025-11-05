import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import { supabase, supabaseAdmin } from '../supabaseClient.js';

const app = express();
const PORT = 4000; // puerto fijo para el backend

app.use(cors({ origin: ['http://localhost:3000', 'http://localhost:3001'] }));
app.use(express.json());

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// API: /auth/register
app.post('/auth/register', async (req, res) => {
  try {
    const { email, password, nombre, apellidos, telefono, fechaNacimiento } = req.body;
    if (!email || !password || !nombre || !apellidos || !telefono || !fechaNacimiento) {
      return res.status(400).json({ error: 'Faltan campos.' });
    }
    if (typeof password !== 'string' || password.length < 8) {
      return res.status(400).json({ error: 'La contraseña debe tener al menos 8 caracteres.' });
    }

    let userId;

    if (supabaseAdmin) {
      const { data: adminData, error: adminError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirmed: true,
      });
      if (adminError) {
        return res.status(400).json({ error: adminError.message });
      }
      userId = adminData.user?.id;
    } else {
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({ email, password });
      if (signUpError) {
        return res.status(400).json({ error: signUpError.message });
      }
      userId = signUpData.user?.id;
    }

    if (!userId) {
      return res.status(500).json({ error: 'No se obtuvo el ID de usuario.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const client = supabaseAdmin ?? supabase;
    const { error: insertError } = await client
      .from('usuarios')
      .insert({
        id: userId,
        email,
        nombre,
        apellidos,
        telefono,
        fecha_nacimiento: fechaNacimiento,
        password_hash: passwordHash,
      });

    if (insertError) {
      return res.status(500).json({ error: `Perfil: ${insertError.message}` });
    }

    return res.status(201).json({
      user: { id: userId, email },
      profile: { nombre, apellidos, telefono, fechaNacimiento },
    });
  } catch (_e) {
    return res.status(500).json({ error: 'Error interno de servidor.' });
  }
});

// API: /auth/login (sin Supabase Auth)
app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email y contraseña requeridos.' });

    const client = supabaseAdmin ?? supabase;
    const { data: userRow, error: userError } = await client
      .from('usuarios')
      .select('id, email, password_hash, nombre, apellidos, telefono, fecha_nacimiento')
      .eq('email', email)
      .single();

    if (userError || !userRow) {
      return res.status(401).json({ error: 'Credenciales inválidas.' });
    }

    const valid = await bcrypt.compare(password, userRow.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Credenciales inválidas.' });
    }

    return res.status(200).json({
      user: { id: userRow.id, email: userRow.email },
      profile: {
        nombre: userRow.nombre,
        apellidos: userRow.apellidos,
        telefono: userRow.telefono,
        fechaNacimiento: userRow.fecha_nacimiento,
      },
      session: null,
    });
  } catch (_e) {
    return res.status(500).json({ error: 'Error interno de servidor.' });
  }
});

// API: /conductor/register
app.post('/conductor/register', async (req, res) => {
  try {
    const { nombreCompleto, telefono, email, fechaNacimiento, password } = req.body;
    if (!nombreCompleto || !telefono || !email || !fechaNacimiento || !password) {
      return res.status(400).json({ error: 'Faltan campos.' });
    }
    if (typeof password !== 'string' || password.length < 8) {
      return res.status(400).json({ error: 'La contraseña debe tener al menos 8 caracteres.' });
    }

    let userId;
    if (supabaseAdmin) {
      const { data: adminData, error: adminError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirmed: true,
      });
      if (adminError) {
        return res.status(400).json({ error: adminError.message });
      }
      userId = adminData.user?.id;
    } else {
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({ email, password });
      if (signUpError) {
        return res.status(400).json({ error: signUpError.message });
      }
      userId = signUpData.user?.id;
    }

    if (!userId) {
      return res.status(500).json({ error: 'No se obtuvo el ID de usuario.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const client = supabaseAdmin ?? supabase;
    const { error: insertError } = await client
      .from('conductores')
      .insert({
        id: userId,
        nombre_completo: nombreCompleto,
        telefono,
        email,
        fecha_nacimiento: fechaNacimiento,
        password_hash: passwordHash,
      });

    if (insertError) {
      return res.status(500).json({ error: `Perfil: ${insertError.message}` });
    }

    return res.status(201).json({
      user: { id: userId, email },
      profile: { nombreCompleto, telefono, fechaNacimiento },
    });
  } catch (_e) {
    return res.status(500).json({ error: 'Error interno de servidor.' });
  }
});

// API: /conductor/login
app.post('/conductor/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email y contraseña requeridos.' });

    const client = supabaseAdmin ?? supabase;
    const { data: row, error } = await client
      .from('conductores')
      .select('id, email, password_hash, nombre_completo, telefono, fecha_nacimiento')
      .eq('email', email)
      .single();

    if (error || !row) {
      return res.status(401).json({ error: 'Credenciales inválidas.' });
    }

    const valid = await bcrypt.compare(password, row.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Credenciales inválidas.' });
    }

    return res.status(200).json({
      user: { id: row.id, email: row.email },
      profile: {
        nombreCompleto: row.nombre_completo,
        telefono: row.telefono,
        fechaNacimiento: row.fecha_nacimiento,
      },
      session: null,
    });
  } catch (_e) {
    return res.status(500).json({ error: 'Error interno de servidor.' });
  }
});

// Nuevo: crear punto de viaje (sin tarifa)
app.post('/puntos', async (req, res) => {
  try {
    const { conductorId, puntoSalida, plazas, conductorNombre, car, licensePlate, rating } = req.body;
    if (!conductorId || !puntoSalida || !plazas) {
      return res.status(400).json({ error: 'Faltan campos.' });
    }

    const client = supabaseAdmin ?? supabase;

    // Si no llega el nombre, lo obtenemos de la tabla conductores
    let nombre = conductorNombre;
    if (!nombre) {
      const { data: cRow, error: cErr } = await client
        .from('conductores')
        .select('nombre_completo')
        .eq('id', conductorId)
        .single();
      if (cErr || !cRow) {
        return res.status(400).json({ error: 'Conductor no encontrado.' });
      }
      nombre = cRow.nombre_completo;
    }

    // Valores automáticos (aleatorios) si no llegan
    const cars = ['Sedán', 'SUV', 'Hatchback', 'Pickup', 'Van'];
    const randomCar = car ?? cars[Math.floor(Math.random() * cars.length)];
    const rndPlate = licensePlate ?? `ABC-${String(Math.floor(1000 + Math.random() * 9000))}`;
    const rndRating = rating ?? Number((3.5 + Math.random() * 1.5).toFixed(1)); // 3.5–5.0

    const { data, error } = await client
      .from('puntos_viaje')
      .insert({
        conductor_id: conductorId,
        conductor_nombre: nombre,
        punto_salida: puntoSalida,
        plazas: parseInt(plazas, 10),
        car: randomCar,
        license_plate: rndPlate,
        rating: rndRating,
      })
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(201).json(data);
  } catch (_e) {
    return res.status(500).json({ error: 'Error interno de servidor.' });
  }
});

// Nuevo: listar viajes disponibles (puntos publicados)
app.get('/viajes/disponibles', async (_req, res) => {
  try {
    const client = supabaseAdmin ?? supabase;
    const { data, error } = await client
      .from('puntos_viaje')
      .select('id, conductor_nombre, punto_salida, plazas, created_at, car, license_plate, rating')
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    const mapped = (data ?? []).map((p) => ({
      id: p.id,
      from: p.punto_salida,
      to: 'A definir',
      date: (p.created_at || '').slice(0, 10),
      seats: p.plazas,
      driver: p.conductor_nombre,
      car: p.car,
      licensePlate: p.license_plate,
      rating: p.rating ?? 0,
    }));

    return res.json(mapped);
  } catch (_e) {
    return res.status(500).json({ error: 'Error interno de servidor.' });
  }
});

// Crear solicitud (cliente)
app.post('/solicitudes', async (req, res) => {
  try {
    const { clienteId, clienteEmail, origen, destino, pasajeros } = req.body;
    if (!clienteEmail || !origen || !destino || !pasajeros) {
      return res.status(400).json({ error: 'Faltan campos.' });
    }
    const client = supabaseAdmin ?? supabase;
    const { data, error } = await client
      .from('solicitudes_viaje')
      .insert({
        cliente_id: clienteId ?? null,
        cliente_email: clienteEmail,
        origen,
        destino,
        pasajeros: parseInt(pasajeros, 10),
        status: 'pendiente',
      })
      .select()
      .single();
    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json(data);
  } catch (_e) {
    return res.status(500).json({ error: 'Error interno de servidor.' });
  }
});

// Listar pendientes para conductor
app.get('/solicitudes/conductor/:conductorId', async (req, res) => {
  try {
    const { conductorId } = req.params;
    const client = supabaseAdmin ?? supabase;
    const { data, error } = await client
      .from('solicitudes_viaje')
      .select('*')
      .eq('status', 'pendiente')
      .order('created_at', { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    return res.json(data ?? []);
  } catch (_e) {
    return res.status(500).json({ error: 'Error interno de servidor.' });
  }
});

// Cotizar (conductor responde con precio y se marca como 'cotizada')
app.patch('/solicitudes/:id/cotizar', async (req, res) => {
  try {
    const { id } = req.params;
    const { conductorId, precio } = req.body;
    if (!conductorId || !precio) return res.status(400).json({ error: 'Faltan campos.' });
    const client = supabaseAdmin ?? supabase;
    const { data, error } = await client
      .from('solicitudes_viaje')
      .update({
        conductor_id: conductorId,
        precio: Number(precio),
        status: 'cotizada',
      })
      .eq('id', id)
      .select()
      .single();
    if (error) return res.status(500).json({ error: error.message });
    return res.json(data);
  } catch (_e) {
    return res.status(500).json({ error: 'Error interno de servidor.' });
  }
});

// Cambiar estado (cliente acepta o rechaza)
app.patch('/solicitudes/:id/estado', async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body; // 'aceptada' | 'rechazada'
    if (!['aceptada', 'rechazada'].includes(estado)) {
      return res.status(400).json({ error: 'Estado inválido.' });
    }
    const client = supabaseAdmin ?? supabase;
    const { data, error } = await client
      .from('solicitudes_viaje')
      .update({ status: estado })
      .eq('id', id)
      .select()
      .single();
    if (error) return res.status(500).json({ error: error.message });
    return res.json(data);
  } catch (_e) {
    return res.status(500).json({ error: 'Error interno de servidor.' });
  }
});

// Listar solicitudes del cliente (por email)
app.get('/solicitudes/cliente/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const client = supabaseAdmin ?? supabase;
    const { data, error } = await client
      .from('solicitudes_viaje')
      .select('*')
      .eq('cliente_email', email)
      .order('created_at', { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    return res.json(data ?? []);
  } catch (_e) {
    return res.status(500).json({ error: 'Error interno de servidor.' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend auth escuchando en http://localhost:${PORT}`);
});