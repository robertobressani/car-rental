'use strict';

const Car = require('../entity/Car');
const db= require('../utils/db_promise');

const getAllCarQuery="SELECT * FROM cars";
const getAllBrandsQuery="SELECT DISTINCT brand FROM cars"

/**
 * Returns all the car present in the db
 * @return {Promise}
 */
module.exports.getCar=()=>{
    return db.queryAll(getAllCarQuery).then(cars=>cars.map((row) => Car.of(row)));
}
/**
 * Returns all the brands
 * @return {Promise}
 */
module.exports.getBrands=()=>{
    return db.queryAll(getAllBrandsQuery).then(rows=>rows.map(x=>x.brand));
}
