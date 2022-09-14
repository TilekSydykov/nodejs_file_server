const mysql = require('mysql');
const config = require('../config')

const con = mysql.createConnection({
    host: config.mysqlHost,
    user: config.mysqlUser,
    password: config.mysqlPassword,
    database : config.mysqlDB
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected to db!");
});

module.exports = con


