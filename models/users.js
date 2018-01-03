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
  }, {
    classMethods: {
      associate: function(models) {
        users.hasMany(models.messages, { foreignKey: 'author_id'});
        users.hasMany(models.rooms, { foreignKey: 'owner_id'});
        users.hasMany(model.rooms, {through: 'users_rooms', foreignKey: 'user_id'});
      }
    }
  },
{
  timestamps: false
});
  return users;
};