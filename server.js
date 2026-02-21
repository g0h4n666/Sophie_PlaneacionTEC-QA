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

  // ─── GET /api/rubros ──────────────────────────────────────────────────────
  if (req.url === '/api/rubros' && req.method === 'GET') {
    try {
      const [rows] = await pool.execute(
        `SELECT DISTINCT RUBRO FROM T_P_POSPRE
          WHERE RUBRO IS NOT NULL AND RUBRO <> ''
          ORDER BY RUBRO`
      );
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(rows.map(r => r.RUBRO)));
    } catch (err) {
      console.error('❌ Error en /api/rubros:', err.message);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  // ─── GET /api/pospre?rubro=XXX ────────────────────────────────────────────
  if (req.url.startsWith('/api/pospre') && req.method === 'GET') {
    try {
      const urlObj = new URL(req.url, 'http://localhost');
      const rubro = urlObj.searchParams.get('rubro');
      if (!rubro) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'rubro requerido' }));
        return;
      }
      const [rows] = await pool.execute(
        `SELECT SUBRUBRO, CHAR_POSPRE, METRICA FROM T_P_POSPRE
          WHERE RUBRO = ? AND SUBRUBRO IS NOT NULL AND SUBRUBRO <> ''
          ORDER BY SUBRUBRO`,
        [rubro]
      );
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(rows.map(r => ({
        subrubro:   r.SUBRUBRO,
        charPospre: r.CHAR_POSPRE,
        metrica:    r.METRICA
      }))));
    } catch (err) {
      console.error('❌ Error en /api/pospre:', err.message);
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

  // ─── GET /api/directores-corp ─────────────────────────────────────────────
  if (req.url === '/api/directores-corp' && req.method === 'GET') {
    try {
      const [rows] = await pool.execute(
        `SELECT DISTINCT CHAR_DIR_CORP FROM T_M_ORGANIGRAMA
          WHERE CHAR_DIR_CORP IS NOT NULL AND CHAR_DIR_CORP <> ''
          ORDER BY CHAR_DIR_CORP`
      );
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(rows.map(r => r.CHAR_DIR_CORP)));
    } catch (err) {
      console.error('❌ Error en /api/directores-corp:', err.message);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  // ─── GET /api/directores-area?dirCorp=XXX ─────────────────────────────────
  if (req.url.startsWith('/api/directores-area') && req.method === 'GET') {
    try {
      const urlObj = new URL(req.url, 'http://localhost');
      const dirCorp = urlObj.searchParams.get('dirCorp');
      if (!dirCorp) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'dirCorp requerido' }));
        return;
      }
      const [rows] = await pool.execute(
        `SELECT DISTINCT CHAR_DIR_AREA FROM T_M_ORGANIGRAMA
          WHERE CHAR_DIR_CORP = ? AND CHAR_DIR_AREA IS NOT NULL AND CHAR_DIR_AREA <> ''
          ORDER BY CHAR_DIR_AREA`,
        [dirCorp]
      );
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(rows.map(r => r.CHAR_DIR_AREA)));
    } catch (err) {
      console.error('❌ Error en /api/directores-area:', err.message);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  // ─── GET /api/gerentes?dirArea=XXX ────────────────────────────────────────
  if (req.url.startsWith('/api/gerentes') && req.method === 'GET') {
    try {
      const urlObj = new URL(req.url, 'http://localhost');
      const dirArea = urlObj.searchParams.get('dirArea');
      if (!dirArea) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'dirArea requerido' }));
        return;
      }
      const dirCorp = urlObj.searchParams.get('dirCorp');
      const params = [dirArea];
      const dirCorpClause = dirCorp ? ' AND CHAR_DIR_CORP = ?' : '';
      if (dirCorp) params.push(dirCorp);
      const [rows] = await pool.execute(
        `SELECT DISTINCT CHAR_GERENTE FROM T_M_ORGANIGRAMA
          WHERE CHAR_DIR_AREA = ?${dirCorpClause} AND CHAR_GERENTE IS NOT NULL AND CHAR_GERENTE <> ''
          ORDER BY CHAR_GERENTE`,
        params
      );
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(rows.map(r => r.CHAR_GERENTE)));
    } catch (err) {
      console.error('❌ Error en /api/gerentes:', err.message);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  // ─── GET /api/vars-globales ───────────────────────────────────────────────
  if (req.url === '/api/vars-globales' && req.method === 'GET') {
    try {
      const [rows] = await pool.execute(
        `SELECT ANO_INICIATIVA, CHAR_TRM FROM T_P_VAR_GLOBALES
          WHERE ANO_INICIATIVA IS NOT NULL AND ANO_INICIATIVA <> ''
          ORDER BY ANO_INICIATIVA`
      );
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(rows.map(r => ({ ano: String(r.ANO_INICIATIVA), trm: String(r.CHAR_TRM) }))));
    } catch (err) {
      console.error('❌ Error en /api/vars-globales:', err.message);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  // ─── GET /api/kpis ────────────────────────────────────────────────────────
  if (req.url === '/api/kpis' && req.method === 'GET') {
    try {
      const [rows] = await pool.execute(
        `SELECT DISTINCT CHAR_PALANCA FROM T_P_ESTRATEGIA
          WHERE CHAR_PALANCA IS NOT NULL AND CHAR_PALANCA <> ''
          ORDER BY CHAR_PALANCA`
      );
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(rows.map(r => r.CHAR_PALANCA)));
    } catch (err) {
      console.error('❌ Error en /api/kpis:', err.message);
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
