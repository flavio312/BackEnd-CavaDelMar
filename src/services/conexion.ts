import WebSocket from 'ws';
import Tanque from '../models/tanque.models'; // Modelo Sequelize
import sequelize from '../config/db'; // Configuración Sequelize

const client = new WebSocket('ws://192.168.137.13:8080'); // Cambia la dirección si está en otro servidor

const initializeWebSocket = () => {
    client.on('open', () => {
        console.log('Conectado al servidor WebSocket');
    });

    client.on('message', async (message) => {
        try {
            const messageStr = message.toString(); // Convierte el mensaje a string
            console.log('Mensaje recibido:', messageStr);

            // Parsear el mensaje recibido
            const parsedMessage = JSON.parse(messageStr);
            const { data } = parsedMessage; // Extraer el objeto "data"

            if (!data) {
                console.error('El mensaje no contiene datos válidos:', parsedMessage);
                return;
            }

            // Desestructurar los datos
            const { Nivel: nivel_Agua, Temperature: temperatura, Turbidez: turbidez_Agua, ph, volumen: capacidad } = data;

            // Validar los datos
            if (
                typeof nivel_Agua === 'number' &&
                typeof temperatura === 'number' &&
                typeof turbidez_Agua === 'number' &&
                typeof ph === 'number' &&
                typeof capacidad === 'number'
            ) {
                // Guardar en la base de datos
                await Tanque.create({
                    capacidad,
                    temperatura,
                    ph,
                    turbidez_Agua,
                    nivel_Agua,
                });
                console.log('Datos guardados en la tabla Tanque');
            } else {
                console.error('Datos inválidos recibidos:', data);
            }
        } catch (err) {
            console.error('Error al procesar el mensaje:', err instanceof Error ? err.message : err);
        }
    });

    client.on('error', (err) => {
        console.error('Error de conexión:', err);
    });

    client.on('close', () => {
        console.log('Conexión cerrada');
    });

    (async () => {
        try {
            await sequelize.authenticate();
            console.log('Conexión a la base de datos establecida');
        } catch (err) {
            console.error('Error al conectar con la base de datos:', err instanceof Error ? err.message : err);
        }
    })();
};

export default initializeWebSocket;
