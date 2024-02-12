'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ticket extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.user, {
        foreignKey: 'createdBy',
        onDelete: "CASCADE"
      });

      this.hasMany(models.coupon, {
        foreignKey: 'createdBy',
        sourceKey: 'createdBy'
      });

      this.hasMany(models.booking, {
        foreignKey: 'ticketId',
      });

      this.hasMany(models.couponConnector, {
        foreignKey: 'ticketId',
      });
    }
  }
  ticket.init({
    title: DataTypes.STRING,
    location: DataTypes.TEXT,
    price: DataTypes.DECIMAL,
    variants: DataTypes.JSON,
    description: DataTypes.TEXT,
    imageUrl: DataTypes.TEXT,
    createdBy: DataTypes.INTEGER,
    isActive: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'ticket',
  });
  return ticket;
};