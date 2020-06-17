'use strict';

const Car = require('../entity/Car');
const db = require('../db/db');

module.exports.getCar=()=>{
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM cars";
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                let cars = rows.map((row) => Car.of(row));
                resolve(cars);
            }
        });
    });
}

module.exports.getBrands=()=>{
    return new Promise((resolve, reject) => {
        const sql = "SELECT DISTINCT brand FROM cars";
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
            } else {
               resolve(rows.map(x=>x.brand));
            }
        });
    });
}
