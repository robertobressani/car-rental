'use strict';

const Car = require('../entity/Car');
const db= require('../utils/db_promise');

module.exports.getCar=()=>{
    return db.queryAll("SELECT * FROM cars").then(cars=>cars.map((row) => Car.of(row)));
}

module.exports.getBrands=()=>{
    return db.queryAll("SELECT DISTINCT brand FROM cars").then(rows=>rows.map(x=>x.brand));
}
