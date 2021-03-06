'use strict';
module.exports = (sequelize, DataTypes) => {
  var messages = sequelize.define('messages', {
    text: DataTypes.STRING,
    author_id: DataTypes.INTEGER,
    room_id: DataTypes.INTEGER,
  }, {
    timestamps: true,
    updatedAt: false
  });
  messages.associate = function(models){
    messages.belongsTo(models.users, { foreignKey: 'author_id', onDelete:'cascade'});
    messages.belongsTo(models.rooms, { foreignKey: 'room_id', onDelete:'cascade'});
  };
  
  return messages;
};