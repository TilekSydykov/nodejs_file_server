require('dotenv').config()

module.exports = {
    secret: process.env.SECRET,
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
    port: parseInt(process.env.PORT),
    tokenLife: parseInt(process.env.TOKEN_LIFE),
    refreshTokenLife: parseInt(process.env.REFRESH_TOKEN_LIFE),
    mysqlHost: process.env.MYSQL_HOST,
    mysqlUser: process.env.MYSQL_USER,
    mysqlPassword: process.env.MYSQL_PASSWORD,
    mysqlDB: process.env.MYSQL_DATABASE
}
