import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/db';

class Peces extends Model{}

Peces.init(
  {
    id_pez: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    peso: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tipo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName:'Peces', 
    tableName: 'Peces',  
    timestamps: false,
  }
);

export default Peces;
