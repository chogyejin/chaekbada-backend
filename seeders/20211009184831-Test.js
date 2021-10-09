'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let datas = [];
    for (let i = 0; i < 10; i++) {
      let obj = {
        //email: 'test' + i + '@example.com',
        name: 'testUser' + i,
        password: 'abc' + i,
        createdAt: new Date()
          .toISOString()
          .replace(/T/, ' ')
          .replace(/\..+/, ''),
        updatedAt: new Date()
          .toISOString()
          .replace(/T/, ' ')
          .replace(/\..+/, ''),
      };
      datas.push(obj);
    }

    return queryInterface.bulkInsert('test', datas, {});
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
