'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.ticket, {
        foreignKey: 'ticketId',
        onDelete: "CASCADE"
      });

      this.hasMany(models.couponConnector, {
        foreignKey: "bookingId",
      });

    }
  }
  booking.init({
    ticketId: DataTypes.INTEGER,
    bookingCode: DataTypes.STRING,
    status: DataTypes.STRING(10),
    createdBy: DataTypes.INTEGER,
    variant: DataTypes.JSON,
    paymentMethod: DataTypes.STRING(20),
    totalPayment: DataTypes.DECIMAL(10, 2),
    businessUserId: DataTypes.INTEGER,
    isActive: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'booking',
  });
  return booking;
};