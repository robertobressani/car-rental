const db = require('../db/db');
/**
 * Class that provides a Promise for a query (limits verbose code in a single class)
 */

/**
 * Method to map db.all to a Promise
 * @param query to be performed
 * @param params if present, otherwise []
 * @return {Promise}
 */
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

/**
 * Method to map db.get to a Promise
 * @param query to be performed
 * @param params if present, otherwise []
 * @return {Promise}
 */
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

/**
 * Method to map db.run to a Promise
 * @param query to be performed
 * @param params if present, otherwise []
 * @return {Promise}
 */
module.exports.queryRun = (query, params) => {
    return new Promise((resolve, reject) => {
        if (params)
            db.run(query, params, function(err){
                if (err)
                    reject(err);
                else
                    resolve(this.changes);
            });
        else  db.run(query, function(err) {
            if (err)
                reject(err);
            else
                resolve(this.changes);
        });
    });
};
