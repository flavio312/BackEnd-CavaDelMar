import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Request, Response } from "express";
import database from "../config/db";

export const getUsua = async (req: Request, res: Response) => {
  try {
    const [rows] = await database.query('SELECT nombre FROM Usua'); // Seleccionar solo los campos sin la contraseña
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};


export const createUser = async (req: Request, res: Response) => {
  const { nombre, contrasena } = req.body;

  try {
      // Encriptar la contraseña
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(contrasena, saltRounds);

      const [result] = await database.query(
        'INSERT INTO Usua (nombre, contrasena) VALUES (?, ?)',
        [nombre, hashedPassword]
      );

      // Generar el token JWT
      const secretKey = process.env.JWT_SECRET || 'tu_clave_secreta';
      const token = jwt.sign({ id: (result as any).insertId, nombre }, secretKey, { expiresIn: '1h' });

      res.status(201).json({
        message: 'Usuario creado exitosamente',
        data: { id: (result as any).insertId, nombre },
        token
      });
  } catch (error) {
      res.status(500).json({ error: error });
  }
};


export const loginUser = async (req: Request, res: Response) => {
  const { nombre, contrasena } = req.body;

  try {
    const [rows]: any = await database.query('SELECT * FROM Usua WHERE nombre = ?', [nombre]);
    if (rows.length === 0) return res.status(404).json({ message: 'Usuario no encontrado' });

    const user = rows[0];

    // Comparar la contraseña en texto plano con la encriptada
    const isMatch = await bcrypt.compare(contrasena, user.contrasena);
    if (!isMatch) return res.status(401).json({ message: 'Contraseña incorrecta' });

    // Generar token JWT
    const secretKey = process.env.JWT_SECRET || 'tu_clave_secreta';
    const token = jwt.sign({ id: user.id, nombre: user.nombre }, secretKey, { expiresIn: '1h' });

    res.json({ message: 'Inicio de sesión exitoso', token });
  } catch (error) {
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
};
