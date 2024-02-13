'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.product, {
        foreignKey: 'productId',
        onDelete: "CASCADE"
      });
    }
  }
  order.init({
    productId: DataTypes.INTEGER,
    transactionCode: DataTypes.STRING,
    status: DataTypes.STRING(10),
    paymentMethod: DataTypes.STRING(20),
    totalPayment: DataTypes.DECIMAL(10, 2),
    businessUserId: DataTypes.INTEGER,
    isActive: DataTypes.BOOLEAN,
    createdBy: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'order',
  });
  return order;
};