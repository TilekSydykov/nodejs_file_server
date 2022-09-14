const express = require('express')
const bodyParser = require('body-parser')
const router = require("./router/index")
require('./repository/db')

const config = require('./config')
const cors = require("cors");

const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use('/', router)

app.listen(config.port || 3000);
