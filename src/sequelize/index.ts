import { Sequelize, DataTypes } from 'sequelize';
import { Users } from './types/user';
import { Test } from './types/test';
import { DB_USER, DB_PASSWORD, DB_PORT, DB_NAME, DB_HOST } from '../constant';

const initSequelize = () => {
  const sequelize = new Sequelize(
    `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`,
  );

  Users.init(
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
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      zipCode: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      school: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      birthDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
    },
    {
      tableName: 'Users',
      sequelize, // passing the `sequelize` instance is required
    },
  );

  Test.init(
    {
      password: {
        type: new DataTypes.STRING(),
        allowNull: false,
      },
      name: {
        type: new DataTypes.STRING(),
        allowNull: false,
        primaryKey: true,
      },
    },
    {
      tableName: 'test',
      sequelize, // passing the `sequelize` instance is required
    },
  );
};

export { initSequelize };
