'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      { schema: 'chaekbada', tableName: 'User' },
      'isAuth',
      {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false,
      },
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      { schema: 'chaekbada', tableName: 'User' },
      'isAuth',
    );
  },
};
