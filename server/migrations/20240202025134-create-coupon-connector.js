'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('couponConnectors', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      couponId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'coupons',
          key: 'id',
          as: 'couponId',
        }
      },
      bookingId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'bookings',
          key: 'id',
          as: 'bookingId',
        }
      },
      createdBy: {
        allowNull: false,
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        references: {
          model: 'users',
          key: 'id',
          as: 'createdBy',
        }
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: 1
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('couponConnectors');
  }
};