import moment from 'moment';

/**
 * Calculates the number of days between two moment dates
 * @param end: date greater then the second
 * @param start: smaller date
 * @return {number}
 */
export  function dateDiff(end, start){
    return moment.duration(end.diff(start)).asDays();
}

/**
 * Converts a moment date to a String
 * @param date to be converted
 * @return {null|string}
 */
export function dateFormat(date){
    if(date.isValid())
        return date.format("yyyy-MM-DD");
    return null;
}
