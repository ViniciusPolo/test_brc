const { Model, DataTypes } = require('sequelize')

class Orders extends Model {
    static init(sequelize) {
        super.init({
            id_user: DataTypes.INTEGER,
            type_of_transaction: DataTypes.ENUM(["BUY", "SELL"]),
            amount: DataTypes.DOUBLE,
            price: DataTypes.DOUBLE,
            active: DataTypes.BOOLEAN,
            unity_price: DataTypes.DOUBLE,
            fee: DataTypes.DOUBLE
        }, {
            sequelize,
            tableName: "orders"
        })
        return this 
    }

    static associate(models) {
        this.belongsTo(models.Users, { foreignKey: "id_user", as: "id_user" });
    }

}
module.exports = Orders