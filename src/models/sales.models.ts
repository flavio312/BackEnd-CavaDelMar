import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db';
import Usuario from './user.models';

class Venta extends Model {}

Venta.init({
  fecha_Venta: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  peso: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
  },
  tipo: {
    type: DataTypes.STRING(30),
    allowNull: true,
  },
}, {
  sequelize,
  modelName: 'Venta',
  tableName: 'Venta',
  timestamps: false,
});

Venta.belongsTo(Usuario, { foreignKey: 'id_usuario' });
Usuario.hasMany(Venta, { foreignKey: 'id_usuario' });

export default Venta;
