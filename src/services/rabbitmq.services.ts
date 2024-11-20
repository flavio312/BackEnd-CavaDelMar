import amqp from 'amqplib';

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://roque:roque@localhost';
let channel: amqp.Channel | null = null;

export const connectToRabbitMQ = async () => {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    channel = await connection.createChannel();
    connection.on('close', () => {
      console.error('Conexión a RabbitMQ cerrada, intentando reconectar...');
      channel = null; 
      setTimeout(connectToRabbitMQ, 2000);
    });
  } catch (error) {
    console.error('Error conectando a RabbitMQ:', error);
    setTimeout(connectToRabbitMQ, 2000);
  }
};

export const sendMessageToQueue = async (queueName: string, message: string) => {
  if (!channel) {
    throw new Error('No conectado a RabbitMQ');
  }
  try {
    await channel.assertQueue(queueName, { durable: true });
    channel.sendToQueue(queueName, Buffer.from(message), { persistent: true });
    console.log(`Mensaje enviado a la cola ${queueName}`);
  } catch (error) {
    console.error('Error enviando mensaje a la cola:', error);
  }
};
