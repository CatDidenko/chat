'use strict';
module.exports = (sequelize, DataTypes) => {
  var users = sequelize.define('users', {
    login: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
   },
{
  timestamps: false
});
users.associate = function(models){
  users.hasMany(models.messages, { foreignKey: 'author_id'});
        users.hasMany(models.rooms, { foreignKey: 'owner_id'});
         users.belongsToMany(models.rooms, {through: 'UsersRooms', as: 'Chat'});
};
  return users;
};