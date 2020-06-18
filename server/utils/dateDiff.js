const moment = require('moment');

module.exports = (end, start)=>{
    return moment.duration(end.diff(start)).asDays();
}
