import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import express ,{ Request, Response } from 'express';
import { sendMessageToQueue } from '../services/rabbitmq.services';
import Adm from '../models/adm.models';

export const getAdms = async (req: Request, res: Response) => {
  try {
    const adm = await Adm.findAll();
    res.json(adm);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const createAdm = async (req: Request, res: Response) => {
  const { nombre, contrasena, rol, correo } = req.body;

  try {
    // Encriptar la contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(contrasena, saltRounds);

    // Crear un nuevo administrador en la base de datos usando Sequelize
    const newAdm = await Adm.create({
      nombre,
      contrasena: hashedPassword,
      rol,
      correo,
    });

    // Enviar un mensaje a RabbitMQ con los datos del nuevo administrador
    const message = {
      action: 'create',
      nombre,
      hashedPassword,
      rol,
      correo,
    };
    await sendMessageToQueue('adminQueue', JSON.stringify(message));

    // Generar un token JWT
    const secretKey = process.env.JWT_SECRET || 'tu_clave_secreta';
    const token = jwt.sign(
      { nombre, rol, correo },
      secretKey,
      { expiresIn: '1h' }
    );

    // Responder con el token y los datos del administrador
    res.status(201).json({
      message: 'Administrador creado exitosamente y mensaje enviado a RabbitMQ',
      data: {nombre, rol, correo },
      token,
    });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};