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

// Pool de conexiones MySQL — configura las variables de entorno en .env.local (dev) o en Dokploy (prod)
const pool = mysql.createPool({
  host:     process.env.DB_HOST     || 'capex-bdcapex-vlcasp',
  port:     parseInt(process.env.DB_PORT || '3306'),
  user:     process.env.DB_USER     || 'mysql',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME     || 'CAPEXCENTRAL',
  charset:  'utf8mb4',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Verificar conexión al arrancar
try {
  const conn = await pool.getConnection();
  console.log('✅ MySQL conectado a', process.env.DB_HOST || 'capex-bdcapex-vlcasp');
  console.log('   Base de datos:', process.env.DB_NAME || 'CAPEXCENTRAL');
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

  // ─── Archivos estáticos (producción) ──────────────────────────────────────
  const urlPath = req.url.split('?')[0];
  const filePath = join(DIST_DIR, urlPath === '/' ? 'index.html' : urlPath);
  await serveStatic(res, filePath);
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Sophie API server corriendo en puerto ${PORT}`);
  console.log(`   DB Host: ${process.env.DB_HOST || 'capex-bdcapex-vlcasp'}`);
});
