'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Auth', {
      id: {
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      isAuth: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false,
      },
      userID: {
        type: Sequelize.DataTypes.UUID,
        allowNull: false,
      },
      verificationCode: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      expirationTime: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
      },

      createdAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Auth');
  },
};
