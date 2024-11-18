import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db';

class Adm extends Model {}

Adm.init({
  nombre: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  contrasena: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  rol: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  correo: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
  },
}, {
  sequelize,
  modelName: 'Adm',
  tableName: 'Adm',
  timestamps: false,
});

export default Adm;
