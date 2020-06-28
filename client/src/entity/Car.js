/**
 * Class that represent a car. The price is used sometimes for the minimum price (CarList)
 * and sometimes for the rental price (Rentals)
 */
export default class Car{
    constructor(id, brand, category, model, price) {
        this.id= id;
        this.brand=brand;
        this.category=category;
        this.model=model;
        this.price=price;
    }

    /**
     * Parses a JSON to get a Car object
     * @param json
     * @return {Car}
     */
    static of(json){
        return Object.assign(new Car(), json);
    }
}
