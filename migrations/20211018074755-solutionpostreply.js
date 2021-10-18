'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('SolutionPostReply', {
      id: {
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      solutionPostID: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      userID: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      contents: {
        type: Sequelize.DataTypes.TEXT,
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
    return queryInterface.dropTable('SolutionPostReply');
  },
};
