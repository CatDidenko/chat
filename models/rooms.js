'use strict';
module.exports = (sequelize, DataTypes) => {
  var rooms = sequelize.define('rooms', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    owner_id: DataTypes.INTEGER
   }); //{
  //   classMethods: {
  //     associate: function(models) {
  //      rooms.belongsTo(models.users, { foreignKey: 'owner_id'});
  //      rooms.hasMany(models.messages, { foreignKey: 'room_id'});
  //      rooms.belongsToMany(models.users, { through: 'UsersRooms'});
  //     }
  //   }
  // });
  rooms.associate = function(models){
    rooms.belongsTo(models.users, { foreignKey: 'owner_id'});
         rooms.hasMany(models.messages, { foreignKey: 'room_id'});
        rooms.belongsToMany(models.users, { through: 'UsersRooms'});
  };
  return rooms;
};