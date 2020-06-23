const moment=require('moment');
const Car= require('./Car.js');

module.exports= class Rental{
    constructor(id,start, end, kilometer, unlimited, age, extra_drivers, insurance, car ) {
        this.id=id;
        this.start=moment(start);
        this.end=moment(end);
        this.kilometer=kilometer;
        this.unlimited=unlimited;
        this.age=age;
        this.extra_drivers=extra_drivers;
        this.insurance=insurance;
        this.car=car;
    }

    static of(row){
        return new Rental(row.id, moment(row.start_day), moment(row.end_day), row.unlimited_km ? -1 :row.kilometer,
            !!row.unlimited_km, row.driver_age, row.extra_drivers, row.extra_insurance,
            new Car(row.car_id,row.brand, row.category,row.model, row.price ) );
    }

}
