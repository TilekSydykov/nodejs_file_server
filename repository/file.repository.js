const db = require("./db")

module.exports = {
    insertFile: (file) => {
        return new Promise((res, rej) => {
            db.query(`INSERT INTO files (name, type, mime, size, path)
                      VALUES ?`, [[[file.name, file.type, file.mime, file.size, file.path]]], function (err, result) {
                if (err) rej(err);
                res(result)
            });
        })
    },
    listFiles: (from, limit) => {
        return new Promise((res, rej) => {
            db.query(`SELECT id, name, type, mime, size, created_date
                      FROM files
                      LIMIT ? OFFSET ?`, [limit, from], function (err, result) {
                if (err) rej(err);
                res(result)
            });
        })
    },
    getFileById: (id) => {
        return new Promise((res, rej) => {
            db.query(`SELECT id, name, type, mime, size, created_date
                      FROM files
                      WHERE id = ?`, [id], function (err, result) {
                if (err) rej(err);
                res(result)
            });
        })
    },
    getFilePathById: (id) => {
        return new Promise((res, rej) => {
            db.query(`SELECT path
                      FROM files
                      WHERE id = ?`, [id], function (err, result) {
                if (err) rej(err);
                res(result)
            });
        })
    },


    getFileWithPathById: (id) => {
        return new Promise((res, rej) => {
            db.query(`SELECT path, name, mime, size
                      FROM files
                      WHERE id = ?`, [id], function (err, result) {
                if (err) rej(err);
                res(result)
            });
        })
    },

    deleteFileById: (id) => {
        return new Promise((res, rej) => {
            db.query(`DELETE
                      FROM files
                      WHERE ((id = ?));`, [id], function (err, result) {
                if (err) rej(err);
                res(result)
            });
        })
    },
    updateFile: (id, file) => {
        return new Promise((res, rej) => {
            db.query(`UPDATE files
                      SET name = ?,
                          type = ?,
                          mime = ?,
                          size = ?,
                          path = ?
                      WHERE id = ?`, [file.name, file.type, file.mime, file.size, file.path, id], function (err, result) {
                if (err) rej(err);
                res(result)
            });
        })
    },
}
