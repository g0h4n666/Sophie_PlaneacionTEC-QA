import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

import authRoutes from './routes/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ───────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── Rutas API ────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);

// ── Frontend estático (producción) ───────────────────────────────────────────
const distPath = join(__dirname, '..', 'dist');
app.use(express.static(distPath));

// SPA fallback — cualquier ruta no-API sirve index.html
app.get('*', (req, res) => {
  res.sendFile(join(distPath, 'index.html'));
});

// ── Arranque ─────────────────────────────────────────────────────────────────
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Sofia API corriendo en http://0.0.0.0:${PORT}`);
});
