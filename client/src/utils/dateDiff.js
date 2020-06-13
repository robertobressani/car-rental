import moment from 'moment';

export  function dateDiff(end, start){
    return moment.duration(end.diff(start)).asDays();
}
