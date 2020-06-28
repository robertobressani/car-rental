'use strict';

const sqlite = require('sqlite3').verbose();
const serverConf =require('../config/server_conf');

const DBSOURCE = serverConf.DBsource;

/**
 * Initializes the connection with the DB and exports it
 * @type {sqlite.Database}
 */
const db = new sqlite.Database(DBSOURCE, (err) => {
    if (err) {
        // Cannot open database
        console.error(err.message);
        throw err;
    }
});

module.exports = db;
