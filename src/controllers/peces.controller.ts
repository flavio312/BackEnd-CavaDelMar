import { Request, Response } from "express";
import { sendMessageToQueue } from "../services/rabbitmq.services";
import Peces from "../models/peces.models";

export const getPeces = async (req: Request, res: Response) => {
  try {
    const peces = await Peces.findAll();  // Utilizamos Sequelize para obtener todos los peces
    res.json(peces);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los datos de los peces' });
  }
};

export const createPeces = async (req: Request, res: Response) => {
  const { peso, tipo } = req.body;

  try {
    const newPez = await Peces.create({
      peso,
      tipo
    });

    const message = {
      action: 'create',
      id: newPez.getDataValue('id_pez'),  // Obtenemos el ID generado automáticamente
      peso,
      tipo
    };

    await sendMessageToQueue('pecesQueue', JSON.stringify(message));

    res.status(201).json({
      message: 'Datos guardados correctamente',
      data: newPez
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al guardar los datos de los peces', details: error });
  }
};
