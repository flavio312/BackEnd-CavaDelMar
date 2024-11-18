// models/Tanque.ts
import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db';

class Tanque extends Model {}

Tanque.init({
  capacidad: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  temperatura: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  ph: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  turbidez_agua: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  nivel_agua: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
}, {
  sequelize,
  modelName: 'Tanque',
  tableName: 'Tanque',
  timestamps: false,
});

export default Tanque;
