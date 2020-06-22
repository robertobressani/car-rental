import Car from "../entity/Car";
import Rental from "../entity/Rental";
import {encodeQueryData} from "../utils/queryParams";

const BASE_URL="/api/";

async function getCars(){
    const response = await fetch(`${BASE_URL}cars`);
    const jsonCars = await response.json();
    if(!response.ok) {
        const err = {status: response.status, message: jsonCars.msg}
        throw err;
    }
    return  jsonCars.map(json=>Car.of(json));
    //return [new Car(1,"Alfa", "A","Romeo", 100 ), new Car(2, "Fiat", "E", "500",500)];
}

async function getBrands(){
    const response = await fetch(`${BASE_URL}brands`);
    const jsonBrands = await response.json();
    if(!response.ok) {
        const err = {status: response.status, message: jsonBrands.msg};
        throw err;
    }
    return  jsonBrands;

    //return ["Alfa", "Fiat"];
}

async function checkAuthentication() {
    const response =  await fetch(`${BASE_URL}login`);
    if(response.ok && response.status === 200)
        return await response.json();
    const empty={};
    throw empty;
}
async function login(email, password){
    const response =  await fetch(`${BASE_URL}login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({email: email, password: password})
    });
    if(response.ok)
        return await response.json();
    switch (response.status) {
        case 401:
            const err={err:"Wrong username or password"};
            throw err;
        default:
            const errmsg={err:"Something went wrong during the call"};
            throw errmsg;
    }


}

async function logout(){
    const response =  await fetch(`${BASE_URL}logout`, {
        method: 'POST'
    });
    if(response.ok)
        return;
    const err={err: "Error in logout call"};
    throw err;
}

async function getRentals(ended){
    const response = await fetch(`${BASE_URL}rentals?ended=${ended}`)
    if(response.ok){
        const result= await response.json();
        console.log(result.map(x=>Rental.of(x)));
        return result.map(x=>Rental.of(x));
    }
    const err={err: "Error in loading rentals"};
    throw err;
    // return [new Rental(1, null, null, 200, false, 18, 5, true,
    //     new Car(1,"Alfa", "A","Romeo", 100 ) ),
    //     new Rental(2, "", "", 200, true, 18, 5, true,
    //         new Car(1,"Alfa", "A","Romeo", 100 ) )];
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

async function searchConfig(configuration){
    const query= encodeQueryData(configuration);
    const response  = await fetch(`${BASE_URL}/configuration?${query}`);
    if(response.ok && response.status === 200)
        return await response.json();
    const empty={};
    throw empty;
}

async function saveRental(configuration, creditCard, price) {

    const payment_res = await fetch(`${BASE_URL}pay`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({credit_card: creditCard, amount: price})
    });

    if(payment_res.ok){

        const msg= await payment_res.json(); //the fake receipt payment code
        const reservation_res =  await fetch(`${BASE_URL}rentals`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({configuration: configuration, amount: price, receipt: msg.receipt})
        });
        if(reservation_res.ok)
            return true;
    }
     return false;
}

const API={checkAuthentication, logout, login, getCars, getBrands, getRentals, deleteRental, searchConfig, saveRental}
export default API;
