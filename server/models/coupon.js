'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class coupon extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.couponConnector, {
        foreignKey: "couponId",
      });
    }
  }
  coupon.init({
    couponName: DataTypes.STRING,
    couponPrcCut: DataTypes.DECIMAL,
    createdBy: DataTypes.INTEGER,
    isActive: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'coupon',
  });
  return coupon;
};