/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'orders', 
      'unity_price', 
      {
        type: Sequelize.FLOAT,
        allowNull: true,
        defaultValue: 0.0
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('orders', 'unity_price');
  }
};
