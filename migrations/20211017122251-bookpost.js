'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('BookPost', {
      id: {
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      bookID: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      title: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      contents: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: false,
      },
      userID: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      interestedCounts: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
      },
      endDate: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
      },
      bidPrice: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
      },
      buyingItNowPrice: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
      },
      reservePrice: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
      },
      bookImageUrl: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      isActive: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false,
      },
      thumbnail: {
        type: Sequelize.DataTypes.STRING,
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
    return queryInterface.dropTable('BookPost');
  },
};
