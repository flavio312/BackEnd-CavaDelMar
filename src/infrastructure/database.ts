import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize('eventos', 'eventosE', 'eventosE', {
  host: 'localhost',
  dialect: 'mysql',
});

export const initDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};
