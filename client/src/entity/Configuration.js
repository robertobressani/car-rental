import moment from "moment";
import {dateDiff, dateFormat} from "../utils/dateUtils";

export default class Configuration {
    constructor(start = "", end = "", category = "", kilometer = 0, unlimited = false, age = 18, extra_drivers = 0, insurance = false) {
        this.start = moment(start);
        this.end = moment(end);
        this.category = category;
        this.kilometer = kilometer;
        this.unlimited = unlimited;
        this.age = age;
        this.extra_drivers = extra_drivers;
        this.insurance = insurance;
    }

    isClear() {
        return !(this.start.isValid() || this.end.isValid() || this.category!==""
            || this.kilometer || this.unlimited || this.age !==18 || this.extra_drivers || this.insurance);
    }

    isValid() {
        let today = moment();
        today.hour(0);
        today.minute(0);
        today.second(0)
        today.millisecond(0);
        return this.isCompleted() && dateDiff(this.start, today) > 0
            && dateDiff(this.end, this.start) >= 0 && this.age >= 18 && this.age < 100;

    }

    isCompleted() {
        return this.start && this.start.isValid()
            && this.end && this.end.isValid() && ["A", "B", "C", "D", "E", "F"].includes(this.category)
            && (this.unlimited || this.kilometer > 0) && this.extra_drivers >= 0;

    }

    toNetwork() {
        const conf = {...this};
        conf.start = dateFormat(conf.start);
        conf.end = dateFormat(conf.end);
        return conf;
    }
}
