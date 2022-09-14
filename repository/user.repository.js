const db = require('./db')

module.exports = {
    insertUser: (user) => {
        return new Promise((res, rej) => {
            db.query(`INSERT INTO users (id, password, refresh_token, token) VALUES ?`, [[[user.id, user.password, user.refresh_token, user.token]]], function (err, result) {
                if (err) rej(err);
                res(result)
            });
        })
    },
    updateTokens: (id, newToken, refreshToken) => {
        return new Promise((res, rej) => {
            db.query(`UPDATE users SET token = ?, refresh_token = ? WHERE id = ?`, [newToken,refreshToken, id], function (err, result) {
                if (err) rej(err);
                res(result)
            });
        })
    },
    updateToken: (id, newToken) => {
        return new Promise((res, rej) => {
            db.query(`UPDATE users SET token = ? WHERE id = ?`, [newToken, id], function (err, result) {
                if (err) rej(err);
                res(result)
            });
        })
    },
    deleteTokens: (id) => {
        return new Promise((res, rej) => {
            db.query(`UPDATE users SET token = ?, refresh_token = ? WHERE id = ?`, ['', '', id], function (err, result) {
                if (err) rej(err);
                res(result)
            });
        })
    },
    getById: (id) => {
        return new Promise((res, rej) => {
            db.query(`SELECT * FROM users WHERE id = ?`, [id], function (err, result) {
                if (err) rej(err);
                res(result)
            });
        })
    },
    getByRefreshToken: (token) => {
        return new Promise((res, rej) => {
            db.query(`SELECT * FROM users WHERE refresh_token = ?`, [token], function (err, result) {
                if (err) rej(err);
                res(result)
            });
        })
    }
}
