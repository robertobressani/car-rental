import moment from 'moment';

export  function dateUtils(end, start){
    return moment.duration(end.diff(start)).asDays();
}

export function dateFormat(date){
    if(date && date.isValid())
        return date.format("yyyy-MM-DD");
    return false;
}
