/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'orders', 
      'fee', 
      {
        type: Sequelize.FLOAT,
        allowNull: true,
        defaultValue: 0.0
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('orders', 'fee');
  }
};