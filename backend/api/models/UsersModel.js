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
    static associate(models) {
        this.hasMany(models.Orders, { foreignKey: "id_user", as: "id_user" });
      }
    

}
module.exports = Users