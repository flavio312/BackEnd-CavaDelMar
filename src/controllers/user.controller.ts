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
  const { name, email, password, role } = req.body;

  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUsuario = await Usuario.create({
      name,
      email,
      password: hashedPassword,
      role
    });

    const message = {
      action: 'create',
      id: newUsuario.getDataValue('id_Usuario'),
      name,
      email,
      hashedPassword,
      role
    };

    await sendMessageToQueue('userQueue', JSON.stringify(message));

    const secretKey = process.env.JWT_SECRET || 'tu_clave_secreta';
    const token = jwt.sign({ id: newUsuario.getDataValue('id_Usuario'), name }, secretKey, { expiresIn: '1h' });

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

export const loginUser = async (req: Request, res: Response): Promise<any> => {
  const { email, password } = req.body;

  try {
    console.log('Email recibido:', email);

    const user = await Usuario.findOne({ where: { email } });
    if (!user) {
      console.log('Usuario no encontrado');
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    console.log('Contraseña cifrada almacenada:', user.getDataValue('password'));

    const isMatch = await bcrypt.compare(password, user.getDataValue('password'));
    if (!isMatch) {
      console.log('Contraseña incorrecta');
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    const secretKey = process.env.JWT_SECRET || 'tu_clave_secreta';
    const token = jwt.sign(
      {
        id: user.getDataValue('id_Usuario'),
        name: user.getDataValue('name'),
        role: user.getDataValue('role'), 
      },
      secretKey,
      { expiresIn: '1h' }
    );

    console.log('Token generado:', token);

    res.json({
      message: 'Inicio de sesión exitoso',
      token,
      role: user.getDataValue('role'), 
    });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
};



export const updateUser = async (req: Request, res: Response):Promise<any> => {
  const { id } = req.params;
  const { name, email, password, role } = req.body;

  try {
    const saltRounds = 10;
    let hashedPassword = password;
    if (password) {
      hashedPassword = await bcrypt.hash(password, saltRounds);
    }

    const [affectedRows] = await Usuario.update(
      { name, email, password: hashedPassword, role },
      { where: { id_Usuario: id } }
    );

    if (affectedRows === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const message = {
      action: 'update',
      id,
      name,
      email,
      hashedPassword,
      role
    };

    await sendMessageToQueue('userQueue', JSON.stringify(message));

    res.json({
      message: 'Usuario actualizado exitosamente',
      data: { id, name }
    });
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const deleteUserByEmail = async (req: Request, res: Response): Promise<any> => {
  const { email, password } = req.body;

  try {
    const user = await Usuario.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Accede a la contraseña en la base de datos
    const storedPassword = user.getDataValue('password'); // Asegúrate de acceder al valor correctamente

    // Verificar la contraseña proporcionada
    const isPasswordValid = await bcrypt.compare(password, storedPassword);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    // Eliminar usuario si la contraseña es válida
    await Usuario.destroy({ where: { email } });

    const message = {
      action: 'delete',
      email,
    };

    await sendMessageToQueue('userQueue', JSON.stringify(message));

    res.json({ message: 'Usuario eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar el usuario:', error);
    res.status(500).json({ error: 'Error al eliminar el usuario' });
  }
};