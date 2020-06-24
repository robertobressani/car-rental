import moment from 'moment';

export  function dateDiff(end, start){
    return moment.duration(end.diff(start)).asDays();
}

export function dateFormat(date){
    if(date.isValid())
        return date.format("yyyy-MM-DD");
    return false;
}
