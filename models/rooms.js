'use strict';
module.exports = (sequelize, DataTypes) => {
  var rooms = sequelize.define('rooms', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    owner_id: DataTypes.INTEGER
   }); 
   
  rooms.associate = function(models){
    rooms.belongsTo(models.users, { foreignKey: 'owner_id', onDelete:'cascade'});
         rooms.hasMany(models.messages, { foreignKey: 'room_id', onDelete:'cascade'});
        rooms.belongsToMany(models.users, { through: 'UsersRooms', as: 'People'});
  };
  return rooms;
};