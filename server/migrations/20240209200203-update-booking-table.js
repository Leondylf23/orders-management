'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('bookings', 'variant', {
      type: Sequelize.JSON
    });
    await queryInterface.addColumn('bookings', 'paymentMethod', {
      type: Sequelize.STRING(20)
    });
    await queryInterface.addColumn('bookings', 'totalPayment', {
      type: Sequelize.DECIMAL(10, 2)
    });
  },

  async down(queryInterface, Sequelize) {
    
    await queryInterface.removeColumn('paymentMethod');
    await queryInterface.removeColumn('totalPayment');
  }
};
