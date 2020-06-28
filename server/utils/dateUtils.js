const moment = require('moment');

/**
 * Calculates the number of days between two moment dates
 * @param end: date greater then the second
 * @param start: smaller date
 * @return {number}
 */
module.exports.dateDiff = (end, start)=>{
    return moment.duration(end.diff(start)).asDays();
}

/**
 * Converts a moment date to a String
 * @param date to be converted
 * @return {null|string}
 */
module.exports.dateFormat = (date)=>{
    return date.format("yyyy-MM-DD");
}
