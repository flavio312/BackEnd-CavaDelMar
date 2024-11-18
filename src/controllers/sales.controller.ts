import { Request, Response } from "express";
import { sendMessageToQueue } from "../services/rabbitmq.services";
import Venta from "../models/sales.models";

export const getSales = async (req: Request, res: Response) => {
    try {
        const sales = await Venta.findAll();
        res.json(sales);
    } catch (error) {
        res.status(500).json({ error });
    }
};

export const createSales = async (req: Request, res: Response) => {
    const { id_Usuario, fecha_Venta, cantidad, peso, tipo } = req.body;

    try {
        // Crea una nueva venta en la base de datos
        const newSales = await Venta.create({
            id_Usuario,
            fecha_Venta,
            cantidad,
            peso,
            tipo
        });

        // Envía el mensaje a RabbitMQ
        const message = {
            action: 'create',
            id: newSales.getDataValue('id_venta'),
            id_Usuario,
            fecha_Venta,
            cantidad,
            peso,
            tipo
        };
        
        await sendMessageToQueue('salesQueue', JSON.stringify(message));

        // Devuelve la respuesta con los datos de la venta creada
        res.status(201).json({
            message: 'Venta registrada exitosamente',
            data: newSales
        });
    } catch (error) {
        res.status(500).json({ error: 'Error registrando la venta', details: error });
    }
};
