const moment = require('moment');
const {dateDiff} = require("../utils/dateUtils");

/**
 * Represents a configuration object for managing the configurator request
 */
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

    /**
     * Checks the validity of the Configuration object
     * @return {boolean}
     */
    isValid(){
        let today=moment();
        today.hour(0);
        today.minute(0);
        today.second(0)
        today.millisecond(0);
        return this.start && this.start.isValid() && dateDiff(this.start, today) > 0
             && this.end && this.end.isValid() && dateDiff(this.end, this.start) >= 0 && ["A", "B", "C", "D", "E", "F"].includes(this.category)
            && (this.unlimited || this.kilometer > 0) && this.age >= 18 && this.age<100
            && +this.extra_drivers >= 0; //check whether it's integer

    }

    /**
     * Function to get a Configuration object from a generic object coming from a URI param
     * @param obj
     * @return {Configuration}
     */
    static of(obj){
        const conf=new Configuration(obj.start, obj.end, obj.category, +obj.kilometer,
            //needed to cast 'false' to false and same for 'true'
            JSON.parse(obj.unlimited), +obj.age,
            +obj.extra_drivers, JSON.parse(obj.insurance) );
        if(conf.isValid())
            return conf;
        throw {err: "Invalid configuration object"};
    }
}
