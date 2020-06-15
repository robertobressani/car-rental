import moment from 'moment';
import Car from './Car.js';

export default class Rental{
    constructor(id,start, end, kilometer, unlimited, age, extra_drivers, insurance, car ) {
        this.id=id;
        this.start=moment(start);
        this.end=moment(end);
        this.kilometer=kilometer;
        this.unlimited=unlimited;
        this.age=age;
        this.extra_drivers=extra_drivers;
        this.insurance=insurance;
        this.car=Car.of(car);
    }

    static of(json){
        const r= Object.assign(new Rental(), json);
        r.start=moment(r.start);
        r.end=moment(r.end);
        r.car= Object.assign(new Car(), r.car);
    }

}
