import { Router } from 'express';
import pool from '../db.js';

const router = Router();

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Correo y contraseña son obligatorios',
    });
  }

  try {
    const [rows] = await pool.query(
      `SELECT
         ID_USUARIOS,
         CHAR_NOMBRE_USUARIO,
         CHAR_CORREO_USUARIO,
         CHAR_ROL_USUARIO,
         CHAR_AREA,
         CHAR_ESTADO_USUARIO
       FROM T_P_USUARIOS
       WHERE CHAR_CORREO_USUARIO     = ?
         AND CHAR_CONTRASENA_USUARIO = ?
         AND CHAR_ESTADO_USUARIO     = 1`,
      [email.toLowerCase(), password]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales incorrectas o usuario inactivo',
      });
    }

    const u = rows[0];

    return res.json({
      success: true,
      user: {
        id:     String(u.ID_USUARIOS),
        name:   u.CHAR_NOMBRE_USUARIO,
        email:  u.CHAR_CORREO_USUARIO,
        role:   u.CHAR_ROL_USUARIO,
        area:   u.CHAR_AREA,
        status: 'ACTIVO',
      },
    });
  } catch (error) {
    console.error('[Auth] Error en login:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
    });
  }
});

export default router;
