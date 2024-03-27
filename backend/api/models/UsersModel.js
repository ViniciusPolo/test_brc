const { Model, DataTypes } = require('sequelize')

class Users extends Model {
    static init(sequelize) {
        super.init({
            firstName: DataTypes.STRING,
            lastName: DataTypes.STRING,
            btc: DataTypes.STRING,
            usd: DataTypes.STRING,
            cpf: DataTypes.STRING,
            password_hash: DataTypes.STRING
        }, {
            sequelize,
            tableName: "users"
        })
        return this 
    }

}
module.exports = Users