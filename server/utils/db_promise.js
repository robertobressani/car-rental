const db = require('../db/db');

module.exports.queryAll = (query, params) => {
    return new Promise((resolve, reject) => {
        if (params)
            db.all(query, params, (err, rows) => {
                if (err)
                    reject(err);
                else
                    resolve(rows);
            });
        else  db.all(query, (err, rows) => {
            if (err)
                reject(err);
            else
                resolve(rows);
        });
    });
};

module.exports.queryGet = (query, params) => {
    return new Promise((resolve, reject) => {
        if (params)
            db.get(query, params, (err, rows) => {
                if (err)
                    reject(err);
                else
                    resolve(rows);
            });
        else  db.get(query, (err, rows) => {
            if (err)
                reject(err);
            else
                resolve(rows);
        });
    });
};
