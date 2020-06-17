import Car from "../entity/Car";
import Rental from "../entity/Rental";

const BASE_URL="/api/";

async function getCars(){
    const response = await fetch(`${BASE_URL}cars`);
    const jsonCars = await response.json();
    if(!response.ok)
        throw {status: response.status, message: jsonCars.msg }
    return  jsonCars.map(json=>Car.of(json));
    //return [new Car(1,"Alfa", "A","Romeo", 100 ), new Car(2, "Fiat", "E", "500",500)];
}

async function getBrands(){
    const response = await fetch(`${BASE_URL}brands`);
    const jsonBrands = await response.json();
    if(!response.ok)
        throw {status: response.status, message: jsonBrands.msg }
    return  jsonBrands;

    //return ["Alfa", "Fiat"];
}

async function checkAuthentication() {
    const response =  await fetch(`${BASE_URL}login`);
    if(response.ok && response.status === 200)
        return await response.json();
    throw {};
}
async function login(email, password){
    //TODO implement
    const response =  await fetch(`${BASE_URL}login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({email: email, password: password}),
    });
    if(response.ok)
        return await response.json();
    switch (response.status) {
        case 401:
            throw "Wrong username or password";
        default:
            throw "Something went wrong during the call";
    }


}

async function logout(){
    //TODO implement
}

async function getRentals(future){
    //TODO implement
    return [new Rental(1, null, null, 200, false, 18, 5, true,
        new Car(1,"Alfa", "A","Romeo", 100 ) ),
        new Rental(2, "", "", 200, true, 18, 5, true,
            new Car(1,"Alfa", "A","Romeo", 100 ) )];
}

async function deleteRental(x) {
    console.log("I'm deleting "+x);
    return new Promise(((resolve, reject) =>
            setTimeout(()=>
                    resolve("Roberto")
                    // reject()
                , 2000)
    ));
    //TODO implement
}


const API={checkAuthentication, logout, login, getCars, getBrands, getRentals, deleteRental}
export default API;
