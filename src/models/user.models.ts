import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db';

class Usuario extends Model {}

Usuario.init({
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  email:{
    type: DataTypes.STRING(109),
    allowNull:false
  },
  password: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },role: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
}, {
  sequelize,
  modelName: 'Usuario',
  tableName: 'Usuario',
  timestamps: false,
});

export default Usuario;
