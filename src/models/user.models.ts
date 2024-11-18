import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db';

class Usuario extends Model {}

Usuario.init({
  nombre: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  contrasena: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'Usuario',
  tableName: 'Usuario',
  timestamps: false,
});

export default Usuario;
