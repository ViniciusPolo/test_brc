const express = require("express")
const cors = require('cors')
const http = require('http')
const app = express();
require("dotenv").config()

require('./database/indexDB')

//const dbConnection = require('./config/database')
//dbConnection()

app.use(express.json())
app.use(cors())

const usersRoutes = require('./api/routes/usersRoutes')
const ordersRoutes = require('./api/routes/ordersRoutes')

app.use(usersRoutes)
app.use(ordersRoutes)

app.set('url', 'http://localhost:');
app.set('port', 3015);

http.createServer(app).listen(app.get('port'), function(){
    console.log('Server started on '+ app.get('url') + app.get('port'))
})

module.exports = app

