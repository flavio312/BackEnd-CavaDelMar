import { Request, Response } from "express";
import database from "../config/db";
import { sendMessageToQueue } from "../rabbitmq.services";

export const getSales = async (req: Request, res:Response) => {
    try{
        const [rows] = await database.query('SELECT * FROM Venta');
        res.json(rows);
    }catch(error){
        res.status(500).json({error:error});
    }
};


export const createSales = async (req: Request, res: Response) => {
  const { id_Usuario, fecha_Venta, cantidad, peso, tipo } = req.body;

  try {
    const [result] = await database.query(
      'INSERT INTO Venta (id_Usuario, fecha_Venta, cantidad, peso, tipo) VALUES (?, ?, ?, ?, ?)',
      [id_Usuario, fecha_Venta, cantidad, peso, tipo]
    );

    const message = {
      action: 'create',
      id: (result as any).insertId,
      id_Usuario,
      fecha_Venta,
      cantidad,
      peso,
      tipo
    };

    await sendMessageToQueue('salesQueue',JSON.stringify(message));

    res.status(201).json({
      message: 'Venta registrada exitosamente',
      data: { id: (result as any).insertId, id_Usuario, fecha_Venta, cantidad, peso, tipo }
    });
  } catch (error) {
    res.status(500).json({ error: 'Error registrando la venta', details: error });
  }
};