const Sequelize = require('sequelize')
const dbConfig = require('../config/database.js')

const conexao = new Sequelize(dbConfig)
const users = require('../api/models/UsersModel')
const orders = require('../api/models/OrdersModel')

try{
    conexao.authenticate();
    console.log('Conexão estabelecida!')
} catch (error) {
    console.log('Conexão não estabelecida =(')
}

users.init(conexao)
orders.init(conexao)

module.exports = conexao