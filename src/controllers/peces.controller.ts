import { Request, Response } from "express";
import database from "../config/db";

export const getPeces = async (req: Request, res:Response) =>{
    try{
        const [rows] = await database.query('SELECT * FROM Peces');
        res.json(rows);
    }catch (error){
        res.status(500).json({error: 'Error al obtener los datos de los peces'});
    }
};

export const createPeces = async (req: Request, res: Response)=>{
    const {peso, tipo} = req.body;

    try{
        const[result] =await database.query(
            'INSERT INTO Peces(peso, tipo) VALUE (?,?)',
            [peso, tipo]
        );

        res.status(201).json({
            message: 'Datos guardados correctamente',
            data: {id: (result as any).insertId, peso, tipo}
        });
    }catch(error){
        res.status(500).json({error: error})
    }
};