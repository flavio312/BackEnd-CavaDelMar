import express from 'express';
import sequelize from './src/config/db'; 
import cors from 'cors'
import router from './src/routes/conexion.routes';
import userRouter from './src/routes/user.routes';
import { connectToRabbitMQ } from './src/services/rabbitmq.services';
import dotenv from 'dotenv';
import { verifyConnection } from './src/services/email.services';
import initializeWebSocket from './src/services/conexion';


dotenv.config();
const app = express();
app.use(cors());
const port = process.env.PORT || 3000;
verifyConnection();

app.use(express.json());
app.use('/api', router);
app.use('/api/users', userRouter);

(async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log('Conectado a la base de datos');

    await connectToRabbitMQ();
    console.log('Conectado a RabbitMQ');

    console.log('Cliente MQTT inicializado y suscrito a topics');
    initializeWebSocket(); // Inicia el WebSocket

    console.log('Cliente WebSocket inicializado');


    app.listen(port, () => {
      console.log(`Servidor corriendo en el puerto ${port}`);
    });
  } catch (error) {
    console.error('Error al conectar y sincronizar la base de datos o RabbitMQ:', error);
  }
})();
