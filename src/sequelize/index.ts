import { Sequelize, DataTypes } from 'sequelize';
import { User } from './types/user';
import { University } from './types/university';
import { DB_USER, DB_PASSWORD, DB_PORT, DB_NAME, DB_HOST } from '../constant';

const initSequelize = () => {
  const sequelize = new Sequelize(
    `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`,
  );

  User.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      universityID: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      point: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      biddingPoint: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      profileImageUrl: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: 'User',
      sequelize, // passing the `sequelize` instance is required
    },
  );

  University.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: 'University',
      sequelize,
    },
  );

  User.belongsTo(University, {
    foreignKey: 'universityID',
    as: 'university',
  });
};

export { initSequelize };
