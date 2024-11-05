import express from 'express';
import router from './src/routes/conexion.routes';
import dotenv from 'dotenv';
import { connectToRabbitMQ } from './src/rabbitmq.services';

dotenv.config();

const app = express();
app.use(express.json());
app.use('/api', router);

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    await connectToRabbitMQ(); // Conexión a RabbitMQ
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};

startServer();
