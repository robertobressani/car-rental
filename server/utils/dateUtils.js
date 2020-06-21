const moment = require('moment');

module.exports.dateDiff = (end, start)=>{
    return moment.duration(end.diff(start)).asDays();
}

module.exports.dateFormat = (date)=>{
    return date.format("yyyy-MM-DD");
}
