import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../infrastructure/database';

export class EventModel extends Model {
  public id!: number;
  public type!: string;
  public data!: Record<string, any>;
  public timestamp!: string;
}

EventModel.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    type: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    data: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    timestamp: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: 'events',
    sequelize,
  }
);
