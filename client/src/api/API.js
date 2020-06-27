import Car from "../entity/Car";
import Rental from "../entity/Rental";
import {encodeQueryData} from "../utils/queryParams";

const BASE_URL="/api/";


const errorCars={msg: "Unable to get the cars, please retry later" };
const errorBrands={msg: "Unable to load brands' list, please retry later"};
const loginErr={msg:"Wrong username or password"};
const networkErr={msg: "Something went wrong during the request, try later or check your internet connection"}
const errorRentals={msg: "Unable to load rentals' list, please try again"};


async function getCars(){
    const response = await fetch(`${BASE_URL}cars`);

    if(!response.ok) {
       throw errorCars;
    }
    const jsonCars = await response.json();
    return  jsonCars.map(json=>Car.of(json));
}

async function getBrands(){
    const response = await fetch(`${BASE_URL}brands`);

    if(!response.ok) {
       throw errorBrands;
    }

    return  await response.json();
}

async function checkAuthentication() {
    const response =  await fetch(`${BASE_URL}login`);
    if(response.ok && response.status === 200)
        return await response.json();
    return false;
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
            throw loginErr;
        default:
           throw networkErr;
    }
}

async function logout(){
    const response =  await fetch(`${BASE_URL}logout`, {
        method: 'POST'
    });
    if(response.ok)
        return;
    throw networkErr;
}

async function getRentals(ended){
    const response = await fetch(`${BASE_URL}rentals?ended=${ended}`)
    if(response.ok){
        const result= await response.json();
        console.log(result.map(x=>Rental.of(x)));
        return result.map(x=>Rental.of(x));
    }
    if(response.status===401)
        throw 401;
    throw errorRentals;
}

async function deleteRental(x) {
    const response  = await fetch(`${BASE_URL}/rentals/${x}`,{
        method: 'DELETE'
    });
    if(response.status===401)
        throw 401;
    return response.ok;
}

async function searchConfig(configuration){
    const query= encodeQueryData(configuration);
    const response  = await fetch(`${BASE_URL}/configuration?${query}`);
    if(response.ok && response.status === 200)
        return await response.json();
    if(response.status===401)
        throw 401;
    return false;
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
            body: JSON.stringify({configuration: configuration.toNetwork(), amount: price, receipt: msg.receipt})
        });
        if(reservation_res.ok)
            return true;
    }
    if(payment_res.status===401)
        throw 401;
     return false;
}

const API={checkAuthentication, logout, login, getCars, getBrands, getRentals, deleteRental, searchConfig, saveRental}
export default API;
