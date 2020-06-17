const confs= require('../config/rental_conf');

module.exports=class Car{
    constructor(id, brand, category, model, price) {
        this.id= id;
        this.brand=brand;
        this.category=category;
        this.model=model;
        this.price=price;
    }

    static of(row){
        let price=confs.prices.get(row.category);

        for(let discount of confs.discounts.values())
            if (discount < 1)
                price *= discount;

        return new Car(row.id, row.brand, row.category, row.model, price);
    }
}
