const moment = require('moment');
const dateDiff = require('../utils/dateDiff');

module.exports=  class Configuration{
    constructor(start="", end="", category="", kilometer=0, unlimited=false, age=18, extra_drivers=0, insurance=false) {
        this.start=moment(start);
        this.end=moment(end);
        this.category= category;
        this.kilometer=kilometer;
        this.unlimited=unlimited;
        this.age=age;
        this.extra_drivers=extra_drivers;
        this.insurance=insurance;
    }

    isValid(){
        let today=moment();
        today.hour(0);
        today.minute(0);
        today.second(0)
        today.millisecond(0);
        return this.start && dateDiff(this.start, today) > 0
            && this.end && dateDiff(this.end, this.start) > 0 && ["A", "B", "C", "D", "E", "F"].includes(this.category)
            && (this.unlimited || this.kilometer > 0) && this.age >= 18 && +this.extra_drivers >= 0; //check whether it's integer

    }

    static of(){
        //TODO implement
    }
}
