import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { sendMessageToQueue } from '../rabbitmq.services';
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
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(contrasena, saltRounds);

    const [result] = await database.query(
      'INSERT INTO Adm (nombre, contrasena, rol, correo) VALUES (?, ?, ?, ?)',
      [nombre, hashedPassword, rol, correo]
    );

    const message = {
      action: 'create',
      id: (result as any).insertId,
      nombre,
      hashedPassword,
      rol,
      correo
    };

    await sendMessageToQueue('adminQueue', JSON.stringify(message));

    const secretKey = process.env.JWT_SECRET || 'tu_clave_secreta';
    const token = jwt.sign({ id: (result as any).insertId, nombre, rol, correo }, secretKey, { expiresIn: '1h' });

    res.status(201).json({
      message: 'Administrador creado exitosamente y mensaje enviado a RabbitMQ',
      data: {id:(result as any).insertId,nombre,rol, correo},
      token
    });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};
