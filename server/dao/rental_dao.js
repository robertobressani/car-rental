const db= require('../utils/db_promise');
const moment = require('moment');
const dateUtils = require("../utils/dateUtils");
const rentalConfig = require('../config/rental_conf');
const Rental = require('../entity/Rental');

/**
 * Query to get number of available cars in a time window for a given category
 * @type {string}
 */
const availableCarsQuery= "SELECT COUNT(*) AS total " +
    "FROM cars " +
    "WHERE category= ? AND id NOT IN ( SELECT car_id " +
                    "FROM rentals " +
                    "WHERE (start_day BETWEEN ? AND  ?) " +
                    "OR ( end_day BETWEEN ? AND  ? ) " +
                    "OR ( start_day <= ? AND end_day >= ? ));";

/**
 * Query to choose the ID of a car to rent
 * @type {string}
 */
const chooseCarQuery="SELECT id " +
    "FROM cars " +
    "WHERE category= ? AND id NOT IN ( SELECT car_id " +
                        "FROM rentals " +
                        "WHERE (start_day BETWEEN ? AND  ?) " +
                        "OR ( end_day BETWEEN ? AND  ? ) " +
                        "OR ( start_day <= ? AND end_day >= ? )) " +
                        "LIMIT 1;";

/**
 * Query to get the number of rentals that a user has already terminated
 * @type {string}
 */
const numPastRentalsQuery="SELECT COUNT(*) AS num_rental " +
    "FROM rentals " +
    "WHERE user_id= ? AND end_day < ? ;";

/**
 * Query to get the cars of a given category
 * @type {string}
 */
const numCarPerCategoryQuery="SELECT COUNT(*) AS cars " +
    "FROM cars " +
    "WHERE category= ? ;";

/**
 * Query to get the past (by concatenating "<?") or the current-future (+">?") rentals of a user
 * @type {string}
 */
const rentalsQuery="SELECT * " +
    "FROM cars c, rentals r  " +
    "WHERE c.id= r.car_id AND  user_id = ? and end_day ";

/**
 * Query to insert a rental
 * @type {string}
 */
const insertRentalQuery= "INSERT INTO rentals(user_id, car_id, start_day, end_day, kilometer, unlimited_km, driver_age," +
    " extra_drivers, extra_insurance, price) " +
    "VALUES (?,?,?,?,?,?,?,?,?,?);";

/**
 * Query to delete a rental, it also performs the checks for the deletion
 * @type {string}
 */
const deleteRentalQuery = "DELETE FROM rentals WHERE id=? AND user_id=? AND start_day>?;";

/**
 * Function to get the availability for a given configuration
 * @param conf the Configuration object
 * @param userId the user requested the rental
 * @return {Promise<{price: number, available: number}>}
 */
module.exports.searchRental=async (conf, userId)=>{
    await db.queryRun("BEGIN TRANSACTION");
    const res= computePrice(conf, userId);
    await db.queryRun("COMMIT TRANSACTION");
    return res;
}
/**
 * Function to get the rentals of a user
 * @param past boolean to indicate if it is in the past or not
 * @param userId the user who performs the request
 * @return {Promise}
 */
module.exports.getRentals=async(past, userId)=>{
    let symbol=">= ?;";
    if(past)
        symbol = "< ?;";
    const res= await db.queryAll(rentalsQuery+symbol, [userId, dateUtils.dateFormat(new moment()) ]);
    return res.map(x => Rental.of(x));

}

/**
 * function to add the rental
 * @param conf the Configuration object
 * @param price the price the user paid for
 * @param userId who performed the request
 * @return {Promise<void>}
 */
module.exports.addRental= async(conf, price, userId)=>{
    await db.queryRun("BEGIN TRANSACTION");
    const res= await computePrice(conf, userId);
    if(res.price!==price){
        //price is different, due to race conditions
        await db.queryRun("ROLLBACK TRANSACTION");
        throw "Invalid price request";
    }

    //getting the id of the car that will be rent
    const carId = (await db.queryGet(chooseCarQuery, [conf.category, dateUtils.dateFormat(conf.start),
        dateUtils.dateFormat(conf.end), dateUtils.dateFormat(conf.start), dateUtils.dateFormat(conf.end),
        dateUtils.dateFormat(conf.start), dateUtils.dateFormat(conf.end)] )).id;

    //saving the rental
    await db.queryRun(insertRentalQuery, [userId, carId,dateUtils.dateFormat(conf.start),
        dateUtils.dateFormat(conf.end), conf.kilometer, conf.unlimited, conf.age,conf.extra_drivers, conf.insurance ,
        price]);
    await db.queryRun("COMMIT TRANSACTION");
}

/**
 * Function to delete the rental
 * @param userId who performed the request
 * @param rentalId to be deleted
 * @return {Promise<boolean>}
 */
module.exports.deleteRental=async (userId, rentalId)=>{
    await db.queryRun("BEGIN TRANSACTION");
    const res= await db.queryRun(deleteRentalQuery, [rentalId, userId, dateUtils.dateFormat(moment())]);
    await db.queryRun("COMMIT TRANSACTION");
    return res===1;
}

/**
 * Function to compute the price for a given configuration
 * @param conf the Configuration object
 * @param userId who performs the request
 * @return {Promise<{price: number, available: number}>}
 */
async function computePrice(conf, userId) {
    const results = await Promise.all(
        [
            /**
             * query to get the number of available cars in the period for the requested category
             */
            db.queryGet(availableCarsQuery, [conf.category, dateUtils.dateFormat(conf.start),
                dateUtils.dateFormat(conf.end), dateUtils.dateFormat(conf.start), dateUtils.dateFormat(conf.end),
                dateUtils.dateFormat(conf.start), dateUtils.dateFormat(conf.end)]),
            /**
             * query to get number of past rentals of the user
             */
            db.queryGet(numPastRentalsQuery, [userId, dateUtils.dateFormat(new moment())]),
            /**
             * query to get number of total cars for the chosen category
             */
            db.queryGet(numCarPerCategoryQuery, [conf.category])
        ]);

    if(results[0].total > 0) {
        //cars available
        const price_per_day = rentalConfig.prices.get(conf.category);
        const num_day = dateUtils.dateDiff(conf.end, conf.start) + 1;//+1 considering the rental starting at 00:00 of conf.start
        // and ending at 23:59 of conf.end

        //base price computation
        let price = num_day * price_per_day;

        //discount / fees additions for kms
        if(conf.unlimited)
            price *= rentalConfig.discounts.get("high_km");
        else if(conf.kilometer<50)
            price *= rentalConfig.discounts.get("low_km");
        else
            price *= rentalConfig.discounts.get("medium_km");

        //age fees
        if(conf.age<25)
            price *= rentalConfig.discounts.get("under_25");
        else if(conf.age>65)
            price *= rentalConfig.discounts.get("over_65");

        //extra drivers fee
        if (conf.extra_drivers)
            price *= rentalConfig.discounts.get("extra_drivers");

        //insurance fee
        if(conf.insurance)
            price *= rentalConfig.discounts.get("extra_insurance");

        //fee for criticality
        if((results[0].total / results[2].cars) < rentalConfig.availability_threshold)
            price *= rentalConfig.discounts.get("few_cars");

        //discount for fidelity
        if(results[1].num_rental >= rentalConfig.min_frequent_rentals)
            price *= rentalConfig.discounts.get("frequent_customer");

        return {price: +(price.toFixed(2)), available: results[0].total}
    }
    // no available cars
    return {price: -1, available: 0};
}
