import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { sendMessageToQueue } from '../rabbitmq.services';
import { Request, Response } from "express";
import database from "../config/db";

export const getUsua = async (req: Request, res: Response) => {
  try {
    const [rows] = await database.query('SELECT * FROM Usua'); 
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const createUser = async (req: Request, res: Response) => {
  const { nombre, contrasena } = req.body;

  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(contrasena, saltRounds);

    const [result] = await database.query(
      'INSERT INTO Usua (nombre, contrasena) VALUES (?, ?)',
      [nombre, hashedPassword]
    );

    const message = {
      action: 'create',
      id: (result as any).insertId,
      nombre,
      hashedPassword
    };

    // Enviar mensaje a RabbitMQ
    await sendMessageToQueue('userQueue', JSON.stringify(message));

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

    const isMatch = await bcrypt.compare(contrasena, user.contrasena);
    if (!isMatch) return res.status(401).json({ message: 'Contraseña incorrecta' });

    const secretKey = process.env.JWT_SECRET as string;
    const token = jwt.sign({ id: user.id, nombre: user.nombre }, secretKey, { expiresIn: '1h' });

    res.json({ message: 'Inicio de sesión exitoso', token });
  } catch (error) {
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { nombre, contrasena } = req.body;

  try {
    const saltRounds = 10;
    let hashedPassword = contrasena;
    if (contrasena) {
      hashedPassword = await bcrypt.hash(contrasena, saltRounds);
    }

    const [result] = await database.query(
      'UPDATE Usua SET nombre = ?, contrasena = ? WHERE id_Usuario = ?',
      [nombre, hashedPassword, id]
    );

    const message = {
      action: 'update',
      id,
      nombre,
      hashedPassword
    };

    // Enviar mensaje a RabbitMQ
    await sendMessageToQueue('userQueue', JSON.stringify(message));

    res.json({
      message: 'Usuario actualizado exitosamente',
      data: { id, nombre }
    });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};


export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await database.query('DELETE FROM Usua WHERE id_Usuario = ?', [id]);

    const message = {
      action: 'delete',
      id
    };

    // Enviar mensaje a RabbitMQ
    await sendMessageToQueue('userQueue', JSON.stringify(message));

    res.json({ message: 'Usuario eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};
