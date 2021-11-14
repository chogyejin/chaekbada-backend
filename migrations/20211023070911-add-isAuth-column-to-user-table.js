'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      {  tableName: 'User' },
      'isAuth',
      {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false,
      },
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      {  tableName: 'User' },
      'isAuth',
    );
  },
};
