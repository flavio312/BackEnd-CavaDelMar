import { Request, Response } from "express";
import database from "../config/db";

export const getSales = async (req: Request, res:Response) => {
    try{
        const [rows] = await database.query('SELECT * FROM Venta');
        res.json(rows);
    }catch(error){
        res.status(500).json({error:'Error al obtener las ventas'});
    }
};

export const createSales = async (req: Request, res: Response) => {
    const { nombre, contrasena } = req.body;
    
    try {
      const [result] = await database.query(
        'INSERT INTO Venta (nombre, contrasena) VALUES (?, ?)',
        [nombre, contrasena]
      );
  
      res.status(201).json({
        message: 'Administrador creado exitosamente',
        data: { id: (result as any).insertId, nombre, contrasena}
      });
    } catch (error) {
      res.status(500).json({ error: error });
    }
  };