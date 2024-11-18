import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { sendMessageToQueue } from '../services/rabbitmq.services';
import { Request, Response } from "express";
import Usuario from '../models/user.models';

export const getUsua = async (req: Request, res: Response):Promise<any>=> {
  try {
    const usua = await Usuario.findAll(); 
    res.json(usua);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const createUser = async (req: Request, res: Response):Promise<any>=> {
  const { nombre, contrasena } = req.body;

  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(contrasena, saltRounds);

    const newUsuario = await Usuario.create({
      nombre,
      contrasena: hashedPassword
    });

    const message = {
      action: 'create',
      id: newUsuario.getDataValue('id_Usuario'),
      nombre,
      hashedPassword
    };

    await sendMessageToQueue('userQueue', JSON.stringify(message));

    const secretKey = process.env.JWT_SECRET || 'tu_clave_secreta';
    const token = jwt.sign({ id: newUsuario.getDataValue('id_Usuario'), nombre }, secretKey, { expiresIn: '1h' });

    res.status(201).json({
      message: 'Usuario creado exitosamente',
      data: newUsuario,
      token
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

export const loginUser = async (req: Request, res: Response):Promise<any> => {
  const { nombre, contrasena } = req.body;

  try {
    const user = await Usuario.findOne({ where: { nombre } });
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    const isMatch = await bcrypt.compare(contrasena, user.getDataValue('contrasena'));
    if (!isMatch) return res.status(401).json({ message: 'Contraseña incorrecta' });

    const secretKey = process.env.JWT_SECRET || 'tu_clave_secreta';
    const token = jwt.sign({ id: user.getDataValue('id_Usuario'), nombre: user.getDataValue('nombre') }, secretKey, { expiresIn: '1h' });

    res.json({ message: 'Inicio de sesión exitoso', token });
  } catch (error) {
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
};

export const updateUser = async (req: Request, res: Response):Promise<any> => {
  const { id } = req.params;
  const { nombre, contrasena } = req.body;

  try {
    const saltRounds = 10;
    let hashedPassword = contrasena;
    if (contrasena) {
      hashedPassword = await bcrypt.hash(contrasena, saltRounds);
    }

    const [affectedRows] = await Usuario.update(
      { nombre, contrasena: hashedPassword },
      { where: { id_Usuario: id } }
    );

    if (affectedRows === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const message = {
      action: 'update',
      id,
      nombre,
      hashedPassword
    };

    await sendMessageToQueue('userQueue', JSON.stringify(message));

    res.json({
      message: 'Usuario actualizado exitosamente',
      data: { id, nombre }
    });
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const deleteUser = async (req: Request, res: Response):Promise<any>=> {
  const { id } = req.params;

  try {
    const deletedRows = await Usuario.destroy({ where: { id_Usuario: id } });

    if (deletedRows === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const message = {
      action: 'delete',
      id
    };

    await sendMessageToQueue('userQueue', JSON.stringify(message));

    res.json({ message: 'Usuario eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ error });
  }
};


