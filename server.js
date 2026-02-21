import { createServer } from 'http';
import { readFile } from 'fs/promises';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';
import mysql from 'mysql2/promise';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const DIST_DIR = join(__dirname, 'dist');
const PORT = process.env.PORT || 3001;

// MIME types para archivos estáticos
const MIME_TYPES = {
  '.html': 'text/html',
  '.js':   'text/javascript',
  '.css':  'text/css',
  '.json': 'application/json',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
  '.woff': 'font/woff',
  '.woff2':'font/woff2',
};

// Pool de conexiones MySQL — soporta DATABASE_* (Dokploy) y DB_* (local .env.local)
const DB_HOST = process.env.DATABASE_HOST || process.env.DB_HOST || 'capex-capexcentral-rvuban';
const DB_PORT = parseInt(process.env.DATABASE_PORT || process.env.DB_PORT || '3306');
const DB_USER = process.env.DATABASE_USER || process.env.DB_USER || 'mysql';
const DB_PASS = process.env.DATABASE_PASSWORD || process.env.DB_PASSWORD || '';
const DB_NAME = process.env.DATABASE_NAME || process.env.DB_NAME || 'CAPEXCENTRAL';

const pool = mysql.createPool({
  host:     DB_HOST,
  port:     DB_PORT,
  user:     DB_USER,
  password: DB_PASS,
  database: DB_NAME,
  charset:  'utf8mb4',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Verificar conexión al arrancar
try {
  const conn = await pool.getConnection();
  console.log('✅ MySQL conectado a', DB_HOST);
  console.log('   Base de datos:', DB_NAME);
  conn.release();
} catch (err) {
  console.error('❌ Error conectando a MySQL:', err.message);
}

// Leer body JSON de la request
function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try { resolve(JSON.parse(body)); }
      catch { reject(new Error('JSON inválido')); }
    });
    req.on('error', reject);
  });
}

// Servir archivos estáticos desde dist/
async function serveStatic(res, filePath) {
  try {
    const content = await readFile(filePath);
    const ext = extname(filePath);
    res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
    res.end(content);
  } catch {
    try {
      const index = await readFile(join(DIST_DIR, 'index.html'));
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(index);
    } catch {
      res.writeHead(404);
      res.end('Not Found');
    }
  }
}

const server = createServer(async (req, res) => {
  // Cabeceras CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // ─── POST /api/login ───────────────────────────────────────────────────────
  if (req.url === '/api/login' && req.method === 'POST') {
    try {
      const { email, password } = await readBody(req);

      if (!email || !password) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Email y contraseña son requeridos' }));
        return;
      }

      const [rows] = await pool.execute(
        `SELECT id, name, email, role, area, status
           FROM users
          WHERE email = ? AND password = ? AND status = 'ACTIVO'
          LIMIT 1`,
        [email.toLowerCase().trim(), password]
      );

      if (rows.length === 0) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Credenciales incorrectas o usuario inactivo' }));
        return;
      }

      const user = rows[0];
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, user }));

    } catch (err) {
      console.error('❌ Error en /api/login:', err.code, '-', err.message);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  // ─── GET /api/proyectos?macroproyecto=XXX ─────────────────────────────────
  if (req.url.startsWith('/api/proyectos') && req.method === 'GET') {
    try {
      const urlObj = new URL(req.url, `http://localhost`);
      const macroproyecto = urlObj.searchParams.get('macroproyecto');
      if (!macroproyecto) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'macroproyecto requerido' }));
        return;
      }
      const [rows] = await pool.execute(
        `SELECT PROYECTO, ID FROM T_P_MACRO_Y_PROYECTO
          WHERE MACROPROYECTO = ? AND PROYECTO IS NOT NULL AND PROYECTO <> ''
          ORDER BY PROYECTO`,
        [macroproyecto]
      );
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(rows.map(r => ({ proyecto: r.PROYECTO, idMacroproyecto: r.ID }))));
    } catch (err) {
      console.error('❌ Error en /api/proyectos:', err.message);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  // ─── GET /api/macroproyectos ───────────────────────────────────────────────
  if (req.url === '/api/macroproyectos' && req.method === 'GET') {
    try {
      const [rows] = await pool.execute(
        `SELECT DISTINCT MACROPROYECTO FROM T_P_MACRO_Y_PROYECTO
          WHERE MACROPROYECTO IS NOT NULL AND MACROPROYECTO <> ''
          ORDER BY MACROPROYECTO`
      );
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(rows.map(r => r.MACROPROYECTO)));
    } catch (err) {
      console.error('❌ Error en /api/macroproyectos:', err.message);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  // ─── Archivos estáticos (producción) ──────────────────────────────────────
  const urlPath = req.url.split('?')[0];
  const filePath = join(DIST_DIR, urlPath === '/' ? 'index.html' : urlPath);
  await serveStatic(res, filePath);
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Sophie API server corriendo en puerto ${PORT}`);
  console.log(`   DB Host: ${DB_HOST}`);
});
