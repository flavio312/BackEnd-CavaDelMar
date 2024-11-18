import express from 'express';
import sequelize from './src/config/db'; 
import Adm from './src/models/adm.models';
import Peces from './src/models/peces.models';
import Tanque from './src/models/tanque.models';
import Usuario from './src/models/user.models';
import Venta from './src/models/sales.models';
import router from './src/routes/conexion.routes';
import userRouter from './src/routes/user.routes';
import { connectToRabbitMQ } from './src/services/rabbitmq.services';
import client from './src/services/mqtt.services';
import { verifyConnection } from './src/services/email.services';

const app = express();
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

    app.listen(port, () => {
      console.log(`Servidor corriendo en el puerto ${port}`);
    });
  } catch (error) {
    console.error('Error al conectar y sincronizar la base de datos o RabbitMQ:', error);
  }
})();
