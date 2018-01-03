'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('messages', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      text: {
        type: Sequelize.STRING,
       },
       author_id: {
         type: Sequelize.INTEGER,
         references: {
           model: 'users',
           key: 'id'
         },
         onUpdate: 'cascade',
         onDelete: 'cascade'
       },
       room_id: {
         type: Sequelize.INTEGER,
         references: {
           model: 'rooms',
           key: 'id'
         },
         onUpdate: 'cascade',
         onDelete: 'cascade'
       },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('messages');
  }
};