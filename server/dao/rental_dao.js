const db= require('../utils/db_promise');
const moment = require('moment');
const dateUtils = require("../utils/dateUtils");
const rentalConfig = require('../config/rental_conf');

const availableCarsQuery= "SELECT COUNT(*) AS total " +
    "FROM cars " +
    "WHERE category= ? AND id NOT IN ( SELECT car_id " +
                    "FROM rentals " +
                    "WHERE (start_day >= ? AND start_day <= ?) " +
                    "OR ( end_day >= ? AND end_day <= ? ));";

const numPastRentalsQuery="SELECT COUNT(*) AS num_rental " +
    "FROM rentals " +
    "WHERE user_id= ? AND end_day < ? ;";

const numCarPerCategoryQuery="SELECT COUNT(*) AS cars " +
    "FROM cars " +
    "WHERE category= ? ;";

module.exports.searchRental=async (conf, userId)=>{
    await db.queryRun("BEGIN TRANSACTION");
    const res= computePrice(conf, userId);
    await db.queryRun("COMMIT TRANSACTION");
    return res;
}

async function computePrice(conf, userId) {
    const results = await Promise.all(
        [
            /**
             * query to get the number of available cars in the period for the requested category
             */
            db.queryGet(availableCarsQuery, [conf.category, dateUtils.dateFormat(conf.start),
                dateUtils.dateFormat(conf.end), dateUtils.dateFormat(conf.start), dateUtils.dateFormat(conf.end)]),
            /**
             * query to get number of past rentals of the user
             */
            db.queryAll(numPastRentalsQuery, [userId, dateUtils.dateFormat(new moment())]),
            /**
             * query to get number of total cars for the chosen category
             */
            db.queryAll(numCarPerCategoryQuery, [conf.category])
        ]);
   
    if(results[0].total > 0) {
        //cars available
        const price_per_day = rentalConfig.prices.get(conf.category);
        const num_day = dateUtils.dateDiff(conf.end, conf.start) + 1;//+1 considering the rental starting at 00:00 of conf.start
        // and ending at 23:59 of conf.end
        let price = num_day * price_per_day;
        if(conf.unlimited)
            price *= rentalConfig.discounts.get("high_km");
        else if(conf.kilometer<50)
            price *= rentalConfig.discounts.get("low_km");
        else
            price *= rentalConfig.discounts.get("medium_km");

        if(conf.age<25)
            price *= rentalConfig.discounts.get("under_25");
        else if(conf.age>65)
            price *= rentalConfig.discounts.get("over_65");

        if (conf.extra_drivers)
            price *= rentalConfig.discounts.get("extra_drivers");

        if(conf.insurance)
            price *= rentalConfig.discounts.get("extra_insurance");

        if((results[0].total / results[2].cars) < rentalConfig.availability_threshold)
            price *= rentalConfig.discounts.get("few_cars");

        if(results[1].num_rental >= rentalConfig.min_frequent_rentals)
            price *= rentalConfig.discounts.get("frequent_customer");

        return {price: price, available: results[0].total}
    }
    // no available cars
    return {price: -1, available: 0};
}
