import { Request, Response } from "express";
import database from "../config/db";
import { sendMessageToQueue } from "../rabbitmq.services";

export const getTanque = async (req: Request, res: Response) =>{
    try{
        const [rows] = await database.query('SELECT * FROM Tanque');
        res.json(rows);
    }catch(error){
        res.status(500).json({error:'Error al obtener los datos del tanque'});
    }
};

export const createTanque = async (req: Request, res: Response) => {
    const { capacidad, temperatura, ph, turbidez_agua, nivel_agua} = req.body;
    
    try {
      const [result] = await database.query(
        'INSERT INTO Tanque (capacidad, temperatura, ph, turbidez_agua, nivel_agua) VALUES (?, ?, ?, ?, ?)',
        [capacidad, temperatura, ph, turbidez_agua, nivel_agua]
      );

      const message = {
        action: 'create',
        id: (result as any).insertId,
        capacidad, 
        temperatura, 
        ph, 
        turbidez_agua, 
        nivel_agua
      };
      
      await sendMessageToQueue('tanqueQueue',JSON.stringify(message));
      
      res.status(201).json({
        message: 'Datos del estanque registrado',
        data: { id: (result as any).insertId, capacidad, temperatura, ph, turbidez_agua, nivel_agua }
      });
    } catch (error) {
      res.status(500).json({ error: error });
    }
  };