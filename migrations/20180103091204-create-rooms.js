'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('rooms', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
       },
       owner_id: {
         type: Sequelize.INTEGER,
         references: {
           model: 'users',
           key: 'id'
         },
         onUpdate: 'cascade',
         onDelete: 'cascade'
       }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('rooms');
  }
};