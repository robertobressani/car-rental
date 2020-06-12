class Car{
    constructor(id, brand, category, model, price) {
        this.id= id;
        this.brand=brand;
        this.category=category;
        this.model=model;
        this.price=price;
    }
    static of(json){
        return Object.assign(new Car(), json);
    }
}
