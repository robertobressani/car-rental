const moment=require('moment');
const Car= require('./Car.js');

modules.exports= class Rental{
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

    static of(row){
        //TODO implement
    }

}
