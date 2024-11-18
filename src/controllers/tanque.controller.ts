import { Request, Response } from "express";
import Tanque from "../models/tanque.models";
import { sendEmail } from "../services/email.services";

export const getTanque = async (req: Request, res: Response) => {
  try {
    const tanques = await Tanque.findAll();
    res.json(tanques);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const createTanque = async (req: Request, res: Response) => {
  const { capacidad, temperatura, ph, turbidez_agua, nivel_agua } = req.body;
  try {
    const tanque = await Tanque.create({
      capacidad,
      temperatura,
      ph,
      turbidez_agua,
      nivel_agua
    });
    
    if ((ph < 4.4 || ph > 7.6) || (temperatura < 25 || temperatura > 32)) {
      const subject = "⚠️ Alerta en el tanque detectada";
      const text = `
        Se detectaron valores críticos en el tanque:
        - pH: ${ph} (Rango normal: 4.4 - 7.6)
        - Temperatura: ${temperatura}°C (Rango normal: 25°C - 32°C)
        - Capacidad: ${capacidad} litros
        - Turbidez del agua: ${turbidez_agua}
        - Nivel de agua: ${nivel_agua}
      `;

      await sendEmail("fd8242568@gmail.com", subject, text);
    }

    res.status(201).json({
      message: 'Datos del estanque registrados',
      data: tanque,
    });

  } catch (error) {
    res.status(500).json({ error: error });
  }
};