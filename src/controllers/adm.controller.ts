import { Request, Response } from 'express';
import database from '../config/db';

export const getAdms = async (req: Request, res: Response) => {
  try {
    const [rows] = await database.query('SELECT * FROM Adm');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const createAdm = async (req: Request, res: Response) => {
  const { nombre, contrasena, rol, correo } = req.body;
  
  try {
    const [result] = await database.query(
      'INSERT INTO Adm (nombre, contrasena, rol, correo) VALUES (?, ?, ?, ?)',
      [nombre, contrasena, rol, correo]
    );

    res.status(201).json({
      message: 'Administrador creado exitosamente',
      data: { id: (result as any).insertId, nombre, rol, correo }
    });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};