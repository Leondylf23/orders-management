'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class couponConnector extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.coupon, {
        foreignKey: 'couponId',
        onDelete: "CASCADE"
      });

      this.belongsTo(models.booking, {
        foreignKey: 'bookingId',
        onDelete: "CASCADE"
      });

      this.belongsTo(models.ticket, {
        foreignKey: 'ticketId',
        onDelete: "CASCADE"
      });
    }
  }
  couponConnector.init({
    couponId: DataTypes.INTEGER,
    bookingId: DataTypes.INTEGER,
    createdBy: DataTypes.INTEGER,
    ticketId: DataTypes.INTEGER,
    isActive: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'couponConnector',
  });
  return couponConnector;
};